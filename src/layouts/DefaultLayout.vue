<template>
  <div :data-theme="theme">
    <HeaderBar />
    <div class="d-flex">
      <SideBar />
      <main class="flex-fill p-3">
        <slot />
      </main>
    </div>
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import HeaderBar from '@/components/shared/HeaderBar/index.vue'
import SideBar from '@/components/shared/SideBar/index.vue'
import FooterBar from '@/components/shared/FooterBar/index.vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.current)
</script>

<style scoped>
main {
  min-height: 80vh;
}
</style>
