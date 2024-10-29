<script setup>
import { ref, onMounted } from 'vue'
import CardJob from './CardJob.vue'
import axios from 'axios'

const jobs = ref([])
const currentPage = ref(0)
const pageSize = ref(5) // số lượng công việc trên mỗi trang
const totalPages = ref(0)
const isLoading = ref(true)

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:8090/api/jobs', {
      params: { page, limit: pageSize.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchData(page)
    scrollToTop()
  }
}

onMounted(() => {
  fetchData(currentPage.value)
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
  })
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
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
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white rounded-s-3xl"
                @click.prevent="changePage(currentPage - 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage <= 0 }"
              >
                <i class="pi pi-angle-left"></i>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page">
              <a
                href="#"
                class="size-[40px] inline-flex justify-center items-center"
                @click.prevent="changePage(page - 1)"
                :class="{ 'bg-emerald-600 text-white': currentPage === page - 1 }"
              >
                {{ page }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white rounded-e-3xl"
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
</template>
