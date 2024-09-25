<script setup>
import JobList from './JobList.vue'
import { reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const state = reactive({
  jobs: [],
  isLoading: true
})

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/jobs')
    state.jobs = response.data.slice(0, 6)
    console.log(response.data)
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="container md:mt-24 mt-16 py-16">
    <div class="grid grid-cols-1 pb-8 text-center">
      <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
        Popular Jobs
      </h3>
      <p class="text-slate-400 max-w-xl mx-auto">
        Search all the open positions on the web. Get your own personalized salary estimate. Read
        reviews on over 30000+ companies worldwide.
      </p>
    </div>
    <JobList :jobs="state.jobs" :pagination="false" />

    <div class="grid md:grid-cols-1 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <RouterLink
          to="/jobs"
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          See More Jobs <i class="pi pi-arrow-right pl-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
