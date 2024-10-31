<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'
const showFavorites = ref(false)

const toggleFavorites = (value) => {
  showFavorites.value = value
}
</script>

<template>
  <SearchBar :showFavorites="showFavorites" @toggle-favorites="toggleFavorites" />
  <JobList :showFavorites="showFavorites" />
  <FeatureSection />
</template>
