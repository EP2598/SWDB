/**
 * Simple proxy server to bypass SSL/TLS issues
 * Run this with: node proxy-server.js
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';
import { writeErrorToFile, readAllLogFiles } from './src/utils/fileLogger.js';

// Disable SSL certificate verification (NOT for production)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const PROXY_PORT = 3001;
const SWAPI_BASE = 'https://swapi.dev/api';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle logging endpoint
  if (req.method === 'POST' && req.url === '/log-error') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { error, context, timestamp } = JSON.parse(body);
        
        if (!error || !context || !timestamp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }
        
        // Use shared logging utility
        const result = writeErrorToFile(error, context, new Date(timestamp));
        
        console.log(`📝 Error logged to: ${result.path}`);
        
        res.writeHead(result.success ? 200 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        
      } catch (err) {
        console.error('Failed to parse logging request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid request format' }));
      }
    });
    
    return;
  }
  
  // Handle get logs endpoint
  if (req.method === 'GET' && req.url === '/get-logs') {
    try {
      const logs = readAllLogFiles();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(logs));
      
    } catch (err) {
      console.error('Failed to read logs:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read logs' }));
    }
    
    return;
  }
  
  // Only handle GET requests to SWAPI
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  // Parse the request URL
  const parsedUrl = new URL(req.url, `http://localhost:${PROXY_PORT}`);
  const targetUrl = SWAPI_BASE + parsedUrl.pathname + parsedUrl.search;
  
  console.log(`Proxying request to: ${targetUrl}`);
  
  // Make request to SWAPI
  https.get(targetUrl, {
    rejectUnauthorized: false, // Bypass SSL certificate verification
    timeout: 10000
  }, (apiRes) => {
    let data = '';
    
    // Set response headers
    res.writeHead(apiRes.statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Collect data
    apiRes.on('data', chunk => {
      data += chunk;
    });
    
    // Send response
    apiRes.on('end', () => {
      res.end(data);
    });
    
  }).on('error', (error) => {
    console.error('Proxy error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Proxy server error', 
      message: error.message 
    }));
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`\n🚀 SWAPI Proxy Server running on http://localhost:${PROXY_PORT}`);
  console.log(`📡 Proxying requests to: ${SWAPI_BASE}`);
  console.log(`🔧 SSL Certificate verification: DISABLED`);
  console.log(`\nUsage in your app:`);
  console.log(`const SWAPI_BASE_URL = 'http://localhost:${PROXY_PORT}';`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
