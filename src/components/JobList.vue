<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import CardJob from './CardJob.vue'
import axios from 'axios'
import icon_sad from '@/assets/icon-sad.png'

const API_URL = import.meta.env.VITE_APP_API_URL

const jobs = ref([])
const currentPage = ref(0)
const pageSize = ref(8) // số lượng công việc trên mỗi trang
const totalPages = ref(0)
const isLoading = ref(true)

const props = defineProps({
  searchCriteria: Object
})

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')

    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const response = await axios.post(`${API_URL}/jobs/filter`, {
      params: { page, limit: pageSize.value },
      headers
    })

    const sortedJobs = response.data.jobs.sort((a, b) => {
      return (b.is_highlight === true ? 1 : 0) - (a.is_highlight === true ? 1 : 0)
    })

    jobs.value = sortedJobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    jobs.value = []
    console.error('Error fetching jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchFavorites = async (page = 0) => {
  const token = localStorage.getItem('token')

  // Exit function if no token is available
  if (!token) {
    return
  }

  // Configure headers with token
  const headers = { Authorization: `Bearer ${token}` }
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/favorite-job/favorite`, {
      params: { page, limit: pageSize.value },
      headers
    })
    jobs.value = response.data.jobs.map((job) => ({
      ...job,
      is_favorite: true
    }))
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching favorite jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const convertToJobFilterDTO = (criteria) => {
  return {
    keyword: criteria.keyword || '',
    company_name: '',

    cities: criteria.location ? [criteria.location] : [],
    districts: [],

    salary_min: criteria.salary?.min ?? null,
    salary_max: criteria.salary?.max ?? null,
    currency: criteria.currency ? [criteria.currency] : ['USD', 'VND'],

    types: criteria.type ? [criteria.type] : [],

    levels: criteria.level || [],
    experiences: criteria.experience ? [criteria.experience] : [],
    positions: [],
    categories: criteria.category ? [criteria.category] : [],
    skills: criteria.skills
  }
}

const fetchSearchData = async (page = 0, criteria = {}) => {
  isLoading.value = true
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')
    const jobFilterDTO = convertToJobFilterDTO(criteria)
    console.log('Job Filter DTO:', jobFilterDTO)
    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await axios.post(`${API_URL}/jobs/filter`, jobFilterDTO, {
      params: {
        page,
        limit: pageSize.value
      },
      headers
    })
    if (response.data && Array.isArray(response.data.jobs)) {
      const sortedJobs = [...response.data.jobs].sort((a, b) => {
        if (a.status === 'HOT' && b.status !== 'HOT') {
          return -1
        }
        if (b.status === 'HOT' && a.status !== 'HOT') {
          return 1
        }
        return 0
      })
      jobs.value = sortedJobs
    } else {
      jobs.value = []
    }
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    jobs.value = []
    console.error('Error fetching search jobs:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.searchCriteria,
  (newCriteria) => {
    currentPage.value = 0
    console.log('Search criteria changed:', newCriteria)
    fetchSearchData(currentPage.value, newCriteria)
  },
  { immediate: true, deep: true }
)

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    if (props.searchCriteria) {
      fetchSearchData(page, props.searchCriteria)
    } else {
      fetchData(page)
    }
    scrollToTop()
  }
}
onMounted(() => {
  fetchSearchData(currentPage.value, props.searchCriteria)
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <div
      class="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"
    ></div>
  </div>

  <div v-else>
    <div v-if="jobs.length === 0 && !isLoading" class="h-64">
      <img
        :src="icon_sad"
        alt="Empty Saved Jobs"
        class="mx-auto mb-4"
        style="width: 300px; height: auto"
      />
      <p class="text-2xl text-gray-500 text-center">No jobs available at the moment.</p>
    </div>

    <div v-else class="container">
      <h2 class="text-2xl font-semibold my-4">Job Opportunities You Can Explore</h2>
      <div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px] auto-rows-fr">
        <CardJob v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
        <div class="md:col-span-12 text-center">
          <nav aria-label="Page navigation example">
            <ul class="inline-flex items-center -space-x-px">
              <li>
                <a
                  href="#"
                  class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-l-full"
                  @click.prevent="changePage(currentPage - 1)"
                  :class="{ 'opacity-50 pointer-events-none': currentPage <= 0 }"
                >
                  <i class="pi pi-angle-left"></i>
                </a>
              </li>
              <li v-for="page in totalPages" :key="page">
                <a
                  href="#"
                  class="w-10 h-10 flex justify-center items-center"
                  @click.prevent="changePage(page - 1)"
                  :class="{ 'bg-emerald-600 text-white': currentPage === page - 1 }"
                >
                  {{ page }}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-r-full"
                  @click.prevent="changePage(currentPage + 1)"
                  :class="{ 'opacity-50 pointer-events-none': currentPage >= totalPages - 1 }"
                >
                  <i class="pi pi-angle-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
