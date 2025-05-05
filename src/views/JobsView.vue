<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import JobRecommendation from '@/components/JobRecommendation.vue'

const searchCriteria = ref({
  keyword: '',
  location: '',
  type: ''
})

const handleSearch = (criteria) => {
  searchCriteria.value = criteria
}
</script>

<template>
  <SearchBar @search="handleSearch" />
  <JobRecommendation />
  <JobList :searchCriteria="searchCriteria" />
  <FeatureSection />
</template>
