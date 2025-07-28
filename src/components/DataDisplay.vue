<template>
  <div class="data-display">
    <h2>Star Wars Database (SWAPI)</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading Star Wars data...</p>
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
        <button @click="refreshData" class="refresh-btn">Refresh Data</button>
        <select v-model="selectedEndpoint" @change="handleEndpointChange" class="endpoint-select">
          <option value="people">People</option>
          <option value="planets">Planets</option>
          <option value="films">Films</option>
          <option value="species">Species</option>
          <option value="vehicles">Vehicles</option>
          <option value="starships">Starships</option>
        </select>
        
        <!-- Pagination Controls -->
        <div class="pagination-controls" v-if="data && data.results && data.results.length > 0">
          <button 
            @click="goToPreviousPage" 
            :disabled="!data.previous || loading"
            class="page-btn"
          >
            ← Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }} ({{ totalCount }} total)
          </span>
          <button 
            @click="goToNextPage" 
            :disabled="!data.next || loading"
            class="page-btn"
          >
            Next →
          </button>
        </div>
      </div>

      <div class="data-grid">
        <div 
          v-for="item in displayData" 
          :key="item.url" 
          class="data-card"
          :class="getCardClass(selectedEndpoint)"
          :data-endpoint="selectedEndpoint"
          @click="handleCardClick(item)"
        >
          <h3>{{ getItemTitle(item) }}</h3>
          
          <!-- People specific data -->
          <div v-if="selectedEndpoint === 'people'" class="item-details">
            <p><strong>Height :</strong> {{ item.height }} cm</p>
            <p><strong>Mass :</strong> {{ item.mass }} kg</p>
            <p><strong>Hair Color :</strong> {{ item.hairColor }}</p>
            <p><strong>Birth Year :</strong> {{ item.birthYear }}</p>
            <p><strong>Gender :</strong> {{ item.gender }}</p>
            <div class="click-hint">Click to view details →</div>
          </div>
          
          <!-- Planets specific data -->
          <div v-else-if="selectedEndpoint === 'planets'" class="item-details">
            <p><strong>Climate:</strong> {{ item.climate }}</p>
            <p><strong>Terrain :</strong> {{ item.terrain }}</p>
            <p><strong>Population :</strong> {{ formatNumber(item.population) }}</p>
            <p><strong>Diameter :</strong> {{ formatNumber(item.diameter) }} km</p>
          </div>
          
          <!-- Films specific data -->
          <div v-else-if="selectedEndpoint === 'films'" class="item-details">
            <p><strong>Episode :</strong> {{ item.episodeId }}</p>
            <p><strong>Director :</strong> {{ item.director }}</p>
            <p><strong>Producer :</strong> {{ item.producer }}</p>
            <p><strong>Release Date :</strong> {{ formatDate(item.releaseDate) }}</p>
            <p class="opening-crawl">{{ truncateText(item.openingCrawl, 150) }}</p>
            <div class="click-hint">Click to view details →</div>
          </div>
          
          <!-- Species specific data -->
          <div v-else-if="selectedEndpoint === 'species'" class="item-details">
            <p><strong>Classification :</strong> {{ item.classification }}</p>
            <p><strong>Designation :</strong> {{ item.designation }}</p>
            <p><strong>Average Height :</strong> {{ item.averageHeight }} cm</p>
            <p><strong>Language :</strong> {{ item.language }}</p>
          </div>
          
          <!-- Vehicles specific data -->
          <div v-else-if="selectedEndpoint === 'vehicles'" class="item-details">
            <p><strong>Model :</strong> {{ item.model }}</p>
            <p><strong>Manufacturer :</strong> {{ item.manufacturer }}</p>
            <p><strong>Cost :</strong> {{ formatNumber(item.costInCredits) }} credits</p>
            <p><strong>Max Speed :</strong> {{ item.maxAtmospheringSpeed }} km/h</p>
          </div>
          
          <!-- Starships specific data -->
          <div v-else-if="selectedEndpoint === 'starships'" class="item-details">
            <p><strong>Model :</strong> {{ item.model }}</p>
            <p><strong>Manufacturer :</strong> {{ item.manufacturer }}</p>
            <p><strong>Cost :</strong> {{ formatNumber(item.costInCredits) }} credits</p>
            <p><strong>Hyperdrive Rating :</strong> {{ item.hyperdriveRating }}</p>
            <p><strong>MGLT :</strong> {{ item.MGLT }}</p>
          </div>
        </div>
      </div>

      <div v-if="!loading && displayData.length === 0" class="no-data">
        <p>No data available</p>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="initial-state">
      <p>Welcome to the Star Wars Database!</p>
      <p>Click the button below to explore the galaxy far, far away...</p>
      <button @click="fetchData" class="fetch-btn">Explore the Galaxy</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSwapiEndpoint } from '../utils/composables.js';
import { logError } from '../utils/logger.js';
import { 
  formatNumber, 
  formatDate, 
  truncateText, 
  getItemTitle, 
  getCardClass,
  extractIdFromUrl
} from '../utils/apiUtils.js';
import './DataDisplay.vue.css';

const router = useRouter();

// Reactive data
const selectedEndpoint = ref('people');

// SWAPI endpoint composable with pagination support
const { state, fetchData: fetchEndpointData, nextPage, previousPage, goToPage } = useSwapiEndpoint('people');

// Computed properties
const displayData = computed(() => {
  console.log('Computing displayData, state.data:', state.data);
  if (!state.data || !state.data.results) {
    console.log('No data or results found');
    return [];
  }
  console.log('Returning results:', state.data.results.length, 'items');
  return state.data.results;
});

// Expose state properties for template
const data = computed(() => state.data);
const loading = computed(() => state.loading);
const error = computed(() => state.error);
const currentPage = computed(() => state.currentPage);
const totalPages = computed(() => state.totalPages);
const totalCount = computed(() => state.totalCount);

// Methods
const fetchData = async (page = 1) => {
  try {
    console.log(`Fetching data for ${selectedEndpoint.value}, page ${page}`);
    await fetchEndpointData(selectedEndpoint.value, page);
    console.log('Data fetched successfully:', state.data);
  } catch (err) {
    await logError('Failed to fetch data', err);
  }
};

const refreshData = async () => {
  console.log('Refreshing data...');
  await fetchData(state.currentPage);
};

const goToNextPage = () => {
  if (state.data?.next) {
    nextPage(selectedEndpoint.value);
  }
};

const goToPreviousPage = () => {
  if (state.data?.previous) {
    previousPage(selectedEndpoint.value);
  }
};

const goToSpecificPage = (page) => {
  goToPage(page, selectedEndpoint.value);
};

const handleEndpointChange = () => {
  console.log('Endpoint changed to:', selectedEndpoint.value);
  fetchData(1);
};

// Handle card click for navigation
const handleCardClick = async (item) => {
  console.log('Card clicked:', item)
  
  if (selectedEndpoint.value === 'people') {
    // Extract person ID from URL using utility function
    console.log('Item URL:', item.url)
    const personId = extractIdFromUrl(item.url);
    console.log('Extracted person ID:', personId)
    if (personId) {
      console.log('Navigating to:', `/people/${personId}`)
      router.push(`/people/${personId}`);
    } else {
      await logError('Could not extract person ID from URL', item.url)
    }
  } else if (selectedEndpoint.value === 'films') {
    // Extract film ID from URL using utility function
    console.log('Film URL:', item.url)
    const filmId = extractIdFromUrl(item.url);
    console.log('Extracted film ID:', filmId)
    if (filmId) {
      console.log('Navigating to:', `/films/${filmId}`)
      router.push(`/films/${filmId}`);
    } else {
      await logError('Could not extract film ID from URL', item.url)
    }
  }
  // Add navigation for other endpoints in the future if needed
};

// Fetch initial data when component mounts
onMounted(() => {
  fetchData(1);
});
</script>


