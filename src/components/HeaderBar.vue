<template>
  <header class="header-gradient border-b border-theme-text/10 relative overflow-hidden">
    <div class="absolute inset-0 w-full h-full opacity-[0.03]"
         style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10H10V0H30V10H50V0H70V10H90V0H100\' stroke=\'black\' stroke-width=\'4\'/%3E%3Cpath d=\'M10 20V10H30V20H50V10H70V20H90V10\' stroke=\'black\' stroke-width=\'4\'/%3E%3C/svg%3E'); background-size: 100px 20px;">
    </div>
    <div class="container mx-auto px-4 py-6 md:py-8 relative z-10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-4 animate-fade-in-up">
          <div class="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 text-theme-primary">
            <slot name="logo" />
          </div>
          <div>
            <h1 class="font-display text-3xl md:text-4xl text-theme-primary font-bold tracking-tight leading-tight">
              <slot name="title" />
            </h1>
            <p class="text-theme-secondary text-sm md:text-base font-light tracking-wide">
              <slot name="subtitle" />
            </p>
          </div>
        </div>
        <div class="header-actions flex items-center justify-center md:justify-end gap-3 animate-fade-in-up"
             style="animation-delay: 0.2s;">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'HeaderBar'
}
</script>
