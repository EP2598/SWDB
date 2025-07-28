<template>
  <div class="people-detail">
    <!-- Back Navigation -->
    <div class="navigation">
      <button @click="goBack" class="back-btn">
        ← Back to Characters
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading.main || loading.related" class="loading">
      <p>Loading character details...</p>
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchPersonDetails" class="retry-btn">Retry</button>
    </div>

    <!-- Character Details -->
    <div v-else-if="person" class="character-details">
      <div class="character-header">
        <h1>{{ person.name }}</h1>
        <div class="character-stats">
          <div class="stat-card">
            <span class="stat-label">Height</span>
            <span class="stat-value">{{ person.height }} cm</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Mass</span>
            <span class="stat-value">{{ person.mass }} kg</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Birth Year</span>
            <span class="stat-value">{{ person.birthYear }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Gender</span>
            <span class="stat-value">{{ person.gender }}</span>
          </div>
        </div>
      </div>

      <div class="character-body">
        <div class="character-info">
          <h2>Physical Characteristics</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Hair Color:</strong> {{ person.hairColor }}
            </div>
            <div class="info-item">
              <strong>Skin Color:</strong> {{ person.skinColor }}
            </div>
            <div class="info-item">
              <strong>Eye Color:</strong> {{ person.eyeColor }}
            </div>
          </div>
        </div>

        <!-- Films Section -->
        <div class="films-section">
          <h2>Films Appearances</h2>
          <div v-if="loading.related" class="loading-films">
            <p>Loading films...</p>
          </div>
          <div v-else-if="films.length > 0" class="films-grid">
            <div 
              v-for="film in films" 
              :key="film.episodeId" 
              class="film-card clickable"
              @click="goToFilm(film)"
            >
              <h3>{{ film.title }}</h3>
              <div class="film-details">
                <p><strong>Episode:</strong> {{ film.episodeId }}</p>
                <p><strong>Director:</strong> {{ film.director }}</p>
                <p><strong>Release Date:</strong> {{ formatDate(film.releaseDate) }}</p>
                <p class="opening-crawl">{{ truncateText(film.openingCrawl, 200) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-films">
            <p>No film appearances found.</p>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="additional-info">
          <h2>Additional Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Homeworld:</strong> 
              <span v-if="homeworld">{{ homeworld.name }}</span>
              <span v-else>Loading...</span>
            </div>
            <div class="info-item">
              <strong>Species:</strong> 
              <span v-if="species.length > 0">
                {{ species.map(s => s.name).join(', ') }}
              </span>
              <span v-else>Human</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceDetail } from '../utils/composables.js'
import { logError } from '../utils/logger.js'
import { 
  formatDate, 
  truncateText,
  extractIdFromUrl
} from '../utils/apiUtils.js'
import './PeopleDetail.vue.css'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Resource detail composable for people endpoint
const { 
  mainResource: person, 
  relatedData, 
  loading, 
  error, 
  fetchComplete 
} = useResourceDetail('people')

// Computed properties for related data
const films = computed(() => relatedData.films || [])
const homeworld = computed(() => relatedData.homeworld || null)
const species = computed(() => relatedData.species || [])

// Methods
const goBack = () => {
  router.push('/')
}

const goToFilm = (film) => {
  const filmId = extractIdFromUrl(film.url)
  if (filmId) {
    router.push(`/films/${filmId}`)
  }
}

const fetchPersonDetails = async () => {
  try {
    console.log(`🔍 Fetching person with ID: ${props.id}`)
    console.log('📊 Initial loading state:', loading)
    
    // Fetch person and all related data in one call
    await fetchComplete(props.id, {
      films: 'films',
      homeworld: 'homeworld',
      species: 'species'
    })
    
    console.log('✅ Person data received:', person.value)
    console.log('🎬 Related data received:', relatedData)
    console.log('📊 Final loading state:', loading)
    
  } catch (err) {
    await logError('Error fetching person details', err)
  }
}

// Lifecycle
onMounted(() => {
  fetchPersonDetails()
})
</script>
