<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const state = defineProps({
  job: Object
})

const differenceInDays = computed(() => {
  const currentDate = new Date()
  const createdAt = new Date(state.job.created_at)
  const differenceInTime = currentDate.getTime() - createdAt.getTime()
  return Math.floor(differenceInTime / (1000 * 3600 * 24))
})
</script>

<template>
  <div
    class="flex flex-col group relative overflow-hidden bg-white dark:bg-slate-900 shadow hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-700 hover:-mt-2 rounded-md transition-all duration-500"
  >
    <div class="p-6">
      <div class="flex items-center">
        <div
          class="size-14 min-w-[56px] flex items-center justify-center bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md"
        >
          <img class="size-8" src="../assets/logo.svg" />
        </div>
        <div class="ms-3">
          <RouterLink
            class="inline-block text-[16px] font-semibold hover:text-emerald-600 transition-all duration-500 me-1"
            :to="`/jobs/${job.id}`"
            >{{ job.title }}</RouterLink
          >
          <span class="inline-block text-sm text-slate-400">{{ differenceInDays }} days ago</span>
          <div>
            <span
              class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
              >{{ job.type }}</span
            >

            <span class="text-sm font-medium inline-block me-1"
              >Salary:
              <span class="text-slate-400"
                >{{ job.salaryStart }} - {{ job.salaryEnd }} {{ job.currency }}</span
              >
            </span>
          </div>
        </div>
      </div>
      <p class="text-slate-400 py-3">{{ job.description }}</p>
      <div>
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ job.level }}</span
        >
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ job.position }}</span
        >
      </div>
    </div>
    <div
      class="px-6 py-2 bg-slate-50 dark:bg-slate-800 lg:flex justify-between items-center mt-auto"
    >
      <div class="lg:inline-block flex justify-between">
        <span class="inline-block me-1 font-semibold">
          <i class="pi pi-verified text-blue-500 me-1"></i>
        </span>
        <ul class="list-none inline-block me-1 text-yellow-400 space-x-0.5">
          <li class="inline">
            <i class="pi pi-star-fill text-lg"></i>
          </li>
          <li class="inline">
            <i class="pi pi-star-fill text-lg"></i>
          </li>
        </ul>
        <span class="inline-flex items-center me-1 text-slate-400">
          <i class="pi pi-map-marker"></i>Viet Nam
        </span>
      </div>
      <a
        class="btn btn-sm rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white md:ms-2 w-full lg:w-auto lg:mt-0 mt-4 px-4 py-1"
        href=""
        >Apply now</a
      >
    </div>
    <a
      class="h-9 w-9 inline-flex items-center justify-center rounded-full bg-emerald-600/5 hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 hover:text-white absolute top-0 end-0 m-3"
      href=""
    >
      <i class="pi pi-bookmark"></i>
    </a>
  </div>
</template>
