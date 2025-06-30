<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Pet Shop</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><router-link class="nav-link" to="/about">Sobre</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/freight">Frete</router-link></li>
        </ul>
        <ThemeToggle />
        <router-link class="btn btn-outline-primary ms-2" to="/cart">Carrinho</router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/shared/ThemeToggle/index.vue'
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>
