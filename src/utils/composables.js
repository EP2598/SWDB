/**
 * Dynamic Data Composables
 * Reusable composables for data fetching and state management
 */

import { ref, reactive } from 'vue'
import { fetchSwapiData, createErrorHandler } from './apiUtils.js'
import { logError } from './logger.js'

/**
 * SWAPI-specific composable for common endpoints
 * @param {string} defaultEndpoint - Default endpoint to use
 * @returns {object} - Reactive state and endpoint-specific methods
 */
export function useSwapiEndpoint(defaultEndpoint = 'people') {
  const state = reactive({
    data: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  const fetchData = async (endpoint = defaultEndpoint, page = 1, id = null) => {
    state.loading = true
    state.error = null
    
    try {
      const result = await fetchSwapiData(endpoint, page, id)
      state.data = result
      
      // Update pagination info for list endpoints
      if (result.count !== undefined) {
        state.totalCount = result.count
        state.totalPages = Math.ceil(result.count / 10)
        state.currentPage = page
      }
      
      return result
    } catch (err) {
      const errorHandler = createErrorHandler(`fetching ${endpoint} data`)
      state.error = errorHandler(err).message
      throw err
    } finally {
      state.loading = false
    }
  }

  const nextPage = async (endpoint = defaultEndpoint) => {
    if (state.currentPage < state.totalPages) {
      return fetchData(endpoint, state.currentPage + 1)
    }
  }

  const previousPage = async (endpoint = defaultEndpoint) => {
    if (state.currentPage > 1) {
      return fetchData(endpoint, state.currentPage - 1)
    }
  }

  const goToPage = async (page, endpoint = defaultEndpoint) => {
    if (page >= 1 && page <= state.totalPages) {
      return fetchData(endpoint, page)
    }
  }

  const reset = () => {
    state.data = null
    state.loading = false
    state.error = null
    state.currentPage = 1
    state.totalPages = 1
    state.totalCount = 0
  }

  return {
    state,
    fetchData,
    nextPage,
    previousPage,
    goToPage,
    reset
  }
}

/**
 * Resource detail composable for fetching single items with related data
 * @param {string} endpoint - The main endpoint (e.g., 'people')
 * @returns {object} - Reactive state and methods for detail views
 */
export function useResourceDetail(endpoint) {
  const mainResource = ref(null)
  const relatedData = reactive({})
  const loading = reactive({
    main: false,
    related: false
  })
  const error = ref(null)

  const fetchMain = async (id) => {
    loading.main = true
    error.value = null
    
    try {
      const result = await fetchSwapiData(endpoint, null, id)
      mainResource.value = result
      return result
    } catch (err) {
      const errorHandler = createErrorHandler(`fetching ${endpoint} details`)
      error.value = errorHandler(err).message
      throw err
    } finally {
      loading.main = false
    }
  }

  const fetchRelated = async (key, urls) => {
    if (!urls || (Array.isArray(urls) && urls.length === 0)) return []
    
    try {
      // Import fetchMultipleResources dynamically to avoid circular imports
      const { fetchMultipleResources, fetchSwapiData, extractIdFromUrl } = await import('./apiUtils.js')
      
      let results = []
      
      if (Array.isArray(urls)) {
        // Multiple URLs - use fetchMultipleResources
        results = await fetchMultipleResources(urls)
      } else {
        // Single URL - extract ID and fetch directly
        const id = extractIdFromUrl(urls)
        const endpoint = urls.includes('/planets/') ? 'planets' : 
                        urls.includes('/species/') ? 'species' :
                        urls.includes('/films/') ? 'films' : 'people'
        
        if (id) {
          const result = await fetchSwapiData(endpoint, null, id)
          results = result
        }
      }
      
      relatedData[key] = results
      return results
    } catch (err) {
      await logError(`Error fetching related ${key}`, err)
      relatedData[key] = Array.isArray(urls) ? [] : null
      return Array.isArray(urls) ? [] : null
    }
  }

  const fetchComplete = async (id, relatedConfig = {}) => {
    // Set loading states
    loading.related = true
    
    try {
      // Fetch main resource first
      const main = await fetchMain(id)
      
      // Fetch related resources in parallel
      const relatedPromises = Object.entries(relatedConfig).map(([key, urlKey]) => {
        const urls = main[urlKey]
        return fetchRelated(key, urls)
      })
      
      await Promise.all(relatedPromises)
      
      return {
        main: mainResource.value,
        related: relatedData
      }
    } catch (err) {
      await logError('Error in fetchComplete', err)
      throw err
    } finally {
      // Always turn off related loading when everything is done
      loading.related = false
    }
  }

  const reset = () => {
    mainResource.value = null
    Object.keys(relatedData).forEach(key => {
      delete relatedData[key]
    })
    loading.main = false
    loading.related = false
    error.value = null
  }

  return {
    mainResource,
    relatedData,
    loading,
    error,
    fetchMain,
    fetchRelated,
    fetchComplete,
    reset
  }
}
