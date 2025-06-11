<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import JobList from '@/components/JobList.vue'
import FeatureSection from '@/components/FeatureSection.vue'
// import JobRecommendation from '@/components/JobRecommendation.vue'

const route = useRoute()

const searchCriteria = ref({
  keyword: '',
  location: '',
  type: '',
  salary: '',
  currency: '',
  experience: '',
  level: '',
  skills: ''
})

const handleSearch = (criteria) => {
  searchCriteria.value = criteria
}

const updateKeywordFromTitleUrl = () => {
  if (route.query.title) {
    searchCriteria.value.keyword = route.query.title
  } else {
    // Clear keyword if 'title' query is removed
    searchCriteria.value.keyword = ''
  }
}

const updateSkillsFromSkillUrl = () => {
  if (route.query.skill) {
    searchCriteria.value.skills = route.query.skill
  } else {
    searchCriteria.value.skills = ''
  }
}

watch(
  () => route.query.title,
  () => {
    updateKeywordFromTitleUrl()
  },
  { immediate: true }
)

watch(
  () => route.query.skill,
  (newSkill) => {
    updateSkillsFromSkillUrl()
  },
  { immediate: true }
)

onMounted(() => {
  updateKeywordFromTitleUrl()
  updateSkillsFromSkillUrl()
})
</script>

<template>
  <SearchBar @search="handleSearch" />
  <!-- <JobRecommendation /> -->
  <JobList :searchCriteria="searchCriteria" class="pt-8" />
  <FeatureSection />
</template>
