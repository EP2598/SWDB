<template>
  <div class="data-display">
    <h2>External API Data Display</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading data...</p>
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <!-- Data Display -->
    <div v-else-if="data" class="data-content">
      <div class="data-controls">
        <button @click="fetchData" class="refresh-btn">Refresh Data</button>
        <select v-model="selectedEndpoint" @change="fetchData" class="endpoint-select">
          <option value="posts">Posts</option>
          <option value="users">Users</option>
          <option value="albums">Albums</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      <div class="data-grid">
        <div 
          v-for="item in displayData" 
          :key="item.id" 
          class="data-card"
        >
          <h3>{{ item.title || item.name || `Item ${item.id}` }}</h3>
          <p v-if="item.body">{{ truncateText(item.body, 100) }}</p>
          <p v-if="item.email"><strong>Email:</strong> {{ item.email }}</p>
          <p v-if="item.username"><strong>Username:</strong> {{ item.username }}</p>
          <p v-if="item.completed !== undefined">
            <strong>Status:</strong> 
            <span :class="{ completed: item.completed, pending: !item.completed }">
              {{ item.completed ? 'Completed' : 'Pending' }}
            </span>
          </p>
        </div>
      </div>

      <div v-if="displayData.length === 0" class="no-data">
        <p>No data available</p>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="initial-state">
      <p>Click the button below to fetch data from external API</p>
      <button @click="fetchData" class="fetch-btn">Fetch Data</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '../composables/useApi.js';
import { jsonPlaceholderAPI } from '../services/apiService.js';

// Reactive data
const selectedEndpoint = ref('posts');

// API composable
const { data, loading, error, execute } = useApi(async (endpoint) => {
  return await jsonPlaceholderAPI.get(`/${endpoint}`);
});

// Computed properties
const displayData = computed(() => {
  if (!data.value) return [];
  // Limit to first 12 items for better display
  return data.value.slice(0, 12);
});

// Methods
const fetchData = async () => {
  try {
    await execute(selectedEndpoint.value);
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Fetch initial data when component mounts
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.data-display {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.loading, .error, .initial-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
}

.data-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.data-card {
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.data-card h3 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.data-card p {
  margin: 8px 0;
  color: #666;
  line-height: 1.4;
}

.completed {
  color: #27ae60;
  font-weight: bold;
}

.pending {
  color: #f39c12;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
}

/* Button Styles */
button {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

button:hover {
  background: #369870;
}

.retry-btn {
  background: #e74c3c;
}

.retry-btn:hover {
  background: #c0392b;
}

.endpoint-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }
  
  .data-controls {
    flex-direction: column;
  }
}
</style>
