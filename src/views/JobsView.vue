<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'
// import JobRecommendation from '@/components/JobRecommendation.vue'

const searchCriteria = ref({
  keyword: '',
  location: '',
  type: '',
  salary: '',
  experience: '',
  level: ''
})

const handleSearch = (criteria) => {
  searchCriteria.value = criteria
  console.log('Search criteria updated:', searchCriteria.value)
}
</script>

<template>
  <SearchBar @search="handleSearch" />
  <!-- <JobRecommendation /> -->
  <JobList :searchCriteria="searchCriteria" class="pt-8" />
  <FeatureSection />
</template>
