<script setup>
import { reactive, onMounted } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import axios from 'axios'

const state = reactive({
  jobs: [],
  isLoading: true
})

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    state.jobs = response.data
  } catch (e) {
    console.error(e)
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <SearchBar />
  <JobList :jobs="state.jobs" />
  <FeatureSection />
</template>
