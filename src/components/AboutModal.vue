<template>
  <div v-if="show" 
       @click="$emit('close')"
       class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
       :class="show ? 'opacity-100' : 'opacity-0 pointer-events-none'">
    <div @click.stop
         class="glass w-full max-w-lg p-6 md:p-8 rounded-2xl shadow-2xl text-theme-text transform transition-transform duration-300"
         :class="show ? 'scale-100' : 'scale-95'">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'AboutModal',
  props: {
    show: Boolean
  }
}
</script>
