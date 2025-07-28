# SSL/TLS Bypass Solutions for SWAPI

## Problem
The SWAPI (https://swapi.dev/api) sometimes has SSL/TLS certificate issues that prevent the browser from making requests.

## Solutions

### Option 1: Use Proxy Server (Recommended for Development)

1. **Start the proxy server:**
   ```bash
   npm run proxy
   ```
   This starts a proxy server on `http://localhost:3001` that bypasses SSL certificate verification.

2. **Start your app in another terminal:**
   ```bash
   npm run dev
   ```

3. **Or run both together:**
   ```bash
   npm install concurrently --save-dev
   npm run dev-with-proxy
   ```

The app will automatically detect if the proxy is running and use it to bypass SSL issues.

### Option 2: Browser Flags (Temporary Fix)

**Chrome/Edge (NOT RECOMMENDED for normal browsing):**
```bash
chrome.exe --disable-web-security --ignore-certificate-errors --ignore-ssl-errors --allow-running-insecure-content
```

**Firefox:**
1. Go to `about:config`
2. Set `security.mixed_content.block_active_content` to `false`
3. Set `security.mixed_content.block_display_content` to `false`

### Option 3: Accept Certificate in Browser

1. Visit https://swapi.dev/api/people/1/ directly in your browser
2. Click "Advanced" if you see a security warning
3. Click "Proceed to swapi.dev (unsafe)" or similar
4. This will add an exception for the certificate

## How the Proxy Works

The proxy server (`proxy-server.js`):
- Runs on `http://localhost:3001`
- Forwards requests to `https://swapi.dev/api`
- Disables SSL certificate verification with `rejectUnauthorized: false`
- Adds CORS headers for browser compatibility
- Automatically used by the app if available

## Important Security Notes

⚠️ **These solutions are for development only!**
- Never use `--disable-web-security` for normal browsing
- The proxy server disables SSL verification (unsafe for production)
- Only use these methods in controlled development environments

## Troubleshooting

If you still get SSL errors:
1. Make sure the proxy server is running (`npm run proxy`)
2. Check if port 3001 is available
3. Try accessing http://localhost:3001/people/1/ directly in browser
4. Check the browser console for detailed error messages
