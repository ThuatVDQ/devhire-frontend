<script setup>
import { reactive, onMounted, defineProps, watch } from 'vue'
import CardJob from './CardJob.vue'
import CardExploreJob from './CardExploreJob.vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const state = reactive({
  jobs: [],
  isLoading: true
})

const fetchJobs = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/related`, {
      params: {
        jobId
      }
    })
    state.jobs = response.data
  } catch (e) {
    console.error('Failed to fetch related jobs:', e)
  }
}

watch(
  () => props.id,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      fetchJobs(newVal)
    }
  }
)

onMounted(async () => {
  fetchJobs(props.id)
})
</script>

<template>
  <div class="lg:mt-24 mt-16 bg-slate-50">
    <div class="grid grid-cols-1 pb-8 text-center">
      <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
        Related Vacancies
      </h3>
      <p class="text-slate-400 max-w-xl mx-auto">
        Search all the open positions on the web. Get your own personalized salary estimate. Read
        reviews on over 30000+ companies worldwide.
      </p>
    </div>
    <div
      class="container grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px] auto-rows-fr"
    >
      <CardJob v-for="job in state.jobs" :key="job.id" :job="job" />
    </div>
  </div>
  <CardExploreJob />
</template>
