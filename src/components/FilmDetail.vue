<template>
  <div class="film-detail">
    <!-- Back Navigation -->
    <div class="navigation">
      <button @click="goBack" class="back-btn">
        ← Back to Main Page
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading.main || loading.related" class="loading">
      <p>Loading film details...</p>
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchFilmDetails" class="retry-btn">Retry</button>
    </div>

    <!-- Film Details -->
    <div v-else-if="film" class="film-details">
      <div class="film-header">
        <h1>{{ film.title }}</h1>
        <div class="film-meta">
          <div class="meta-card">
            <span class="meta-label">Episode</span>
            <span class="meta-value">{{ film.episodeId }}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Release Date</span>
            <span class="meta-value">{{ formatDate(film.releaseDate) }}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Director</span>
            <span class="meta-value">{{ film.director }}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Producer</span>
            <span class="meta-value">{{ film.producer }}</span>
          </div>
        </div>
      </div>

      <div class="film-body">
        <!-- Opening Crawl -->
        <div class="opening-crawl-section">
          <h2>Opening Crawl</h2>
          <div class="opening-crawl-text">
            {{ film.openingCrawl }}
          </div>
        </div>

        <!-- Characters Section -->
        <div class="characters-section">
          <h2>Characters</h2>
          <div v-if="loading.related" class="loading-characters">
            <p>Loading characters...</p>
          </div>
          <div v-else-if="characters.length > 0" class="characters-grid">
            <div 
              v-for="character in characters" 
              :key="character.url" 
              class="character-card"
              @click="goToCharacter(character)"
            >
              <h3>{{ character.name }}</h3>
            </div>
          </div>
          <div v-else class="no-characters">
            <p>No characters found.</p>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="additional-info">
          <h2>Additional Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Planets:</strong> 
              <span v-if="planets.length > 0">
                {{ planets.map(p => p.name).join(', ') }}
              </span>
              <span v-else>Loading...</span>
            </div>
            <div class="info-item">
              <strong>Species:</strong> 
              <span v-if="species.length > 0">
                {{ species.map(s => s.name).join(', ') }}
              </span>
              <span v-else>Loading...</span>
            </div>
            <div class="info-item">
              <strong>Vehicles:</strong> 
              <span v-if="vehicles.length > 0">
                {{ vehicles.map(v => v.name).join(', ') }}
              </span>
              <span v-else>None</span>
            </div>
            <div class="info-item">
              <strong>Starships:</strong> 
              <span v-if="starships.length > 0">
                {{ starships.map(s => s.name).join(', ') }}
              </span>
              <span v-else>None</span>
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
  extractIdFromUrl
} from '../utils/apiUtils.js'
import './FilmDetail.vue.css'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Resource detail composable for films endpoint
const { 
  mainResource: film, 
  relatedData, 
  loading, 
  error, 
  fetchComplete 
} = useResourceDetail('films')

// Computed properties for related data
const characters = computed(() => relatedData.characters || [])
const planets = computed(() => relatedData.planets || [])
const species = computed(() => relatedData.species || [])
const vehicles = computed(() => relatedData.vehicles || [])
const starships = computed(() => relatedData.starships || [])

// Methods
const goBack = () => {
  router.push('/')
}

const goToCharacter = (character) => {
  const characterId = extractIdFromUrl(character.url)
  if (characterId) {
    router.push(`/people/${characterId}`)
  }
}

const fetchFilmDetails = async () => {
  try {
    console.log(`🔍 Fetching film with ID: ${props.id}`)
    console.log('📊 Initial loading state:', loading)
    
    // Fetch film and all related data in one call
    await fetchComplete(props.id, {
      characters: 'characters',
      planets: 'planets',
      species: 'species',
      vehicles: 'vehicles',
      starships: 'starships'
    })
    
    console.log('✅ Film data received:', film.value)
    console.log('🎬 Related data received:', relatedData)
    console.log('📊 Final loading state:', loading)
    
  } catch (err) {
    await logError('Error fetching film details', err)
  }
}

// Lifecycle
onMounted(() => {
  fetchFilmDetails()
})
</script>
