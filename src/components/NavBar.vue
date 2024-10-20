<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const isActiveLink = (routePath) => {
  const route = useRoute()
  return routePath === route.path
}
</script>

<template>
  <header class="bg-white shadow-lg">
    <nav class="container py-4 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="DevHire Logo" class="w-12 h-12" />
        <h1 class="ml-2 text-2xl font-bold text-green-600">DevHire</h1>
      </RouterLink>

      <ul class="hidden md:flex space-x-6 text-gray-600">
        <li>
          <RouterLink
            to="/jobs"
            :class="[isActiveLink('/jobs') ? 'text-green-600' : 'hover:text-green-600']"
            >Jobs</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/companies"
            :class="[isActiveLink('/companies') ? 'text-green-600' : 'hover:text-green-600']"
            >Companies</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/about"
            :class="[isActiveLink('/about-us') ? 'text-green-600' : 'hover:text-green-600']"
            >About Us</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            :class="[isActiveLink('/contact') ? 'text-green-600' : 'hover:text-green-600']"
            >Contact</RouterLink
          >
        </li>
      </ul>

      <div class="hidden md:flex space-x-4">
        <RouterLink to="/login" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >Login</RouterLink
        >
        <RouterLink
          to="/signup"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Sign Up
        </RouterLink>
      </div>

      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="isMenuOpen" class="md:hidden bg-white shadow-lg">
      <ul class="flex flex-col space-y-4 p-4 text-gray-600">
        <li>
          <RouterLink
            to="/jobs"
            :class="[isActiveLink('/jobs') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Jobs</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/companies"
            :class="[isActiveLink('/companies') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Companies</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/about"
            :class="[isActiveLink('/about-us') ? 'text-blue-500' : 'hover:text-blue-500']"
            >About Us</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            :class="[isActiveLink('/contact') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Contact</RouterLink
          >
        </li>
        <div class="flex space-x-4">
          <RouterLink
            to="/login"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/signup"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full"
          >
            Sign Up
          </RouterLink>
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
