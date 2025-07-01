<template>
  <div :data-theme="theme" class="app-layout">
    <HeaderBar />
    <div class="d-flex app-content">
      <SideBar @toggle="toggleSidebar" />
      <main :class="['flex-fill', 'main-content', { 'sidebar-expanded': isSidebarExpanded }]">
        <slot />
      </main>
    </div>
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import HeaderBar from '../components/shared/HeaderBar/index.vue'
import SideBar from '../components/shared/SideBar/index.vue'
import FooterBar from '../components/shared/FooterBar/index.vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.current)

const isSidebarExpanded = ref(false)

function toggleSidebar(expanded: boolean) {
  isSidebarExpanded.value = expanded
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
}

.main-content {
  padding: 1rem;
  min-height: 80vh;
  overflow-x: auto;
  grid-template-columns: repeat(4, 1fr);
}

.main-content.sidebar-expanded {
  grid-template-columns: repeat(3, 1fr);
}

/* Mobile adjustments */
@media (max-width: 767.98px) {
  .main-content {
    padding: 0.75rem;
    padding-top: 60px; /* Space for toggle button */
  }
}
</style>
