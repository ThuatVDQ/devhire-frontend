<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardJob from './CardJob.vue'

const recommendedJobs = ref([])
const isLoading = ref(true)

const fetchRecommendedJobs = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      recommendedJobs.value = []
      return
    }

    const response = await axios.get('http://localhost:8090/api/recommendations', {
      params: { topK: 4 },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    recommendedJobs.value = response.data || []
  } catch (error) {
    console.error('Error fetching recommended jobs:', error)
    recommendedJobs.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRecommendedJobs()
})
</script>

<template>
  <div v-if="!isLoading && recommendedJobs.length" class="container">
    <h2 class="text-2xl font-semibold my-4">Jobs Recommended For You</h2>
    <div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px] auto-rows-fr">
      <CardJob v-for="job in recommendedJobs" :key="job.id" :job="job" />
    </div>
  </div>
</template>
