<template>

  <div class="flex flex-col min-h-screen">
    <HeaderBar>
      <template #logo>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 20H80V80H20V20Z" stroke="currentColor" stroke-width="6" />
          <path d="M50 20V0" stroke="currentColor" stroke-width="6" />
          <path d="M50 100V80" stroke="currentColor" stroke-width="6" />
          <path d="M20 50H0" stroke="currentColor" stroke-width="6" />
          <path d="M100 50H80" stroke="currentColor" stroke-width="6" />
          <path d="M50 50H80V20" stroke="currentColor" stroke-width="6" />
          <path d="M50 50H20V80" stroke="currentColor" stroke-width="6" />
        </svg>
      </template>
      <template #title>Festivais da Amazônia</template>
      <template #subtitle>Um guia da cultura cabocla e indígena.</template>
      <template #actions>
        <div class="status-badge glass text-theme-text px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
          <MapPin :size="16" class="text-theme-accent" />
          <span>Exibindo <b>{{ filteredFestivals.length }}</b> de <b>{{ festivals.length }}</b></span>
        </div>
        <button @click="showAboutModal = true" 
                title="Sobre este projeto"
                class="action-button bg-theme-secondary/80 hover:bg-theme-secondary text-white p-2.5 rounded-full transition-all">
          <Info :size="20" />
        </button>
      </template>
    </HeaderBar>


    <main class="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <FestivalSidebar>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display text-xl md:text-2xl text-theme-primary font-bold">Explore os Festivais</h2>
          <div v-if="hasActiveFilters"
               class="bg-theme-accent/20 text-theme-accent px-2 py-1 rounded-full text-xs font-medium">
            Filtrado
          </div>
        </div>
        <div class="space-y-3 mb-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-accent" />
            <input v-model="searchTerm" 
                   type="text" 
                   placeholder="Buscar por nome ou cidade..."
                   class="search-input w-full pl-10 pr-4 py-2.5 rounded-lg text-theme-text placeholder-theme-secondary/80 focus:outline-none text-sm">
          </div>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Calendar class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-accent pointer-events-none" />
              <select v-model="selectedMonth"
                      class="search-input w-full px-3 py-2.5 rounded-lg text-theme-text focus:outline-none cursor-pointer appearance-none text-sm">
                <option value="">Todos os meses</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
            <button v-if="hasActiveFilters" 
                    @click="clearFilters" 
                    title="Limpar filtros"
                    class="action-button bg-theme-secondary/20 hover:bg-theme-secondary/30 text-theme-secondary px-3 py-2.5 rounded-lg transition-all">
              <X :size="16" />
            </button>
          </div>
        </div>
        <div class="space-y-3 overflow-y-auto custom-scrollbar flex-grow -mx-2">
          <div v-for="festival in filteredFestivals" 
               :key="festival.id"
               @click="panToFestival(festival)"
               class="festival-card bg-white/30 p-4 rounded-xl cursor-pointer group"
               :class="{ 'ring-2 ring-theme-accent bg-white/50': selectedFestival && selectedFestival.id === festival.id }">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm md:text-base text-theme-primary group-hover:text-theme-accent transition-colors leading-tight">
                {{ festival.name }}
              </h3>
              <component :is="getIconComponent(festival.icon)" 
                         :size="20" 
                         class="text-theme-accent/70 flex-shrink-0" />
            </div>
            <p class="text-xs md:text-sm text-theme-secondary flex items-center gap-2 mt-1">
              <MapPin :size="14" class="flex-shrink-0" />
              {{ festival.city }}
            </p>
            <p class="text-xs text-theme-secondary/80 mt-1">{{ festival.date }}</p>
          </div>
          <div v-if="filteredFestivals.length === 0" class="text-center py-8 text-theme-secondary">
            <SearchX :size="48" class="mx-auto mb-3 text-theme-secondary/50" />
            <p class="font-medium mb-1">Nenhum festival encontrado</p>
            <p class="text-sm text-theme-secondary/80 mb-4">Tente ajustar os filtros de busca</p>
            <button @click="clearFilters"
                    class="action-button bg-theme-accent/20 hover:bg-theme-accent/30 text-theme-accent px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Limpar filtros
            </button>
          </div>
        </div>
      </FestivalSidebar>
      <FestivalMap>
        <div ref="mapContainer" class="w-full h-full z-0"></div>
        <div class="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button @click="fitMapToVisibleMarkers" 
                  title="Ajustar visualização aos festivais visíveis"
                  class="glass action-button p-3 rounded-full hover:bg-white/70 transition-colors shadow-md">
            <Focus :size="20" class="text-theme-primary" />
          </button>
          <button @click="resetMapView" 
                  title="Mostrar todos os festivais"
                  class="glass action-button p-3 rounded-full hover:bg-white/70 transition-colors shadow-md">
            <Maximize :size="20" class="text-theme-primary" />
          </button>
        </div>
        <div v-if="mapLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
          <div class="text-theme-primary">
            <Loader2 :size="32" class="animate-spin mx-auto mb-2" />
            <p class="text-sm">Carregando mapa...</p>
          </div>
        </div>
      </FestivalMap>
    </main>

    <AboutModal :show="showAboutModal" @close="showAboutModal = false">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-display text-2xl font-bold text-theme-primary">Sobre o Projeto</h2>
        <button @click="$emit('close')"
                class="text-theme-secondary hover:text-theme-accent transition-colors p-2 -mr-2">
          <X :size="24" />
        </button>
      </div>
      <div class="prose prose-sm md:prose-base max-w-none text-theme-text/90 font-body">
        <p>O <strong>Festivais da Amazônia</strong> é um projeto de hobby criado para celebrar e
           difundir a riqueza cultural dos festivais folclóricos da Região Amazônica.</p>
        <p>A ideia é criar um guia interativo e visual que facilite a descoberta dessas manifestações
           culturais únicas, conectando pessoas à cultura cabocla e indígena.</p>
        <p>Feito com ❤️, Vue.js e Tailwind CSS.</p>
      </div>
    </AboutModal>
  </div>
</template>

<script>

import { ref, computed, onMounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import { MapPin, Info, Search, Calendar, X, SearchX, Focus, Maximize, Loader2, Theater, Music, Mic, Leaf, Sun, MountainSnow, Grape, Fish } from 'lucide-vue-next'
import HeaderBar from './components/HeaderBar.vue'
import FestivalSidebar from './components/FestivalSidebar.vue'
import FestivalMap from './components/FestivalMap.vue'
import AboutModal from './components/AboutModal.vue'

export default {
  name: 'App',
  components: {
    HeaderBar, FestivalSidebar, FestivalMap, AboutModal,
    MapPin, Info, Search, Calendar, X, SearchX, Focus, Maximize, Loader2,
    Theater, Music, Mic, Leaf, Sun, MountainSnow, Grape, Fish
  },
  setup() {
    // Dados reativos
    const festivals = ref([])

    const map = ref(null)
    const mapContainer = ref(null)
    const markers = ref({})
    const selectedFestival = ref(null)
    const searchTerm = ref('')
    const selectedMonth = ref('')
    const mapLoading = ref(true)
    const showAboutModal = ref(false)

    // Computed properties
    const filteredFestivals = computed(() => {
      return festivals.value.filter(festival => {
        const searchMatch = searchTerm.value.toLowerCase() === '' ||
          festival.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          festival.city.toLowerCase().includes(searchTerm.value.toLowerCase())

        const monthMatch = !selectedMonth.value || festival.month === parseInt(selectedMonth.value)

        return searchMatch && monthMatch
      })
    })

    const hasActiveFilters = computed(() => {
      return searchTerm.value.trim() !== '' || selectedMonth.value !== ''
    })

    // Mapeamento de ícones
    const iconMap = {
      'theater': Theater,
      'music': Music,
      'mic': Mic,
      'leaf': Leaf,
      'sun': Sun,
      'mountain-snow': MountainSnow,
      'grape': Grape,
      'fish': Fish
    }

    const getIconComponent = (iconName) => {
      return iconMap[iconName] || Music
    }

    // Métodos do mapa
    const initMap = () => {
      map.value = L.map(mapContainer.value, { zoomControl: false }).setView([-4.5, -61], 6)
      L.control.zoom({ position: 'topright' }).addTo(map.value)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
      }).addTo(map.value)
    }

    const addMarkersToMap = () => {
      const festivalIcon = L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
            <path fill="#285C4D" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            <circle fill="#E77728" cx="12" cy="8" r="3"/>
          </svg>
        `)}`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      })

      festivals.value.forEach(festival => {
        const marker = L.marker(festival.coords, { icon: festivalIcon })
          .bindPopup(`
            <div class="popup-title">${festival.name}</div>
            <div><svg class="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><strong>Local:</strong> ${festival.city}</div>
            <div><svg class="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg><strong>Data:</strong> ${festival.date}</div>
            <p class="mt-2 text-sm text-theme-secondary">${festival.description}</p>
          `, { maxWidth: 250 })

        marker.on('click', () => {
          selectedFestival.value = festival
        })

        markers.value[festival.id] = marker
      })
    }

    const updateMapMarkers = () => {
      const filteredIds = new Set(filteredFestivals.value.map(f => f.id))

      Object.keys(markers.value).forEach(id => {
        const marker = markers.value[id]
        if (filteredIds.has(parseInt(id))) {
          if (!map.value.hasLayer(marker)) {
            marker.addTo(map.value)
          }
        } else {
          if (map.value.hasLayer(marker)) {
            map.value.removeLayer(marker)
          }
        }
      })
    }

    const panToFestival = (festival) => {
      selectedFestival.value = festival
      map.value.flyTo(festival.coords, 10, {
        animate: true,
        duration: 1.5
      })
      setTimeout(() => {
        if (markers.value[festival.id]) {
          markers.value[festival.id].openPopup()
        }
      }, 800)
    }

    const fitMapToMarkers = () => {
      const allCoords = festivals.value.map(f => f.coords)
      const bounds = L.latLngBounds(allCoords)
      if (bounds.isValid()) {
        map.value.fitBounds(bounds.pad(0.1), { animate: true, duration: 1 })
      }
    }

    const fitMapToVisibleMarkers = () => {
      const visibleMarkers = filteredFestivals.value.map(f => f.coords)
      if (visibleMarkers.length === 0) return

      const bounds = L.latLngBounds(visibleMarkers)
      if (bounds.isValid()) {
        map.value.fitBounds(bounds.pad(0.1), { animate: true, duration: 1 })
      }
    }

    const resetMapView = () => {
      const allCoords = festivals.value.map(f => f.coords)
      const bounds = L.latLngBounds(allCoords)
      if (bounds.isValid()) {
        map.value.fitBounds(bounds.pad(0.1), { animate: true, duration: 1 })
      }
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedMonth.value = ''
      selectedFestival.value = null
    }

    // Watchers
    watch(filteredFestivals, () => {
      updateMapMarkers()
    })

    // Lifecycle
    onMounted(async () => {
      await nextTick()
      // Carrega os festivais do JSON
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}festivals.json`)
        if (!response.ok) throw new Error('Erro ao carregar festivais')
        festivals.value = await response.json()
      } catch (e) {
        // fallback: vazio
        festivals.value = []
      }
      initMap()
      addMarkersToMap()
      updateMapMarkers()
      fitMapToMarkers()
      mapLoading.value = false
    })

    return {
      festivals,
      map,
      mapContainer,
      markers,
      selectedFestival,
      searchTerm,
      selectedMonth,
      mapLoading,
      showAboutModal,
      filteredFestivals,
      hasActiveFilters,
      getIconComponent,
      panToFestival,
      fitMapToVisibleMarkers,
      resetMapView,
      clearFilters
    }
  }
}
</script>