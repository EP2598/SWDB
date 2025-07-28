/**
 * Core Logging Utilities
 * Shared functions for file-based logging (Node.js environment)
 */

import fs from 'fs';
import path from 'path';

/**
 * Write error directly to log file (Node.js only)
 * @param {string} error - Error message to log
 * @param {string} context - Error context
 * @param {Date} timestamp - Timestamp of the error
 * @returns {object} - Result with file information
 */
export const writeErrorToFile = (error, context, timestamp) => {
  try {
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');
    const hours = String(timestamp.getHours()).padStart(2, '0');
    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
    const seconds = String(timestamp.getSeconds()).padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const fileName = `${dateStr} ErrLog.txt`;
    const logEntry = `${timeStr} - [${context}] ${error}\n`;
    
    // Ensure directory exists
    const logDir = path.join(process.cwd(), 'logs', year.toString());
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Write to log file
    const logFilePath = path.join(logDir, fileName);
    fs.appendFileSync(logFilePath, logEntry);
    
    return {
      success: true,
      file: fileName,
      path: logFilePath,
      message: 'Error logged successfully'
    };
    
  } catch (err) {
    console.error('Failed to write log file:', err);
    return {
      success: false,
      error: err.message,
      message: 'Failed to log error'
    };
  }
};

/**
 * Read all log files from the file system
 * @returns {object} - Object with log file names and their content
 */
export const readAllLogFiles = () => {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const logs = {};
    
    if (fs.existsSync(logsDir)) {
      const years = fs.readdirSync(logsDir);
      
      for (const year of years) {
        const yearDir = path.join(logsDir, year);
        if (fs.statSync(yearDir).isDirectory()) {
          const logFiles = fs.readdirSync(yearDir);
          
          for (const file of logFiles) {
            if (file.endsWith('.txt')) {
              const filePath = path.join(yearDir, file);
              const content = fs.readFileSync(filePath, 'utf8');
              logs[file] = content;
            }
          }
        }
      }
    }
    
    return logs;
  } catch (err) {
    console.error('Failed to read logs:', err);
    return {};
  }
};
