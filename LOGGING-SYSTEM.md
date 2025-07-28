# 📊 SWDB Error Logging System

## Overview
The SWDB (Star Wars Database) application now includes a comprehensive error logging system that captures errors in both the browser console and persistent log files.

## 🎯 Features

### Dual Logging
- **Browser Console**: All errors continue to appear in the developer console
- **File Logging**: Errors are automatically saved to organized log files

### File Organization
```
logs/
└── 2025/
    ├── 2025-07-28 ErrLog.txt
    ├── 2025-07-29 ErrLog.txt
    └── ...
```

### Log Format
Each error entry follows this format:
```
HH:mm:ss - [Context] Error Message
```

Example:
```
14:23:45 - [Proxy request failed] Network error: Unable to connect to SWAPI
14:24:12 - [Error fetching person details] HTTP error! status: 404 - Not Found
```

## 🔧 Implementation

### Core Components

#### 1. Logger Utility (`src/utils/logger.js`)
- `logError(context, error)` - Main logging function
- `consoleErrorWithLogging(...args)` - Enhanced console.error replacement
- `getAllLogs()` - Retrieve all stored logs
- `clearAllLogs()` - Clear all log files
- `downloadAllLogs()` - Download logs as text file

#### 2. Integration Points
- **API Utils** (`src/utils/apiUtils.js`) - Network and API errors
- **Composables** (`src/utils/composables.js`) - Data fetching errors
- **Components** (`src/components/*.vue`) - UI and navigation errors

## 🚀 Usage

### Automatic Logging
All existing error handling automatically logs to files. No additional code needed.

### Manual Logging
```javascript
import { logError } from './utils/logger.js';

try {
  // Your code here
} catch (error) {
  await logError('Custom Context', error);
}
```

## 📁 Storage Mechanism

### Browser Environment
Due to browser security restrictions, the system uses:

1. **LocalStorage**: Temporary storage for log data
2. **Automatic Downloads**: Log files are automatically downloaded to the user's Downloads folder
3. **File System Access API**: Future enhancement for direct file writing (when supported)

### File Naming Convention
- **Directory**: `logs/YYYY/`
- **Filename**: `YYYY-MM-DD ErrLog.txt`
- **Multiple errors per day**: Appended to the same file

## 🎮 Demo & Testing

### Working Demo Pages
1. **`working-logging-demo.html`** - Complete interactive demo (works in Vite dev server)
2. **`simple-logging-test.html`** - Standalone test (works in any browser)

### Error Logging Demo
Open either demo page to:
- Test different types of errors
- View logged errors in storage
- Download log files
- Clear log storage
- See real-time logging in action

### Testing in Main Application
1. Go to `http://localhost:5173`
2. Click the orange "🧪 Test Error Logging" button
3. Check Downloads folder for `YYYY-MM-DD ErrLog.txt` file
4. Check browser console for error messages

### Common Error Types Logged
- **Network Errors**: Connection timeouts, proxy failures
- **API Errors**: HTTP status errors, invalid responses
- **Validation Errors**: Invalid IDs, malformed data
- **Navigation Errors**: Route parsing failures
- **Data Processing Errors**: JSON parsing, type conversion

## 🔍 Monitoring Errors

### Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Errors appear with emoji prefixes:
   - ❌ for errors
   - ✅ for success
   - 🔧 for debugging
   - 📊 for state information

### Log Files
1. Errors automatically download to your Downloads folder
2. Check browser downloads for `*ErrLog.txt` files
3. Use demo page to view all logs in browser

## 📋 Log File Examples

### Network Error Log
```
14:23:45 - [Proxy request failed] TypeError: Failed to fetch
14:23:46 - [Network Error] Network error: Unable to connect to SWAPI. Please check your internet connection.
```

### API Error Log
```
15:10:23 - [Error fetching person details] HTTP error! status: 404 - Not Found
15:10:24 - [API Error] Resource not found.
```

### Validation Error Log
```
16:45:12 - [Could not extract person ID from URL] https://swapi.dev/api/people/invalid/
16:45:13 - [Validation Error] Invalid person ID provided.
```

## 🛠️ Maintenance

### Clearing Logs
```javascript
import { clearAllLogs } from './src/utils/logger.js';
clearAllLogs(); // Removes all stored logs
```

### Downloading All Logs
```javascript
import { downloadAllLogs } from './src/utils/logger.js';
downloadAllLogs(); // Downloads combined log file
```

## 🔮 Future Enhancements

1. **Server-Side Logging**: Send errors to a logging server
2. **Log Rotation**: Automatic cleanup of old log files
3. **Error Analytics**: Dashboard for error patterns
4. **Real-Time Monitoring**: Live error streaming
5. **File System Access**: Direct file writing when browser support improves

## 🎯 Benefits

- **Debugging**: Easier error tracking and debugging
- **User Support**: Users can provide log files for support
- **Monitoring**: Track application health and error patterns
- **Development**: Better understanding of failure points
- **Maintenance**: Historical error data for improvements
