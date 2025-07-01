<template>
  <button class="btn btn-sm btn-secondary" @click="toggle">
    {{ theme === 'light' ? 'Escuro' : 'Claro' }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
const store = useThemeStore()
const theme = computed(() => store.current)
const toggle = () => store.toggle()
</script>

<style scoped src="./styles.scss"></style>
