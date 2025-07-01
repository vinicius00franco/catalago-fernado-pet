<template>
  <div v-if="totalPages > 1" class="col-12">
    <nav aria-label="Navegação de páginas" class="d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="go(currentPage - 1)" :disabled="currentPage === 1">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>
        <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <button class="page-link" @click="go(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="go(currentPage + 1)" :disabled="currentPage === totalPages">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
    <div class="text-center mt-2">
      <small class="text-muted">Página {{ currentPage }} de {{ totalPages }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  visiblePages: number[]
}>()

const emit = defineEmits<{
  (e: 'go', page: number): void
}>()

function go(page: number) {
  emit('go', page)
}
</script>

<style scoped src="./styles.scss"></style>
