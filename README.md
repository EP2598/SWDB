# SWDB - Star Wars Database

A comprehensive Vue.js 3 application that provides a complete interface to the Star Wars API (SWAPI) with advanced error logging, SSL bypass capabilities, and beautiful responsive design.

## 🌟 Features

- 🚀 **Vue.js 3** with Composition API and `<script setup>` syntax
- ⚡ **Vite** for fast development and building
- � **Complete SWAPI Integration** with SSL bypass for reliable data fetching
- 📱 **Responsive Design** that works on all devices
- 🔄 **Advanced Loading States** and comprehensive error handling
- 🎨 **Beautiful UI** with consistent theming and smooth animations
- 🛠️ **Modular Architecture** with utilities, composables, and shared components
- 📝 **Professional Error Logging** with file-based storage system
- 🌐 **Proxy Server** for SSL certificate bypass and logging endpoints
- 🔍 **Complete Navigation** between Films, People, Planets, and Species
- 🎯 **camelCase API** conversion for consistent JavaScript usage
- ✨ **Title Case Formatting** for enhanced readability

## 🎬 Star Wars Data

The application provides complete access to:
- **Films** - All Star Wars movies with detailed information
- **People** - Characters with biographical data and relationships
- **Planets** - Homeworlds with environmental and demographic data  
- **Species** - Alien species with characteristics and origins
- **Vehicles & Starships** - Transportation with technical specifications

## 📁 Project Structure

```
src/
├── components/
│   ├── DataDisplay.vue         # Main data browser component
│   ├── FilmDetail.vue         # Detailed film information
│   ├── PeopleDetail.vue       # Character profile pages
│   └── *.vue.css             # Component-specific styles
├── router/
│   └── index.js              # Vue Router configuration
├── utils/
│   ├── apiUtils.js           # SWAPI integration utilities
│   ├── logger.js             # Browser-side error logging
│   ├── fileLogger.js         # Server-side logging utilities
│   └── composables.js        # Reusable Vue composables
├── App.vue                   # Main application component
└── main.js                   # Application entry point
```

## 🔧 Additional Files

```
proxy-server.js               # Node.js proxy with SSL bypass
working-logging-demo.html     # Logging system demonstration
logs/                        # Error log storage (auto-created)
├── 2025/
│   └── 2025-MM-DD ErrLog.txt
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18.0.0 or higher)
- **npm** or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/EP2598/SWDB.git
   cd SWDB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the proxy server** (for SSL bypass and logging)
   ```bash
   node proxy-server.js
   ```
   The proxy server will run on `http://localhost:3001`

4. **Start the development server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The Vue.js app will run on `http://localhost:5173`

5. **Open your browser** and visit `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start Vue.js development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `node proxy-server.js` - Start the SWAPI proxy server with SSL bypass

## 🔧 Key Technologies

### Frontend
- **Vue.js 3** with Composition API
- **Vue Router 4** for navigation
- **Vite 7** for development and building
- **Modern CSS** with component-scoped styles

### Backend Services  
- **Node.js Proxy Server** for SSL certificate bypass
- **File-based Logging System** with automatic directory creation
- **RESTful API Integration** with comprehensive error handling

### Data Processing
- **camelCase Conversion** for JavaScript compatibility
- **Title Case Formatting** for enhanced readability
- **Relationship Mapping** between SWAPI entities
- **Automatic Pagination** handling

## 📝 Error Logging System

The application includes a comprehensive error logging system:

- **Browser-side logging** via `src/utils/logger.js`
- **Server-side logging** via `src/utils/fileLogger.js`  
- **HTTP endpoints** at `/log-error` and `/get-logs`
- **Automatic file creation** in `logs/YYYY/` directory structure
- **localStorage fallback** when server is unavailable
- **Demo interface** at `working-logging-demo.html`

## 🌐 SWAPI Integration

### SSL Certificate Bypass
The proxy server handles SWAPI's SSL certificate issues by:
- Disabling certificate verification for SWAPI requests
- Providing reliable API access through `http://localhost:3001`
- Maintaining full HTTPS security for your local development

### Data Enhancement
- **Automatic camelCase conversion** for all API responses
- **Title case formatting** for names and titles
- **Relationship resolution** between films, characters, and planets
- **Consistent error handling** across all API endpoints

## 🎯 Usage Examples

### Browsing Star Wars Data
1. **Films**: Click on any film to see detailed information, cast, and planets
2. **Characters**: Explore character profiles with homeworld and species data
3. **Planets**: Discover worlds with environmental and demographic information
4. **Species**: Learn about different alien species and their characteristics

### Testing Error Logging
1. Open `working-logging-demo.html` in your browser
2. Click "Generate Test Error" to create sample log entries
3. Check the `logs/2025/` directory for generated log files
4. Use "Check Logs" to view stored error data

## 🔍 API Endpoints

The proxy server provides these endpoints:

- `GET /people/:id` - Character information
- `GET /films/:id` - Film details  
- `GET /planets/:id` - Planet data
- `GET /species/:id` - Species information
- `POST /log-error` - Submit error logs
- `GET /get-logs` - Retrieve all log files

## 🛠️ Development Notes

### Code Organization
- **Shared utilities** in `src/utils/` for reusable functions
- **Component-specific styles** in separate `.css` files
- **Modular composables** for state management
- **Clean separation** between browser and server code

### Error Handling
- **Graceful degradation** when APIs are unavailable
- **User-friendly error messages** with actionable guidance
- **Comprehensive logging** for debugging and monitoring
- **Fallback mechanisms** for offline scenarios

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Learn More

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Composition API Guide](https://vuejs.org/guide/composition-api-introduction.html)
- [Star Wars API (SWAPI)](https://swapi.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Vue.js 3 and the Star Wars API**
