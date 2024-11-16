<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import CardJob from './CardJob.vue'
import axios from 'axios'

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

    const response = await axios.get('http://localhost:8090/api/jobs', {
      params: { page, limit: pageSize.value },
      headers
    })

    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
    console.log(jobs.value)
  } catch (error) {
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
    const response = await axios.get('http://localhost:8090/api/favorite-job/favorite', {
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

const fetchSearchData = async (page = 0, criteria = {}) => {
  isLoading.value = true
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')

    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await axios.get('http://localhost:8090/api/jobs/search', {
      params: {
        page,
        limit: pageSize.value,
        keyword: criteria.keyword,
        location: criteria.location,
        jobType: criteria.type
      },
      headers
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching search jobs:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.searchCriteria,
  (newCriteria) => {
    currentPage.value = 0
    fetchSearchData(currentPage.value, newCriteria)
  },
  { immediate: true }
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
  fetchData(currentPage.value)
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
    <div v-if="jobs.length === 0 && !isLoading" class="flex justify-center items-center h-64">
      <p class="text-2xl text-gray-500">No jobs available at the moment.</p>
    </div>

    <div v-else class="container">
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
