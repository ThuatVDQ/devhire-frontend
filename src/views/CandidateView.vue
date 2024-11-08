<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>
<template>
  <NavBar />
  <RouterView class="bg-gray-200" />
  <Footer />
</template>
