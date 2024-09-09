<script setup>
import { ref } from 'vue';
const isMenuOpen = ref(false);
const toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
}
</script>

<template>
    <header class="bg-white shadow-lg">
    <nav class="container mx-auto p-4 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <img src="@/assets/logo.svg" alt="DevHire Logo" class="w-12 h-12">
        <h1 class="ml-2 text-2xl font-bold text-blue-600">DevHire</h1>
      </div>

      <!-- Navigation Links -->
      <ul class="hidden md:flex space-x-6 text-gray-600">
        <li><a href="#jobs" class="hover:text-blue-500">Jobs</a></li>
        <li><a href="#companies" class="hover:text-blue-500">Companies</a></li>
        <li><a href="#about" class="hover:text-blue-500">About Us</a></li>
        <li><a href="#contact" class="hover:text-blue-500">Contact</a></li>
      </ul>

      <!-- Auth Buttons -->
      <div class="hidden md:flex space-x-4">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Sign Up</button>
      </div>

      <!-- Mobile Menu Icon -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white shadow-lg">
      <ul class="flex flex-col space-y-4 p-4 text-gray-600">
        <li><a href="#jobs" class="hover:text-blue-500">Jobs</a></li>
        <li><a href="#companies" class="hover:text-blue-500">Companies</a></li>
        <li><a href="#about" class="hover:text-blue-500">About Us</a></li>
        <li><a href="#contact" class="hover:text-blue-500">Contact</a></li>
        <div class="flex space-x-4">
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">Login</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full">Sign Up</button>
        </div>
      </ul>
    </div>
  </header>
</template>


<style scoped>
header {
  background-color: #f8f9fa;
}
</style>