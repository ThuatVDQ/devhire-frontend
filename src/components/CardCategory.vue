<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  category: {
    type: String,
    required: true
  },
  slots: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div
    class="group p-4 rounded-md shadow dark:shadow-gray-700 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 transition-all duration-500"
  >
    <h5 class="text-lg font-semibold group-hover:text-white">{{ category }}</h5>
    <span class="block text-slate-400 group-hover:text-white/50 text-sm mt-1"
      >{{ slots }} Jobs available</span
    >
    <div class="mt-2">
      <RouterLink
        :to="`/category/${id}`"
        class="text-emerald-600 dark:text-white/80 group-hover:text-white font-medium items-center inline-flex"
      >
        Explore Jobs <i class="pi pi-arrow-right pl-1"></i>
      </RouterLink>
    </div>
  </div>
</template>
