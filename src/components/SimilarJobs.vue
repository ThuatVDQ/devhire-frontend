<script setup>
import { reactive, onMounted } from 'vue'
import JobList from './JobList.vue'
import CardExploreJob from './CardExploreJob.vue'
import axios from 'axios'

const state = reactive({
  jobs: [],
  isLoading: true
})

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs')
    state.jobs = response.data
  } catch (e) {
    console.error(e)
  }
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
    <JobList :jobs="state.jobs" :pagination="false" />
  </div>
  <CardExploreJob />
</template>
