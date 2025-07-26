/**
 * API Service for handling external API calls
 * This service provides a centralized way to fetch data from external APIs
 */

class ApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Generic fetch method with error handling
   * @param {string} url - The API endpoint URL
   * @param {object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<object>} - Promise that resolves to the API response
   */
  async fetch(url, options = {}) {
    const fullURL = this.baseURL ? `${this.baseURL}${url}` : url;
    
    try {
      const response = await fetch(fullURL, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} url - The API endpoint URL
   * @param {object} options - Additional fetch options
   * @returns {Promise<object>} - Promise that resolves to the API response
   */
  async get(url, options = {}) {
    return this.fetch(url, { method: 'GET', ...options });
  }

  /**
   * POST request
   * @param {string} url - The API endpoint URL
   * @param {object} data - Data to be sent in the request body
   * @param {object} options - Additional fetch options
   * @returns {Promise<object>} - Promise that resolves to the API response
   */
  async post(url, data, options = {}) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   * @param {string} url - The API endpoint URL
   * @param {object} data - Data to be sent in the request body
   * @param {object} options - Additional fetch options
   * @returns {Promise<object>} - Promise that resolves to the API response
   */
  async put(url, data, options = {}) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   * @param {string} url - The API endpoint URL
   * @param {object} options - Additional fetch options
   * @returns {Promise<object>} - Promise that resolves to the API response
   */
  async delete(url, options = {}) {
    return this.fetch(url, { method: 'DELETE', ...options });
  }
}

// Example API services for common use cases
export const jsonPlaceholderAPI = new ApiService('https://jsonplaceholder.typicode.com');
export const weatherAPI = new ApiService('https://api.openweathermap.org/data/2.5');

// Default export for general use
export default ApiService;
