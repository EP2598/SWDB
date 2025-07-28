/**
 * Dynamic API Utilities
 * Centralized functions for API calls and data processing
 */

import { logError } from './logger.js';

// Base SWAPI configuration
// Using proxy server to bypass SSL/TLS issues
const SWAPI_BASE_URL = 'http://localhost:3001';

/**
 * Convert snake_case string to camelCase
 * @param {string} str - Snake case string
 * @returns {string} - CamelCase string
 */
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Convert object keys from snake_case to camelCase
 * @param {object|array} obj - Object or array to convert
 * @returns {object|array} - Object with camelCase keys
 */
export const convertToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertToCamelCase(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      converted[camelKey] = convertToCamelCase(value);
    }
    return converted;
  }
  
  return obj;
};

/**
 * Convert string to title case (capitalize first letter of each word)
 * @param {string} str - String to convert
 * @returns {string} - Title case string
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  // Handle comma-separated values by processing each part separately
  if (str.includes(',')) {
    return str
      .split(',')
      .map(part => part.trim().toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()))
      .join(', ');
  }
  
  // Handle other separators and single words
  return str
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase());
};

/**
 * Format people-specific properties to title case
 * @param {object} person - Person object
 * @returns {object} - Person object with formatted properties
 */
export const formatPersonDetails = (person) => {
  if (!person || typeof person !== 'object') return person;
  
  const formatted = { ...person };
  
  // Format specific people properties to title case
  const fieldsToFormat = ['hairColor', 'skinColor', 'eyeColor', 'gender'];
  
  fieldsToFormat.forEach(field => {
    if (formatted[field]) {
      formatted[field] = toTitleCase(formatted[field]);
    }
  });
  
  return formatted;
};

/**
 * Format planet-specific properties to title case
 * @param {object} planet - Planet object
 * @returns {object} - Planet object with formatted properties
 */
export const formatPlanetDetails = (planet) => {
  if (!planet || typeof planet !== 'object') return planet;
  
  const formatted = { ...planet };
  
  // Format specific planet properties to title case
  const fieldsToFormat = ['climate', 'gravity', 'terrain'];
  
  fieldsToFormat.forEach(field => {
    if (formatted[field]) {
      formatted[field] = toTitleCase(formatted[field]);
    }
  });
  
  return formatted;
};

/**
 * Format species-specific properties to title case
 * @param {object} species - Species object
 * @returns {object} - Species object with formatted properties
 */
export const formatSpeciesDetails = (species) => {
  if (!species || typeof species !== 'object') return species;
  
  const formatted = { ...species };
  
  // Format specific species properties to title case
  const fieldsToFormat = ['classification', 'designation', 'skinColors', 'hairColors', 'eyeColors'];
  
  fieldsToFormat.forEach(field => {
    if (formatted[field]) {
      formatted[field] = toTitleCase(formatted[field]);
    }
  });
  
  return formatted;
};

/**
 * Dynamic API fetch function
 * @param {string} endpoint - The API endpoint (people, planets, films, etc.)
 * @param {number} page - Page number for pagination
 * @param {string} id - Optional ID for specific resource
 * @returns {Promise<object>} - API response data
 */
export const fetchSwapiData = async (endpoint, page = null, id = null) => {
  let url = `${SWAPI_BASE_URL}/${endpoint}/`;
  
  if (id) {
    url += `${id}/`;
  } else if (page) {
    url += `?page=${page}`;
  }
  
  console.log(`🔧 Fetching via proxy from: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Proxy response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const result = await response.json();
    let camelCaseResult = convertToCamelCase(result);
    
    // Apply people-specific formatting for people endpoint
    if (endpoint === 'people') {
      if (camelCaseResult.results) {
        // Format each person in the results array
        camelCaseResult.results = camelCaseResult.results.map(formatPersonDetails);
      } else {
        // Format single person object
        camelCaseResult = formatPersonDetails(camelCaseResult);
      }
    }
    
    // Apply planet-specific formatting for planets endpoint
    if (endpoint === 'planets') {
      if (camelCaseResult.results) {
        // Format each planet in the results array
        camelCaseResult.results = camelCaseResult.results.map(formatPlanetDetails);
      } else {
        // Format single planet object
        camelCaseResult = formatPlanetDetails(camelCaseResult);
      }
    }
    
    // Apply species-specific formatting for species endpoint
    if (endpoint === 'species') {
      if (camelCaseResult.results) {
        // Format each species in the results array
        camelCaseResult.results = camelCaseResult.results.map(formatSpeciesDetails);
      } else {
        // Format single species object
        camelCaseResult = formatSpeciesDetails(camelCaseResult);
      }
    }
    
    console.log('✅ API request successful via proxy (converted to camelCase):', camelCaseResult);
    return camelCaseResult;
    
  } catch (error) {
    await logError('Proxy request failed', {
      name: error.name,
      message: error.message,
      url: url
    });
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('❌ Proxy Error: Cannot connect to proxy server.\n' +
                     'Make sure the proxy server is running:\n' +
                     'node proxy-server.js');
    }
    
    throw error;
  }
};

/**
 * Extract ID from SWAPI URL
 * @param {string} url - Full SWAPI URL
 * @returns {string|null} - Extracted ID or null
 */
export const extractIdFromUrl = (url) => {
  if (!url) return null;
  const matches = url.match(/\/(\d+)\/?$/);
  return matches ? matches[1] : null;
};

/**
 * Format numbers with proper formatting
 * @param {string|number} value - Value to format
 * @returns {string} - Formatted number or 'Unknown'
 */
export const formatNumber = (value) => {
  if (!value || value === 'unknown' || value === 'n/a') return 'Unknown';
  const numValue = parseInt(value);
  if (isNaN(numValue)) return 'Unknown';
  return new Intl.NumberFormat().format(numValue);
};

/**
 * Format date strings
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date or 'Unknown'
 */
export const formatDate = async (dateString, options = {}) => {
  if (!dateString) return 'Unknown';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    await logError('Date formatting error', error);
    return 'Unknown';
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? text.substring(0, maxLength) + suffix : text;
};

/**
 * Get item title from SWAPI response
 * @param {object} item - SWAPI item object
 * @returns {string} - Item title/name
 */
export const getItemTitle = (item) => {
  return item?.name || item?.title || 'Unknown';
};

/**
 * Get CSS class for card based on endpoint
 * @param {string} endpoint - API endpoint name
 * @returns {string} - CSS class name
 */
export const getCardClass = (endpoint) => {
  const classes = {
    people: 'card-people',
    planets: 'card-planets',
    films: 'card-films',
    species: 'card-species',
    vehicles: 'card-vehicles',
    starships: 'card-starships'
  };
  return classes[endpoint] || '';
};

/**
 * Calculate total pages for pagination
 * @param {number} totalCount - Total number of items
 * @param {number} itemsPerPage - Items per page (SWAPI default is 10)
 * @returns {number} - Total number of pages
 */
export const calculateTotalPages = (totalCount, itemsPerPage = 10) => {
  if (!totalCount || totalCount <= 0) return 1;
  return Math.ceil(totalCount / itemsPerPage);
};

/**
 * Validate and sanitize page number
 * @param {number} page - Page number to validate
 * @param {number} maxPages - Maximum number of pages
 * @returns {number} - Valid page number
 */
export const validatePageNumber = (page, maxPages = 1) => {
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 1) return 1;
  if (pageNum > maxPages) return maxPages;
  return pageNum;
};

/**
 * Fetch multiple related resources from URLs
 * @param {Array<string>} urls - Array of SWAPI URLs
 * @param {number} maxConcurrent - Maximum concurrent requests
 * @returns {Promise<Array>} - Array of fetched resources
 */
export const fetchMultipleResources = async (urls, maxConcurrent = 5) => {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return [];
  }
  
  const results = [];
  
  // Process URLs in batches to avoid overwhelming the API
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(async (url) => {
      try {
        // Convert SWAPI URLs to use our proxy
        const proxyUrl = url.replace('https://swapi.dev/api', SWAPI_BASE_URL);
        console.log(`🔧 Fetching via proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        let convertedData = convertToCamelCase(responseData);
        
        // Apply people formatting if this is a people URL
        if (url.includes('/people/')) {
          convertedData = formatPersonDetails(convertedData);
        }
        
        // Apply planet formatting if this is a planets URL
        if (url.includes('/planets/')) {
          convertedData = formatPlanetDetails(convertedData);
        }
        
        // Apply species formatting if this is a species URL
        if (url.includes('/species/')) {
          convertedData = formatSpeciesDetails(convertedData);
        }
        
        return convertedData;
      } catch (error) {
        await logError(`Failed to fetch ${url}`, error);
        return null;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(result => result !== null));
  }
  
  return results;
};

/**
 * Create error handler for API calls
 * @param {string} context - Context for the error (e.g., 'fetching people data')
 * @returns {Function} - Error handler function
 */
export const createErrorHandler = (context) => {
  return async (error) => {
    await logError(context, error);
    
    // Check for common error types
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return new Error('Network error: Unable to connect to SWAPI. Please check your internet connection.');
    }
    
    if (error.message.includes('404')) {
      return new Error('Resource not found.');
    }
    
    if (error.message.includes('500')) {
      return new Error('Server error: Please try again later.');
    }
    
    return new Error('API is currently unavailable. Please try again later.');
  };
};
