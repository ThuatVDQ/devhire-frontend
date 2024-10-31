<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import defaultLogo from '../assets/logo.svg'

const router = useRouter()

function applyJob() {
  router.push(`/jobs/${state.job.id}`)
}

const state = defineProps({
  job: Object
})

const differenceInDays = computed(() => {
  const currentDate = new Date()
  const deadline = new Date(state.job.deadline)
  const differenceInTime = deadline.getTime() - currentDate.getTime()
  return Math.floor(differenceInTime / (1000 * 3600 * 24))
})

async function favoriteJob() {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${state.job.id}/like`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Job added to favorites:', response.data)
  } catch (error) {
    console.error('Error adding job to favorites:', error)
  }
}
console.log(state.job)
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
          <img
            class="size-8"
            :src="state.job.company.logo"
            @error="state.job.company.logo = defaultLogo"
          />
        </div>
        <div class="ms-3">
          <RouterLink
            class="inline-block text-[16px] font-semibold hover:text-emerald-600 transition-all duration-500 me-1"
            :to="`/jobs/${state.job.id}`"
            >{{ state.job.title }}</RouterLink
          >
          <span
            class="inline-block text-sm text-red-400"
            style="animation: blink 1s step-start infinite; opacity: 1"
          >
            {{ differenceInDays > 0 ? `Remaining ${differenceInDays} days` : 'Expired' }}
          </span>
          <div>
            <span
              class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
              >{{ state.job.type }}</span
            >

            <span class="text-sm font-medium inline-block me-1"
              >Salary:
              <span class="text-slate-400">
                {{
                  state.job.salary_start === 0 && state.job.salary_end === 0
                    ? 'Negotiable'
                    : `${state.job.salary_start} - ${state.job.salary_end} ${state.job.currency}`
                }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <p class="text-slate-400 py-3">{{ state.job.description }}</p>
      <div>
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ state.job.level }}</span
        >
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ state.job.position }}</span
        >
        <template v-if="state.job.skills && state.job.skills.length">
          <span
            v-for="(skill, index) in state.job.skills"
            :key="index"
            class="bg-blue-100 dark:bg-blue-800 inline-block text-blue-600 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >
            {{ skill.name }}
          </span>
        </template>
      </div>
    </div>
    <div
      class="px-6 py-2 bg-slate-50 dark:bg-slate-800 lg:flex justify-between items-center mt-auto"
    >
      <div class="lg:inline-block flex justify-between">
        <span class="inline-flex items-center me-1 text-slate-400">
          <i class="pi pi-map-marker mr-2"></i>Viet Nam
        </span>
      </div>
      <a
        class="btn btn-sm rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white md:ms-2 w-full lg:w-auto lg:mt-0 mt-4 px-4 py-1"
        href="#"
        @click.prevent="applyJob"
      >
        Apply now
      </a>
    </div>
    <a
      :class="[
        'h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 absolute top-0 end-0 m-3',
        job.isFavorited ? 'bg-emerald-600 text-white' : 'bg-emerald-600/5 text-emerald-600'
      ]"
      href=""
      @click.prevent="favoriteJob"
    >
      <i class="pi pi-heart"></i>
    </a>
  </div>
</template>
<style>
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
