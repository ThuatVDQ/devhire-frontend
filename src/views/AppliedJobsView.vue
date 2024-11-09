<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import CardJob from '@/components/CardJob.vue'
import icon_sad from '@/assets/icon-sad.png'

const jobs = ref([])
const currentPage = ref(0)
const pageSize = ref(8) // số lượng công việc trên mỗi trang
const totalPages = ref(0)
const isLoading = ref(true)

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/applied', {
      params: { page, limit: pageSize.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching favorite jobs:', error)
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
    behavior: 'smooth'
  })
}
</script>
<template>
  <div class="container py-24">
    <div class="bg-gradient-to-r from-green-500 to-green-700 rounded-t-lg p-6 text-white">
      <h2 class="text-2xl font-bold">Applied Jobs</h2>
      <p class="mt-2">
        Review the list of jobs you've applied for before. Apply now so you don't miss out on career
        opportunities tailored for you.
      </p>
    </div>

    <div v-if="jobs.length === 0 && !isLoading">
      <div class="bg-white rounded-b-lg p-8 text-center">
        <img
          :src="icon_sad"
          alt="Empty Saved Jobs"
          class="mx-auto mb-4"
          style="width: 300px; height: auto"
        />
        <p class="text-gray-700">You haven't favorite any jobs!</p>
        <RouterLink
          to="/jobs"
          class="mt-4 bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition inline-block"
        >
          Find Jobs Now
        </RouterLink>
      </div>
    </div>

    <div v-else class="bg-gray-200 rounded-b-lg">
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
  </div>
</template>
