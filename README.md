# SWDB - Vue.js API Data Fetcher

A Vue.js 3 application built with Vite that demonstrates fetching data from external APIs (including Star Wars data) and displaying it in a beautiful, responsive interface.

## Features

- 🚀 Vue.js 3 with Composition API and `<script setup>` syntax
- ⚡ Vite for fast development and building
- 🌐 External API integration with error handling
- 📱 Responsive design that works on all devices
- 🔄 Loading states and error handling
- 🎨 Beautiful UI with smooth animations
- 🛠️ Modular architecture with composables and services

## API Integration

The application demonstrates fetching data from external APIs with endpoints for:
- JSONPlaceholder API (Posts, Users, Albums, Todos)
- Easily extensible for Star Wars API (SWAPI) or any other external API

You can easily extend this to work with any external API by modifying the `src/services/apiService.js` file.

## Project Structure

```
src/
├── components/
│   └── DataDisplay.vue      # Main component for displaying API data
├── composables/
│   └── useApi.js           # Composable for API state management
├── services/
│   └── apiService.js       # API service for HTTP requests
├── App.vue                 # Main application component
└── main.js                 # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (version 22.11.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Copy environment variables:
   ```bash
   copy .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Adding Your Own APIs

1. Update `src/services/apiService.js` to add your API configuration
2. Create new methods in the service for your specific endpoints
3. Use the `useApi` composable in your components for state management
4. Add your API keys to `.env.local` (never commit actual keys to git)

## Learn More

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Composition API](https://vuejs.org/guide/composition-api-introduction.html)

## License

This project is open source and available under the [MIT License](LICENSE).
