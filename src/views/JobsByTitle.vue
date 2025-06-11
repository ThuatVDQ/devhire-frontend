<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1
          class="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Jobs by Title
        </h1>
        <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Explore job opportunities based on specific IT job titles.
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 sm:p-10 lg:p-12">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-3"
        >
          <RouterLink
            v-for="title in jobTitles"
            :key="title"
            :to="`/jobs?title=${title}`"
            class="flex items-center justify-center p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-200 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ title }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router' // Đảm bảo bạn đã import RouterLink

const jobTitles = ref([
  '.NET Developer',
  'Android App Developer',
  'Android Developer',
  'Back End Developer',
  'Back End Web Developer',
  'Bridge Project Management',
  'Business Analysis',
  'C++ Developer',
  'Embedded Engineer',
  'Front End Developer',
  'Front End Web Developer',
  'Full Stack Developer',
  'Full Stack Web Developer',
  'Java Developer',
  'Java Web Developer',
  'Leadership',
  'Mobile Apps Developer',
  'NodeJS Developer',
  'PHP Developer',
  'Product Management',
  'Product Owner',
  'Project Management',
  'Python Developer',
  'Python Web Developer',
  'Senior Back End Developer',
  'Senior Front End Developer',
  'Senior Full Stack Developer',
  'Senior Java Developer',
  'Senior Product Owner',
  'Software Architecture',
  'Solution Architect',
  'System Administrator',
  'System Engineer',
  'Tester',
  'UX UI Designer',
  'iOS Developer'
])
</script>
