<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'

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
  <SearchBar :showFavorites="showFavorites" @search="handleSearch" />
  <JobList :showFavorites="showFavorites" :searchCriteria="searchCriteria" />
  <FeatureSection />
</template>
