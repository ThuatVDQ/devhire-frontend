<template>
  <nav class="bg-gray-900 p-4 flex justify-between items-center text-white">
    <!-- Logo -->
    <div class="flex items-center">
      <div class="text-lg font-bold"><span class="text-cyan-400">DevHire</span> for Business</div>
    </div>

    <!-- Center Navigation Links -->
    <div class="flex space-x-6">
      <router-link
        to="/recruiter/post-job"
        class="flex items-center space-x-2 hover:bg-cyan-400 px-4 py-2 rounded-lg transition"
      >
        <i class="pi pi-plus"></i>
        <span>Post Job</span>
      </router-link>
      <router-link
        to="/recruiter/find-cv"
        class="flex items-center space-x-2 hover:bg-cyan-400 px-4 py-2 rounded-lg transition"
      >
        <i class="pi pi-search"></i>
        <span>Search CV</span>
      </router-link>
      <router-link
        to="/recruiter/connect"
        class="flex items-center space-x-2 hover:bg-cyan-400 px-4 py-2 rounded-lg transition"
      >
        <i class="pi pi-comments"></i>
        <span>Connect</span>
      </router-link>
      <router-link
        to="/recruiter/help"
        class="flex items-center space-x-2 hover:bg-cyan-400 px-4 py-2 rounded-lg transition"
      >
        <i class="pi pi-question-circle"></i>
        <span>Help</span>
      </router-link>
    </div>

    <!-- Notifications and Button -->
    <div class="flex items-center space-x-6">
      <!-- Notifications -->
      <Notifications />

      <!-- Request a Quote Button -->
      <button
        @click="redirectToQuote"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
      >
        <i class="pi pi-pencil"></i>
        <span>Request a Quote</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import Notifications from '@/components/Notifications.vue' // Import Notifications.vue
import { useRouter } from 'vue-router'

const router = useRouter()

const redirectToQuote = () => {
  router.push('/recruiter/request-quote')
}
</script>
