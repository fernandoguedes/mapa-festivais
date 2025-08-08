<template>
  <div class="flex flex-col h-screen bg-background text-foreground">
    <HeaderBar>
      <template #logo>
        <svg viewBox="0 0 100 100" class="w-10 h-10 text-primary">
           <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="4" fill="none"/>
           <path d="M50 10 L65 30 L50 40 L35 30 Z" fill="currentColor"/>
           <path d="M50 90 L35 70 L50 60 L65 70 Z" fill="currentColor"/>
           <path d="M10 50 L30 35 L40 50 L30 65 Z" fill="currentColor"/>
           <path d="M90 50 L70 65 L60 50 L70 35 Z" fill="currentColor"/>
           <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="3"/>
        </svg>
      </template>
      <template #title>Festivais da Amazônia</template>
      <template #subtitle>Celebrando a cultura cabocla e indígena</template>
      <template #actions>
        <div class="bg-muted text-muted-foreground px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
          <MapPin :size="16" class="text-accent" />
          <span>Exibindo <b>{{ filteredFestivals.length }}</b> de <b>{{ festivals.length }}</b></span>
        </div>
        <button @click="showAboutModal = true" title="Sobre este projeto" class="bg-secondary text-secondary-foreground p-2.5 rounded-full hover:bg-secondary-600 transition-colors">
          <Info :size="20" />
        </button>
      </template>
    </HeaderBar>

    <div class="flex-1 overflow-hidden">
      <main class="h-full container mx-auto py-4 md:py-6 grid grid-cols-1 grid-rows-[40%_auto] md:grid-cols-3 md:grid-rows-1 gap-6">
        
        <FestivalMap 
          ref="festivalMapComponent"
          class="md:col-span-2"
          :festivals="festivals"
          :filtered-festivals="filteredFestivals"
          :selected-festival="selectedFestival"
          :is-loading="dataLoading"
          @festival-selected-on-map="handleFestivalSelection"
          @selection-cleared="handleSelectionClear"
          @view-reset-requested="resetMapView"
        />

        <div class="md:col-span-1 md:row-start-1 flex flex-col overflow-hidden rounded-2xl bg-background/50 p-4 shadow-md border border-border">
          <div class="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 class="font-display text-xl md:text-2xl text-primary font-bold flex items-center gap-2">
              <Compass :size="24" class="text-accent" />
              Explore os Festivais
            </h2>
            <div v-if="hasActiveFilters" class="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              Filtrado
            </div>
          </div>

          <div class="space-y-4 mb-4 flex-shrink-0">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
              <input v-model="searchTerm" type="text" placeholder="Procurar por nome ou cidade..." class="w-full pl-10 pr-4 py-2.5 rounded-lg text-foreground bg-muted border border-border focus:ring-2 focus:ring-accent focus:border-accent transition">
            </div>
            <div class="flex gap-3">
              <div class="relative flex-1">
                <Calendar class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
                <select v-model="selectedMonth" class="w-full px-3 py-2.5 rounded-lg text-foreground bg-muted border border-border focus:ring-2 focus:ring-accent focus:border-accent transition appearance-none">
                  <option value="">Todos os meses</option>
                  <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                    {{ month.label }} ({{ month.count }})
                  </option>
                </select>
              </div>
              <button v-if="hasActiveFilters" @click="clearFilters" title="Limpar filtros" class="bg-muted hover:bg-border text-muted-foreground px-4 py-2.5 rounded-lg transition-colors">
                <X :size="16" />
              </button>
            </div>
             <div class="flex flex-wrap gap-2">
               <button v-for="season in seasons" :key="season.name" @click="filterBySeason(season.months)"
                 :class="[
                   'px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
                   selectedSeason === season.name 
                     ? 'bg-accent text-accent-foreground shadow' 
                     : 'bg-muted text-muted-foreground hover:bg-border'
                 ]">
                 <component :is="season.icon" :size="14" />
                 {{ season.name }}
               </button>
             </div>
          </div>

          <div class="space-y-2 overflow-y-auto scrollbar-themed flex-grow -mx-2 px-2 min-h-0">
            <div v-for="festival in filteredFestivals" :key="festival.id" 
              @click="panToFestival(festival)"
              @mouseenter="highlightMarker(festival, true)"
              @mouseleave="highlightMarker(festival, false)"
              :class="[
                'p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4',
                selectedFestival?.id === festival.id
                  ? 'bg-primary/10 border-primary shadow-sm'
                  : 'border-transparent hover:bg-primary/5 hover:border-primary/30'
              ]">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-bold text-sm text-primary group-hover:text-accent transition-colors leading-tight flex-1 pr-2">
                  {{ festival.name }}
                </h3>
                <div class="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <component :is="getIconComponent(festival.icon)" :size="20" class="text-primary" />
                </div>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin :size="12" class="flex-shrink-0 text-accent" />
                  {{ festival.city }}
                </p>
                <p class="text-xs text-muted-foreground/80 flex items-center gap-2">
                  <Calendar :size="12" class="flex-shrink-0 text-accent" />
                  {{ festival.date }}
                </p>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
                  {{ getMonthName(festival.month) }}
                </span>
                <ChevronRight :size="16" class="text-muted-foreground/50" />
              </div>
            </div>
            <div v-if="filteredFestivals.length === 0" class="text-center py-10 text-muted-foreground">
              <SearchX :size="48" class="mx-auto opacity-50 mb-4" />
              <h3 class="font-bold mb-1 text-foreground">Nenhum festival encontrado</h3>
              <p class="text-sm mb-4">Tente ajustar os filtros de busca.</p>
              <button @click="clearFilters" class="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors">
                Mostrar todos
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>

    <AboutModal :show="showAboutModal" @close="showAboutModal = false" />
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  MapPin, Info, Search, Calendar, X, SearchX, Focus, Maximize, Loader2, 
  Theater, Music, Mic, Leaf, Sun, MountainSnow, Grape, Fish, Compass,
  ChevronRight, Heart, Code, Sunset, Snowflake, TreePine, Waves
} from 'lucide-vue-next'
import HeaderBar from './components/HeaderBar.vue'
import AboutModal from './components/AboutModal.vue'
import FestivalMap from './components/FestivalMap.vue'

const festivals = ref([]);
const selectedFestival = ref(null);
const searchTerm = ref('');
const selectedMonth = ref('');
const selectedSeason = ref('');
const dataLoading = ref(true);
const showAboutModal = ref(false);
const festivalMapComponent = ref(null);

const seasons = [
  { name: 'Meio do Ano', months: [6, 7], icon: Sunset },
  { name: 'Fim do Ano', months: [8, 9, 10, 11, 12], icon: Waves }
];
const monthNames = { 1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro' };
const iconMap = { 'theater': Theater, 'music': Music, 'mic': Mic, 'leaf': Leaf, 'sun': Sun, 'mountain-snow': MountainSnow, 'grape': Grape, 'fish': Fish };

const filteredFestivals = computed(() => {
  return festivals.value.filter(festival => {
    const searchMatch = searchTerm.value.toLowerCase() === '' ||
      festival.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      festival.city.toLowerCase().includes(searchTerm.value.toLowerCase());

    let monthMatch = true;
    if (selectedMonth.value) {
      monthMatch = festival.month === parseInt(selectedMonth.value);
    } else if (selectedSeason.value) {
      const season = seasons.find(s => s.name === selectedSeason.value);
      monthMatch = season ? season.months.includes(festival.month) : true;
    }
    return searchMatch && monthMatch;
  });
});

const availableMonths = computed(() => {
  const monthCounts = {};
  festivals.value.forEach(festival => {
    monthCounts[festival.month] = (monthCounts[festival.month] || 0) + 1;
  });
  return Object.entries(monthCounts)
    .map(([month, count]) => ({ value: month, label: monthNames[parseInt(month)], count }))
    .sort((a, b) => parseInt(a.value) - parseInt(b.value));
});

const hasActiveFilters = computed(() => {
  return searchTerm.value.trim() !== '' || selectedMonth.value !== '' || selectedSeason.value !== '';
});

const getIconComponent = (iconName) => iconMap[iconName] || Music;
const getMonthName = (monthNumber) => monthNames[monthNumber] || 'Mês';

const filterBySeason = (months) => {
  const seasonInfo = seasons.find(s => JSON.stringify(s.months.sort()) === JSON.stringify(months.sort()));
  if (selectedSeason.value === seasonInfo?.name) {
    selectedSeason.value = '';
    selectedMonth.value = '';
  } else {
    selectedSeason.value = seasonInfo?.name || '';
    selectedMonth.value = '';
  }
};

const clearFilters = () => {
  searchTerm.value = '';
  selectedMonth.value = '';
  selectedSeason.value = '';
  selectedFestival.value = null;
};

const panToFestival = (festival) => {
  selectedFestival.value = festival;
  festivalMapComponent.value?.panToFestival(festival);
};

const highlightMarker = (festival, isHighlight) => {
  festivalMapComponent.value?.highlightMarker(festival, isHighlight);
};

const handleFestivalSelection = (festival) => {
  selectedFestival.value = festival;
};

const handleSelectionClear = () => {
  selectedFestival.value = null;
  festivalMapComponent.value?.closePopup();
  festivalMapComponent.value?.fitMapToVisibleMarkers();
}

const resetMapView = () => {
  clearFilters();
  festivalMapComponent.value?.resetMapView();
};

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}festivals.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    festivals.value = await response.json();
  } catch (e) {
    console.error("Failed to load festivals:", e);
  } finally {
    dataLoading.value = false;
  }
});
</script>
