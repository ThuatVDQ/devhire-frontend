<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Manage Jobs</h1>

    <!-- Filter Bar (above search bar) -->
    <div class="flex justify-start mb-4 space-x-2">
      <button
        v-for="filter in filters"
        :key="filter.id"
        @click="setFilter(filter.id)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium focus:outline-none',
          currentFilter === filter.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        ]"
      >
        {{ filter.label }}
        <span v-if="filter.count !== null" class="ml-2 text-xs">
          {{ filter.count }}
        </span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="flex justify-between mb-4">
      <div class="relative w-full max-w-sm">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by..."
          class="border rounded-lg p-2 pl-10 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Job Title
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Job Type
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Applications
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through paginated jobs and display each one -->
          <tr v-for="(job, index) in jobs" :key="job.id" class="border-b hover:bg-gray-100">
            <td class="py-4 px-6 text-sm text-gray-700">
              <div class="flex items-center">
                <label class="relative inline-flex items-center mr-4 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="job.status === 'OPEN'"
                    @change="toggleJobStatus(job.id, $event.target.checked)"
                    class="sr-only peer"
                  />
                  <div
                    class="w-8 h-4 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-500 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all"
                  ></div>
                </label>

                <!-- Job Title (Clickable) -->
                <div @click="goToJobDetail(job.id)" class="cursor-pointer hover:text-blue-500">
                  {{ job.title }}
                  <div class="text-xs text-gray-400">#{{ job.id }}</div>
                </div>
              </div>
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">
              {{ job.category ? job.category.name : '' }}
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">{{ job.type }}</td>
            <td class="py-4 px-6 text-sm text-gray-700">
              {{ job.salary_start }} - {{ job.salary_end }} {{ job.currency }}
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">
              <div class="flex items-center justify-start space-x-2">
                <span>{{ job.apply_number }}</span>
                <div
                  class="flex items-center space-x-1 cursor-pointer"
                  @click="downloadCVs(job.id, job.title)"
                  :class="{ 'cursor-not-allowed opacity-50': job.apply_number === 0 }"
                  :disabled="job.apply_number === 0"
                  v-if="job.apply_number > 0"
                >
                  <i class="pi pi-download text-gray-500 hover:text-gray-700"></i>
                  <span class="text-sm text-gray-500 hover:text-gray-700">Download CV</span>
                </div>

                <div v-else class="text-sm text-gray-400">No applications</div>
              </div>
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">
              <div @click="goToEditJob(job.id)" class="cursor-pointer hover:text-blue-500">
                <i class="pi pi-pencil text-gray-500 hover:text-gray-700"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
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
                :class="{
                  'bg-emerald-600 text-white': currentPage === page - 1,
                  'bg-white': currentPage !== page - 1
                }"
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const jobs = ref([]) // Store job data
const searchQuery = ref('') // Store search query
const currentFilter = ref('all') // Store selected filter
const currentPage = ref(0) // Current page
const totalPages = ref(0)
const pageSize = ref(10)

const filters = [
  { id: 'all', label: 'All', count: null },
  { id: 'displayed', label: 'Open', count: 5 },
  { id: 'pending', label: 'Pending Approval', count: 14 },
  { id: 'rejected', label: 'Rejected', count: 16 },
  { id: 'expired', label: 'Expired', count: 75 }
]

// Fetch all jobs posted by the recruiter
async function fetchJobs(page = 0) {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/company', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: { page: page, limit: pageSize.value }
    })
    console.log(response.data)
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (e) {
    console.error('Failed to fetch jobs:', e)
  }
}
fetchJobs()
// Filter jobs based on search query and current filter
const filteredJobs = computed(() => {
  return jobs.value
    .filter((job) => {
      if (currentFilter.value === 'all') return true
      if (currentFilter.value === 'displayed') return job.status === 'ACTIVE'
      if (currentFilter.value === 'rejected') return job.status === 'REJECTED'
      if (currentFilter.value === 'pending') return job.status === 'PENDING'
      return true
    })
    .filter((job) => job.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchJobs(page)
    scrollToTop()
  }
}

onMounted(() => {
  fetchJobs(currentPage.value)
})

function goToJobDetail(jobId) {
  router.push(`/recruiter/job-detail/${jobId}`)
}

function goToEditJob(jobId) {
  router.push(`/recruiter/edit-job/${jobId}`)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
