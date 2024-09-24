<script setup>
defineProps({
  company: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="group relative p-6 rounded-md shadow dark:shadow-gray-700 mt-6">
    <div
      class="size-14 flex items-center justify-center bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md relative -mt-12"
    >
      <img src="" alt="" />
    </div>
    <div class="mt-4">
      <a href="" class="text-lg hover:text-emerald-600 font-semibold">{{ company.name }}</a>
      <p class="text-slate-400 mt-2">{{ company.description }}</p>
    </div>
    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
      <span class="text-slate-400 flex items-center">
        <i class="pi pi-map-marker"></i>
        {{ company.address }}
      </span>
      <span class="block font-semibold text-emerald-600"> 2 Jobs</span>
    </div>
  </div>
</template>
