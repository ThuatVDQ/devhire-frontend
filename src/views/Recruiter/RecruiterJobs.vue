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
          <tr
            v-for="(job, index) in paginatedJobs"
            :key="job.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-4 px-6 text-sm text-gray-700">
              <div class="flex items-center">
                <label class="relative inline-flex items-center mr-4 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="job.isActive"
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
              {{ job.salaryStart }} - {{ job.salaryEnd }} {{ job.currency }}
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">
              <div class="flex items-center justify-start space-x-2">
                <span>{{ job.applyNumber }}</span>
                <div
                  class="flex items-center space-x-1 cursor-pointer"
                  @click="downloadCVs(job.id)"
                  :class="{ 'cursor-not-allowed opacity-50': job.applyNumber === 0 }"
                  :disabled="job.applyNumber === 0"
                  v-if="job.applyNumber > 0"
                >
                  <i class="pi pi-download text-gray-500 hover:text-gray-700"></i>
                  <span class="text-sm text-gray-500 hover:text-gray-700">Download CV</span>
                </div>

                <!-- Nếu applyNumber là 0, hiển thị chỉ báo không thể tải xuống -->
                <div v-else class="text-sm text-gray-400">No applications</div>
              </div>
            </td>
            <td class="py-4 px-6 text-sm text-gray-700">
              <div @click="goToEditJob(job.id)" class="cursor-pointer hover:text-blue-500">
                <i class="pi pi-pencil text-gray-500 hover:text-gray-700"></i>
              </div>
            </td>
          </tr>
          <!-- Empty state if no jobs exist -->
          <tr v-if="paginatedJobs.length === 0">
            <td colspan="5" class="py-4 px-6 text-center text-sm text-gray-500">No jobs found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-6">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="pi pi-angle-left"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex mx-2 space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          :class="[
            'px-3 py-2 rounded-full',
            currentPage === page ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          ]"
          class="px-4 py-2 text-gray-700 rounded hover:bg-gray-400"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="pi pi-angle-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const jobs = ref([]) // Store job data
const searchQuery = ref('') // Store search query
const currentFilter = ref('all') // Store selected filter
const currentPage = ref(1) // Current page
const itemsPerPage = ref(5) // Number of items per page

// Define filters (matching your provided image)
const filters = [
  { id: 'all', label: 'Tất cả', count: null },
  { id: 'top-jobs', label: 'Đang chạy Top Jobs', count: 0 },
  { id: 'displayed', label: 'Đang hiển thị', count: 5 },
  { id: 'pending', label: 'Đang xét duyệt', count: 14 },
  { id: 'rejected', label: 'Bị từ chối', count: 16 },
  { id: 'private', label: 'Không công khai', count: 51 },
  { id: 'expired', label: 'Hết hạn hiển thị', count: 75 },
  { id: 'stopped', label: 'Dừng hiển thị', count: 14 }
]

// Fetch all jobs posted by the recruiter
async function fetchJobs() {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (Array.isArray(response.data)) {
      jobs.value = response.data.map((job) => ({
        ...job,
        isActive: job.status === 'ACTIVE'
      }))
    } else {
      console.error('Expected an array but got:', typeof response.data)
    }
  } catch (e) {
    console.error('Failed to fetch jobs:', e)
  }
}

// Trigger the function on component mount
fetchJobs()

// Computed property to filter jobs based on search query and current filter
const filteredJobs = computed(() => {
  return jobs.value
    .filter((job) => {
      if (currentFilter.value === 'all') return true
      if (currentFilter.value === 'displayed') return job.status === 'ACTIVE'
      if (currentFilter.value === 'rejected') return job.status === 'REJECTED'
      if (currentFilter.value === 'pending') return job.status === 'PENDING'
      return true
    })
    .filter((job) => job.title)
})

// Computed property for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage.value)
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredJobs.value.slice(start, end)
})

// Methods for pagination
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function setPage(page) {
  currentPage.value = page
}

// Function to update the filter
function setFilter(filterId) {
  currentFilter.value = filterId
  currentPage.value = 1 // Reset to first page when changing filter
}

// Function to download CVs for a specific job
async function downloadCVs(jobId) {
  try {
    const response = await axios.get(`http://localhost:8000/recruiter/jobs/${jobId}/download-cvs`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `cvs_job_${jobId}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to download CVs:', e)
  }
}

function goToEditJob(jobId) {
  router.push(`/recruiter/edit-job/${jobId}`)
}

function goToJobDetail(jobId) {
  router.push(`/recruiter/job-detail/${jobId}`)
}
</script>
