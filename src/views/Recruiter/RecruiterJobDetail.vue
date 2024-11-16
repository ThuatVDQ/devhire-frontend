<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmailTemplatePopup from '@/components/EmailTemplatePopup.vue'
import { emailTemplates } from '@/data/emailTemplates.js'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

// Router
const router = useRouter()
const route = useRoute()

const jobApplications = ref([])
const isLoading = ref(true)
const isRequireBackEnd = ref(false)

// Pagination settings
const currentPage = ref(1)
const itemsPerPage = ref(5)
const title = ref('Job Title')

const isEmailPopupVisible = ref(false)
const selectedApplication = ref(null)

function openEmailTemplatePopup(application) {
  selectedApplication.value = application
  isEmailPopupVisible.value = true
}

function closeEmailTemplatePopup() {
  isEmailPopupVisible.value = false
}

async function handleTemplateSelected({ subject, body }) {
  try {
    await updateApplicationStatus(selectedApplication.value.id, 'accept')

    await sendEmail(selectedApplication.value, subject, body)
  } catch (error) {
    toastr.error('Failed to accept application or send email. Please try again.')
    console.error(error)
  } finally {
    closeEmailTemplatePopup()
  }
}

async function sendEmail(application, subject, body) {
  isRequireBackEnd.value = true
  try {
    const formattedBody = body.replace(/\n/g, '<br>')
    const response = await axios.post(
      'http://localhost:8090/api/job-application/send-email',
      {
        name: application.full_name,
        subject: subject,
        email: application.email,
        content: formattedBody
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    toastr.success(response.data, 'Success')
  } catch (error) {
    toastr.error('Failed to send email:', error)
    console.error('Failed to send email:', error)
  } finally {
    isRequireBackEnd.value = false
  }
}

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

    updateApplicationStatus(cvId, 'seen')
  } catch (error) {
    toastr.error('Error downloading CV:', error)
  }
}

async function viewCV(cv_url, id) {
  if (!cv_url) {
    toastr.error('No CV available for this candidate')
    return
  }
  const baseUrl = 'http://localhost:8090/uploads/' // Change this base URL as needed
  const fullUrl = `${baseUrl}${cv_url}`
  window.open(fullUrl, '_blank')
  updateApplicationStatus(id, 'seen')
}

async function updateApplicationStatus(applicationId, newStatus) {
  try {
    await axios.post(`http://localhost:8090/api/job-application/${applicationId}/${newStatus}`, {})
    fetchJobApplications()
  } catch (error) {
    console.error('Error updating application status:', error)
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
  <div class="relative">
    <div
      v-if="isRequireBackEnd"
      class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
    >
      <!-- Spinner sử dụng Tailwind -->
      <div
        class="w-12 h-12 border-4 border-t-emerald-600 border-gray-300 rounded-full animate-spin"
      ></div>
      <p class="text-white text-lg">Please waiting ...</p>
    </div>

    <div
      :class="{ 'blur-sm pointer-events-none': isRequireBackEnd }"
      class="container mx-auto py-6 px-30"
    >
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
        <span class="text-green-700 text-xl text-center mb-8">{{ title || 'Job Title' }}</span>
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
              <td class="py-4 px-8 text-sm text-gray-700">
                {{ formatDate(application.applyDate) }}
              </td>
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
                  @click="viewCV(application.cv_url, application.id)"
                  class="flex items-center space-x-1 cursor-pointer mt-2"
                >
                  <i class="pi pi-eye text-gray-500 hover:text-gray-700"></i>
                  <span class="text-sm text-gray-500 hover:text-gray-700">View CV</span>
                </div>
              </td>
              <td class="py-4 px-8 text-sm text-gray-700">
                <button
                  @click="openEmailTemplatePopup(application)"
                  :disabled="application.status !== 'SEEN'"
                  :class="{
                    'bg-gray-300': application.status !== 'SEEN',
                    'bg-green-600 ': application.status === 'SEEN'
                  }"
                  class="px-4 py-2 mr-2 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  @click="updateApplicationStatus(application.id, 'reject')"
                  :disabled="application.status !== 'SEEN'"
                  :class="{
                    'bg-gray-300 ': application.status !== 'SEEN',
                    'bg-red-600 ': application.status === 'SEEN'
                  }"
                  class="px-4 py-2 text-white rounded-lg"
                >
                  Reject
                </button>
              </td>
            </tr>
            <tr v-if="paginatedApplications.length === 0">
              <td colspan="5" class="py-4 px-6 text-center text-gray-500">No candidates found.</td>
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
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
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
              'w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200',
              currentPage === page
                ? 'w-10 h-10 rounded-full border-none bg-green-500 text-white text-base flex items-center justify-center'
                : 'w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next Button -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
        >
          <i class="pi pi-angle-right"></i>
        </button>
      </div>
    </div>
  </div>
  <EmailTemplatePopup
    v-if="isEmailPopupVisible"
    :application="selectedApplication"
    @templateSelected="handleTemplateSelected"
    @close="closeEmailTemplatePopup"
  />
</template>
