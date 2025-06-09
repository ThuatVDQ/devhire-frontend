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
  console.log('Search criteria updated:', searchCriteria.value)
}

const updateKeywordFromTitleUrl = () => {
  if (route.query.title) {
    searchCriteria.value.keyword = route.query.title
    console.log('Keyword updated from URL title:', searchCriteria.value.keyword)
  } else {
    // Clear keyword if 'title' query is removed
    searchCriteria.value.keyword = ''
    console.log('Title query removed, keyword cleared.')
  }
}

const updateSkillsFromSkillUrl = () => {
  if (route.query.skill) {
    searchCriteria.value.skills = route.query.skill
    console.log('Skills updated from URL skill:', searchCriteria.value.skills)
  } else {
    // Clear skills array if 'skill' query is removed
    searchCriteria.value.skills = ''
    console.log('Skill query removed, skills array cleared.')
  }
}

// Watcher for 'title' query parameter
watch(
  () => route.query.title,
  () => {
    updateKeywordFromTitleUrl()
  },
  { immediate: true } // Run on initial mount
)

// Watcher for 'skill' query parameter
watch(
  () => route.query.skill,
  (newSkill) => {
    // This watcher specifically handles the 'skill' query parameter
    updateSkillsFromSkillUrl()
  },
  { immediate: true } // Run on initial mount
)

// Initial setup when component mounts
onMounted(() => {
  updateKeywordFromTitleUrl() // Check for 'title' on mount
  updateSkillsFromSkillUrl() // Check for 'skill' on mount
})
</script>

<template>
  <SearchBar @search="handleSearch" />
  <!-- <JobRecommendation /> -->
  <JobList :searchCriteria="searchCriteria" class="pt-8" />
  <FeatureSection />
</template>
