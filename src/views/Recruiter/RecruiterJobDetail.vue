<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

// Router
const router = useRouter()
const route = useRoute()

const jobApplications = ref([])
const isLoading = ref(true)

// Pagination settings
const currentPage = ref(1)
const itemsPerPage = ref(5)
const title = ref('Job Title')

async function fetchJobApplications() {
  const jobId = route.params.id
  try {
    const response = await axios.get(`http://localhost:8090/api/job-application/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobApplications.value = response.data || []
    if (jobApplications.value.length > 0 && jobApplications.value[0].job_title) {
      title.value = jobApplications.value[0].job_title
    }
  } catch (error) {
    toastr.error('Error fetching job applications:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchJobApplications()
})

const totalPages = computed(() => {
  return Math.ceil(jobApplications.value.length / itemsPerPage.value)
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return jobApplications.value.slice(start, end)
})

// Functions to handle page navigation
function setPage(page) {
  currentPage.value = page
}

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

async function downloadCV(cvId, candidateName) {
  try {
    const response = await axios.get(`http://localhost:8090/api/cv/${cvId}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    const contentDisposition = response.headers['content-disposition']
    console.log('contentDisposition:', contentDisposition)

    let fileName = ``
    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '')
    }
    const fileExtension = fileName.split('.').pop()
    fileName = `${title.value}_${candidateName}.${fileExtension}`
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // Xóa URL sau khi hoàn tất tải xuống để giải phóng bộ nhớ
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    toastr.error('Error downloading CV:', error)
  }
}

async function viewCV(cvId) {
  try {
    const response = await axios.get(`http://localhost:8090/api/cv/${cvId}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    // Tạo URL từ blob và mở trong tab mới
    const fileURL = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    )
    window.open(fileURL, '_blank')
  } catch (error) {
    toastr.error('Error viewing CV:', error)
  }
}

// Format date utility
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Back button functionality
function goBack() {
  router.back()
}
</script>

<template>
  <div class="container mx-auto py-6 px-30">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="px-4 py-2 mb-4 bg-gray-200 text-gray-900 rounded-lg flex items-center"
    >
      <i class="pi pi-arrow-left mr-2"></i>
      Back
    </button>
    <!-- Centered Title -->
    <h2 class="text-2xl font-bold text-gray-800 mb-12 text-center">
      <span> Candidates apply for </span>
      <span class="text-green-700">{{ title || 'Job Title' }}</span>
    </h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">Loading...</div>

    <!-- Applications Section -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white border-collapse">
        <thead class="bg-gray-400">
          <tr>
            <th class="py-4 px-8 text-left text-sm font-medium text-white uppercase">
              Candidate Name
            </th>
            <th class="py-4 px-8 text-left text-sm font-medium text-white uppercase">
              Application Date
            </th>
            <th class="py-4 px-8 text-left text-sm font-medium text-white uppercase">Status</th>
            <th class="py-4 px-8 text-left text-sm font-medium text-white uppercase"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(application, index) in paginatedApplications"
            :key="application.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-4 px-8 text-sm text-gray-700">{{ application.full_name }}</td>
            <td class="py-4 px-8 text-sm text-gray-700">{{ formatDate(application.applyDate) }}</td>
            <td class="py-4 px-8 text-sm text-gray-700">{{ application.status }}</td>
            <td class="py-4 px-8 text-sm text-gray-700">
              <div
                class="flex items-center space-x-1 cursor-pointer"
                @click="downloadCV(application.cv_id, application.full_name)"
              >
                <i class="pi pi-download text-gray-500 hover:text-gray-700"></i>
                <span class="text-sm text-gray-500 hover:text-gray-700">Download CV</span>
              </div>
              <div
                @click="viewCV(application.cv_id)"
                class="flex items-center space-x-1 cursor-pointer mt-2"
              >
                <i class="pi pi-eye text-gray-500 hover:text-gray-700"></i>
                <span class="text-sm text-gray-500 hover:text-gray-700">View CV</span>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedApplications.length === 0">
            <td colspan="4" class="py-4 px-6 text-center text-gray-500">No candidates found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-6">
      <!-- Previous Button -->
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        <i class="pi pi-angle-left"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex mx-2 space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          :class="[
            'pagination-button',
            currentPage === page ? 'pagination-active' : 'pagination-inactive'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        <i class="pi pi-angle-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}

/* Pagination Button Styles */
.pagination-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f1f1f1;
  color: #4a4a4a;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.pagination-button:hover {
  background-color: #e1e1e1;
}

.pagination-active {
  background-color: #22c55e;
  color: white;
}

.pagination-inactive {
  background-color: #f1f1f1;
}

h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

th,
td {
  padding: 1rem; /* Increased padding for better readability */
  font-size: 1rem; /* Larger font size */
}
</style>
