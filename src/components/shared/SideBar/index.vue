<template>
  <nav :class="sidebarClasses" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
    <!-- Toggle button for mobile -->
    <button 
      class="sidebar-toggle d-md-none"
      @click="toggleSidebar"
      :aria-label="isExpanded ? 'Fechar menu' : 'Abrir menu'"
    >
      <i :class="isExpanded ? 'bi bi-x' : 'bi bi-list'"></i>
    </button>

    <!-- Overlay for mobile -->
    <div 
      v-if="isExpanded" 
      class="sidebar-overlay d-md-none"
      @click="closeSidebar"
    ></div>

    <div class="sidebar-content">
      <div class="sidebar-header p-3">
        <h5 class="sidebar-title">Navegação</h5>
        <button 
          class="btn-close d-md-none"
          @click="closeSidebar"
          aria-label="Fechar menu"
        ></button>
      </div>

      <ul class="sidebar-nav list-unstyled">
        <li class="nav-item">
          <router-link to="/" class="nav-link" @click="closeSidebar">
            <i class="bi bi-house-door me-2"></i>
            <span>Home</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" @click="closeSidebar">
            <i class="bi bi-info-circle me-2"></i>
            <span>Sobre</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/freight" class="nav-link" @click="closeSidebar">
            <i class="bi bi-truck me-2"></i>
            <span>Frete</span>
          </router-link>
        </li>
        <li v-if="authStore.isAuthenticated" class="nav-item">
          <router-link to="/orders" class="nav-link" @click="closeSidebar">
            <i class="bi bi-bag-check me-2"></i>
            <span>Pedidos</span>
          </router-link>
        </li>
        <li v-if="authStore.isAdmin" class="nav-item">
          <router-link to="/admin" class="nav-link" @click="closeSidebar">
            <i class="bi bi-gear me-2"></i>
            <span>Admin</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isExpanded = ref(false)

const sidebarClasses = computed(() => ({
  sidebar: true,
  'sidebar-expanded': isExpanded.value,
  'sidebar-collapsed': !isExpanded.value,
}))

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const expandSidebar = () => {
  isExpanded.value = true
}

const collapseSidebar = () => {
  isExpanded.value = false
}

const closeSidebar = () => {
  isExpanded.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
</script>

<style scoped src="./styles.scss"></style>
