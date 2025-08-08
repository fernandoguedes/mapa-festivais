<template>
  <div class="lg:col-span-1 flex flex-col glass rounded-2xl p-4 shadow-lg h-[50vh] lg:h-full animate-fade-in-up"
       style="animation-delay: 0.2s;">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'FestivalSidebar'
}
</script>
