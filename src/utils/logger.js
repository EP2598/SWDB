/**
 * Logger Utility
 * Handles error logging to both console and file system via proxy server
 */

/**
 * Write error to log file via proxy server
 * @param {string} error - Error message to log
 * @param {Date} timestamp - Timestamp of the error
 */
const writeToLogFile = async (error, timestamp) => {
  try {
    // Send log data to proxy server
    const response = await fetch('http://localhost:3001/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error,
        context: error.includes('[') ? error.split('[')[1]?.split(']')[0] : 'Unknown',
        timestamp: timestamp.toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to log error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`📝 Error logged to file: ${result.file}`);
    
  } catch (fileError) {
    console.warn('Could not write to log file via proxy:', fileError);
    // Fallback to localStorage if proxy fails
    await writeToLocalStorageFallback(error, timestamp);
  }
};

/**
 * Fallback: Write to localStorage if proxy server fails
 */
const writeToLocalStorageFallback = async (error, timestamp) => {
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
    const logEntry = `${timeStr} - ${error}\n`;
    
    const storageKey = `swdb_log_${fileName}`;
    const existingLog = localStorage.getItem(storageKey) || '';
    const updatedLog = existingLog + logEntry;
    
    localStorage.setItem(storageKey, updatedLog);
    console.log(`📝 Error logged to localStorage as fallback: ${fileName}`);
    
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
};

/**
 * Enhanced error logger that logs to both console and file
 * @param {string} context - Context for the error
 * @param {Error|string} error - Error object or message
 */
export const logError = async (context, error) => {
  const timestamp = new Date();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const fullError = `[${context}] ${errorMessage}`;
  
  // Log to console (existing behavior)
  console.error(`Error ${context}:`, error);
  
  // Log to file via proxy server
  await writeToLogFile(fullError, timestamp);
};

/**
 * Enhanced console.error replacement that also logs to file
 * @param {...any} args - Arguments to log
 */
export const consoleErrorWithLogging = async (...args) => {
  const timestamp = new Date();
  const errorMessage = args.join(' ');
  
  // Log to console (existing behavior)
  console.error(...args);
  
  // Log to file
  await writeToLogFile(errorMessage, timestamp);
};

/**
 * Get all log files from localStorage (fallback)
 * @returns {object} - Object with log file names and their content
 */
export const getAllLogs = () => {
  const logs = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('swdb_log_')) {
      const fileName = key.replace('swdb_log_', '').replace(/_/g, '/');
      logs[fileName] = localStorage.getItem(key);
    }
  }
  return logs;
};

/**
 * Read actual log files from the file system (via proxy)
 * @returns {Promise<object>} - Object with log file names and their content
 */
export const readLogFiles = async () => {
  try {
    const response = await fetch('http://localhost:3001/get-logs');
    if (!response.ok) {
      throw new Error(`Failed to read logs: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Could not read log files from server, using localStorage fallback:', error);
    return getAllLogs();
  }
};

/**
 * Clear all log files from localStorage
 */
export const clearAllLogs = () => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('swdb_log_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Download all logs as a zip file (simplified version)
 */
export const downloadAllLogs = () => {
  const logs = getAllLogs();
  const allLogsContent = Object.entries(logs)
    .map(([fileName, content]) => `=== ${fileName} ===\n${content}\n`)
    .join('\n');
  
  downloadLogFile('all_logs.txt', allLogsContent);
};
