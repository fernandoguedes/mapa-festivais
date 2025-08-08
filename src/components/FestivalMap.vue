<template>
  <div class="w-full h-full rounded-2xl shadow-md overflow-hidden border border-border relative">
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <div class="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
      <div class="bg-background/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-border">
        <button v-if="selectedFestival" @click="$emit('selection-cleared')" title="Limpar seleção" class="p-2.5 rounded-lg hover:bg-border transition-colors block w-full mb-1">
          <X :size="20" class="text-accent mx-auto" />
        </button>
        <button @click="fitMapToVisibleMarkers" title="Ajustar visualização" class="p-2.5 rounded-lg hover:bg-border transition-colors block w-full mb-1">
          <Focus :size="20" class="text-primary mx-auto" />
        </button>
        <button @click="$emit('view-reset-requested')" title="Mostrar todos" class="p-2.5 rounded-lg hover:bg-border transition-colors block w-full">
          <Maximize :size="20" class="text-primary mx-auto" />
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-30">
      <div class="text-center">
        <Loader2 :size="48" class="animate-spin text-accent mx-auto mb-4" />
        <p class="text-primary font-medium">Carregando mapa...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet.markercluster'; // Importe o plugin
import { X, Focus, Maximize, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  festivals: { type: Array, required: true },
  filteredFestivals: { type: Array, required: true },
  selectedFestival: { type: Object, default: null },
  isLoading: { type: Boolean, default: true },
});

const emit = defineEmits(['festival-selected-on-map', 'selection-cleared', 'view-reset-requested']);

const mapContainer = ref(null);
const map = ref(null);
const markers = ref({});
const markerClusterGroup = ref(null); // Ref para o grupo de clusters

const createIcon = (color, accentColor) => L.icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/></filter></defs>
      <path fill="${color}" filter="url(#shadow)" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8z"/><circle fill="${accentColor}" cx="12" cy="8" r="3"/>
    </svg>
  `)}`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38]
});

const defaultIcon = createIcon('#8A6F55', '#FDF8F0');
const selectedIcon = createIcon('#285C4D', '#E77728');

const createPopupHtml = (festival) => {
  const socialIcons = {
    website: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"></path><polygon points="9.5 15.5 15.5 12 9.5 8.5"></polygon></svg>`,
  };

  let linksHtml = '';
  if (festival.links && Object.keys(festival.links).length > 0) {
    linksHtml += '<div class="flex items-center gap-4 mt-3 pt-3 border-t border-border">';
    for (const [key, url] of Object.entries(festival.links)) {
      if (socialIcons[key]) {
        linksHtml += `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${key.charAt(0).toUpperCase() + key.slice(1)}" class="text-muted-foreground hover:text-accent transition-colors">${socialIcons[key]}</a>`;
      }
    }
    linksHtml += '</div>';
  }

  return `
    <div class="font-sans p-1" style="max-width: 240px;">
      <h3 class="font-bold text-base text-primary leading-tight mb-1">${festival.name}</h3>
      <p class="text-xs text-muted-foreground">${festival.description}</p>
      ${linksHtml}
    </div>
  `;
};

const initMap = () => {
  map.value = L.map(mapContainer.value, { zoomControl: false, attributionControl: false }).setView([-4.5, -61], 5);
  L.control.zoom({ position: 'topright' }).addTo(map.value);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd', maxZoom: 16
  }).addTo(map.value);

  markerClusterGroup.value = L.markerClusterGroup();
  map.value.addLayer(markerClusterGroup.value);
};

const addMarkersToMap = () => {
  props.festivals.forEach(festival => {
    const marker = L.marker(festival.coords, { icon: defaultIcon })
      .bindPopup(() => createPopupHtml(festival), { maxWidth: 280, closeButton: false });

    marker.on('click', () => {
      emit('festival-selected-on-map', festival);
    });
    markers.value[festival.id] = marker;
  });
};

const updateVisibleMarkers = () => {
  if (!markerClusterGroup.value) return;
  markerClusterGroup.value.clearLayers();
  
  props.filteredFestivals.forEach(festival => {
    const marker = markers.value[festival.id];
    if (marker) {
      markerClusterGroup.value.addLayer(marker);
    }
  });
};

const fitMapToBounds = (coords) => {
  if (!map.value || coords.length === 0) return;
  const bounds = L.latLngBounds(coords);
  if (bounds.isValid()) {
    map.value.fitBounds(bounds.pad(0.2), { animate: true, duration: 1 });
  }
};

const panToFestival = (festival) => {
  if (!map.value) return;
  const marker = markers.value[festival.id];
  if (marker) {
    if (markerClusterGroup.value.hasLayer(marker)) {
      map.value.flyTo(festival.coords, 14, { animate: true, duration: 1.5 });
      setTimeout(() => marker.openPopup(), 800);
    } else {
      markerClusterGroup.value.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    }
  }
};

const highlightMarker = (festival, isHighlight) => {
  const marker = markers.value[festival.id];
  if (!marker || (props.selectedFestival && props.selectedFestival.id === festival.id)) return;
  
  const element = marker.getElement();
  if (element) {
    element.classList.toggle('marker-highlight', isHighlight);
    marker.setZIndexOffset(isHighlight ? 500 : 0);
  }
};

const fitMapToVisibleMarkers = () => fitMapToBounds(props.filteredFestivals.map(f => f.coords));
const resetMapView = () => fitMapToBounds(props.festivals.map(f => f.coords));

const closePopup = () => {
  if (map.value && props.selectedFestival) {
    const marker = markers.value[props.selectedFestival.id];
    marker?.closePopup();
  }
}

defineExpose({ panToFestival, highlightMarker, fitMapToVisibleMarkers, resetMapView, closePopup });

onMounted(() => {
  initMap();
  if (props.festivals.length > 0) {
    addMarkersToMap();
    updateVisibleMarkers();
    resetMapView();
  }
});

watch(() => props.festivals, (newFestivals) => {
  if (newFestivals.length > 0 && Object.keys(markers.value).length === 0) {
    addMarkersToMap();
    updateVisibleMarkers();
    resetMapView();
  }
});

watch(() => props.filteredFestivals, () => {
  updateVisibleMarkers();
});

watch(() => props.selectedFestival, (newSelection, oldSelection) => {
  if (oldSelection && markers.value[oldSelection.id]) {
    markers.value[oldSelection.id].setIcon(defaultIcon);
    markers.value[oldSelection.id].setZIndexOffset(0);
  }
  if (newSelection && markers.value[newSelection.id]) {
    markers.value[newSelection.id].setIcon(selectedIcon);
    markers.value[newSelection.id].setZIndexOffset(1000);
  }
});
</script>
