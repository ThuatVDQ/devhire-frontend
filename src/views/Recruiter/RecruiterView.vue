<script setup>
import { RouterView } from 'vue-router'
import RecruiterSidebar from '@/components/RecruiterSidebar.vue'
import RecruiterNavBar from '@/components/RecruiterNavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <RecruiterNavBar />

    <!-- Main Body -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <RecruiterSidebar />

      <!-- Content Area -->
      <div class="flex-1 bg-gray-100 p-5 overflow-y-auto">
        <RouterView />
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>
