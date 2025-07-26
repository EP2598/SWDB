import { ref, reactive } from 'vue';

/**
 * Composable for handling API data fetching with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {object} - Object containing data, loading state, error state, and fetch function
 */
export function useApi(apiFunction) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await apiFunction(...args);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err.message || 'An error occurred';
      console.error('API Error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}

/**
 * Composable for handling multiple API calls
 * @param {Array} apiCalls - Array of API functions to call
 * @returns {object} - Object containing combined data, loading states, and error states
 */
export function useMultipleApi(apiCalls) {
  const state = reactive({
    data: {},
    loading: {},
    error: {},
  });

  const executeAll = async () => {
    const promises = apiCalls.map(async (apiCall, index) => {
      const key = apiCall.key || `api_${index}`;
      state.loading[key] = true;
      state.error[key] = null;

      try {
        const result = await apiCall.function(...(apiCall.args || []));
        state.data[key] = result;
        return { key, result };
      } catch (err) {
        state.error[key] = err.message || 'An error occurred';
        throw { key, error: err };
      } finally {
        state.loading[key] = false;
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      return results;
    } catch (err) {
      console.error('Multiple API Error:', err);
      throw err;
    }
  };

  const execute = async (key, apiFunction, ...args) => {
    state.loading[key] = true;
    state.error[key] = null;

    try {
      const result = await apiFunction(...args);
      state.data[key] = result;
      return result;
    } catch (err) {
      state.error[key] = err.message || 'An error occurred';
      throw err;
    } finally {
      state.loading[key] = false;
    }
  };

  return {
    state,
    executeAll,
    execute,
  };
}
