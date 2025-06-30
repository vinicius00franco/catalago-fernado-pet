<template>
  <nav class="d-none d-md-block bg-light sidebar">
    <ul class="list-unstyled p-2">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">Sobre</router-link></li>
      <li><router-link to="/orders">Pedidos</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  width: 200px;
}
</style>
