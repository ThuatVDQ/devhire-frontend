<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SideBar />

    <div class="flex flex-col flex-1 w-full">
      <!-- Content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import SideBar from './SideBar.vue'
</script>
