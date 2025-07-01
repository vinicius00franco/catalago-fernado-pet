<template>
  <nav :class="sidebarClasses">
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
const isExpanded = ref(false);

const sidebarClasses = computed(() => ({
  'sidebar': true,
  'sidebar-expanded': isExpanded.value
}));

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

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

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 70px;
  left: 15px;
  z-index: 1050;
  background: #2e8b57;
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: #236b43;
  transform: scale(1.1);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  border-bottom: 1px solid #dee2e6;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  margin: 0;
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #495057;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(46, 139, 87, 0.1);
  color: #2e8b57;
}

.nav-link.router-link-active {
  background-color: #2e8b57;
  color: white;
  font-weight: 500;
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #fff;
}

.nav-link i {
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  border-top: 1px solid #dee2e6;
  background: rgba(255, 255, 255, 0.8);
}

.user-info {
  text-align: center;
}

.user-avatar {
  display: flex;
  justify-content: center;
}

.user-details {
  margin-bottom: 0.5rem;
}

.user-details strong {
  max-width: 100%;
}

/* Dark theme */
[data-theme='dark'] .sidebar {
  background: linear-gradient(180deg, #343a40 0%, #495057 100%);
  border-right-color: #495057;
}

[data-theme='dark'] .sidebar-header,
[data-theme='dark'] .sidebar-footer {
  background: rgba(33, 37, 41, 0.8);
  border-color: #495057;
}

[data-theme='dark'] .sidebar-title {
  color: #f8f9fa;
}

[data-theme='dark'] .nav-link {
  color: #adb5bd;
}

[data-theme='dark'] .nav-link:hover {
  background-color: rgba(46, 139, 87, 0.2);
  color: #2e8b57;
}

[data-theme='dark'] .user-details strong {
  color: #f8f9fa;
}

/* Responsive */
@media (max-width: 767.98px) {
  .sidebar-toggle {
    display: block !important;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1045;
    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  .sidebar-expanded {
    transform: translateX(0) !important;
  }

  .sidebar.d-none {
    display: flex !important;
  }
}

/* Desktop adjustments */
@media (min-width: 768px) {
  .sidebar {
    position: relative;
    transform: none !important;
  }

  .sidebar-toggle,
  .sidebar-overlay {
    display: none !important;
  }
}
</style>
