<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-800 md:p-8 p-6 lg:me-10 relative"
  >
    <!-- Left Section: Text and Form -->
    <div>
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white leading-tight">
        Find Your <br />Dream <span class="text-emerald-600">Job</span> Here
      </h1>
      <p class="mt-4 text-slate-500 dark:text-slate-300">
        Explore thousands of job opportunities, career options, and employment offers from top
        companies.
      </p>

      <!-- Search Form -->
      <div class="grid grid-cols-1 gap-4">
        <img
          src="@/assets/dream-job.jpg"
          alt="Career Opportunities"
          class="mt-8 w-full max-w-md object-contain"
        />
        <RouterLink
          to="/jobs"
          class="text-center text-white bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 font-medium rounded-lg px-5 py-2.5 mb-2"
        >
          Search <i class="pi pi-arrow-right pl-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
