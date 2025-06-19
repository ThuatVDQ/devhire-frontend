<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmailTemplatePopup from '@/components/EmailTemplatePopup.vue'
import ScoreTooltip from '@/components/ScoreTooltip.vue'
import { emailTemplates } from '@/data/emailTemplates.js'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const API_URL = import.meta.env.VITE_APP_API_URL

// Router
const router = useRouter()
const route = useRoute()

const tooltipVisible = ref(false)
const tooltipContent = ref('')
const tooltipPosition = ref({ x: 0, y: 0 })

const actionMenuVisibleData = ref(null)
const dropdownPortal = ref(null)
const actionMenuVisible = ref(false)

function openActionMenu(event, application) {
  if (actionMenuVisible.value) {
    actionMenuVisible.value = false
    return
  }
  actionMenuVisible.value = true
  const rect = event.currentTarget.getBoundingClientRect()
  actionMenuVisibleData.value = {
    top: rect.top + window.scrollY + 24,
    left: rect.left + window.scrollX - 130,
    application: application
  }
}

function closeActionMenu() {
  actionMenuVisibleData.value = null
  actionMenuVisible.value = false
}

const jobApplications = ref([])
const isLoading = ref(true)
const isSchedule = ref(false)
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
      `${API_URL}/job-application/send-email`,
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
    const response = await axios.get(`${API_URL}/job-application/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Job Applications:', response.data)
    jobApplications.value = response.data || []
    if (jobApplications.value.length > 0 && jobApplications.value[0].job_title) {
      title.value = jobApplications.value[0].job_title
      if (jobApplications.value[0].job_status === 'CLOSED') {
        isSchedule.value = true
      }
    }
  } catch (error) {
    toastr.error('Error fetching job applications:', error)
  } finally {
    isLoading.value = false
  }
}

async function fetchCVScore() {
  const jobId = route.params.id
  try {
    const response = await axios.get(`${API_URL}/job-application/${jobId}/scored`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Scored Data:', response.data)
    const scoredData = response.data

    scoredData.forEach((scoredItem) => {
      const target = jobApplications.value.find((app) => app.id === scoredItem.applicationId)
      if (target) {
        target.score = scoredItem.score
        target.matchedSkills = scoredItem.matchedSkills
      }
    })
  } catch (error) {
    toastr.error('Error fetching job applications:', error)
  } finally {
    isLoading.value = false
  }
}

const expandedApplicationId = ref(null)
const toggleSkills = (applicantId) => {
  if (expandedApplicationId.value === applicantId) {
    expandedApplicationId.value = null // Đóng nếu đang mở
  } else {
    expandedApplicationId.value = applicantId // Mở nếu đang đóng
  }
}

function handleAccept() {
  openEmailTemplatePopup(actionMenuVisibleData.value.application)
  closeActionMenu()
}

function handleReject() {
  updateApplicationStatus(actionMenuVisibleData.value.application.id, 'reject')
  closeActionMenu()
}

onMounted(() => {
  fetchJobApplications()
  fetchCVScore()
  console.log('Job ID:', jobApplications.value)
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

function handleDownloadCV() {
  const app = actionMenuVisibleData.value.application
  downloadCV(app.cv_id, app.full_name)
  fetchCVScore()
  closeActionMenu()
}

async function downloadCV(cvId, candidateName) {
  try {
    const response = await axios.get(`${API_URL}/cv/${cvId}/download`, {
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

function handleViewCV() {
  const app = actionMenuVisibleData.value.application
  viewCV(app.cv_url, app.id)
  fetchCVScore()
  closeActionMenu()
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
    await axios.post(`${API_URL}/job-application/${applicationId}/${newStatus}`, {})
    fetchJobApplications()
    fetchCVScore()
  } catch (error) {
    console.error('Error updating application status:', error)
  }
}

// Format date utility
function formatDate(dateArray) {
  const [year, month, day, hour, minute, second] = dateArray

  const date = new Date(year, month - 1, day, hour, minute, second)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const goToScheduleInterview = () => {
  router.push({ name: 'recruiter-interviews', query: { job: route.params.id } })
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

    <div :class="{ 'blur-sm pointer-events-none': isRequireBackEnd }" class="px-6 mx-auto py-6">
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
      <div v-else class="bg-white rounded-lg overflow-hidden">
        <div v-if="isSchedule" class="flex justify-end mb-4">
          <button
            @click="goToScheduleInterview"
            class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
          >
            <i class="pi pi-calendar-plus mr-2"></i> Schedule Interview
          </button>
        </div>
        <table class="min-w-full bg-white border-collapse">
          <!-- Header -->
          <thead class="bg-blue-100">
            <tr>
              <th class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/4">
                Candidate Name
              </th>
              <th class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/4">
                Contact Information
              </th>
              <th class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/4">
                Application Date
              </th>
              <th class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/6">
                Status
              </th>
              <th class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/6">
                Match Percentage
              </th>
              <th
                class="py-4 px-6 text-left text-sm font-medium text-gray-700 uppercase w-1/6"
              ></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="application in paginatedApplications" :key="application.id">
              <tr class="border-b hover:bg-gray-100">
                <td class="py-4 px-6 text-sm text-gray-700">
                  <div
                    @click="toggleSkills(application.id)"
                    class="cursor-pointer hover:text-blue-500 flex items-center"
                  >
                    <i
                      :class="
                        expandedApplicationId === application.id
                          ? 'pi pi-angle-down'
                          : 'pi pi-angle-right'
                      "
                      class="mr-2 text-blue-500"
                    ></i>
                    {{ application.full_name }}
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ application.email }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">
                  {{ formatDate(application.applyDate) }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ application.status }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">
                  <span class=""> {{ application.score?.toFixed(1) }} % </span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-700 text-right">
                  <button
                    @click="openActionMenu($event, application)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <i class="pi pi-ellipsis-v text-lg"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="expandedApplicationId === application.id" class="bg-gray-100">
                <td :colspan="6" class="px-6 py-3">
                  <div v-if="application.matchedSkills && application.matchedSkills.length">
                    <p class="text-sm font-semibold mb-2">Matched Skills:</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="skill in application.matchedSkills"
                        :key="skill"
                        class="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                  <p v-else class="text-gray-500 italic text-xs">No matched skills found.</p>
                </td>
              </tr>
              <tr v-if="paginatedApplications.length === 0">
                <td colspan="5" class="py-4 px-6 text-center text-gray-500">
                  No candidates found.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex justify-center mt-6">
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

    <!-- Dropdown Portal (Global in DOM) -->
    <div
      v-if="actionMenuVisible"
      ref="dropdownPortal"
      class="fixed bg-white border rounded-lg shadow-md w-70 z-50"
      :style="{
        top: actionMenuVisibleData?.top + 'px',
        left: actionMenuVisibleData?.left + 'px'
      }"
    >
      <ul class="list-none p-2">
        <li>
          <button
            @click="handleDownloadCV()"
            class="w-full text-left text-sm text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md mb-2"
          >
            <i class="pi pi-download mr-2"></i> Download CV
          </button>
        </li>
        <li>
          <button
            @click="handleViewCV()"
            class="w-full text-left text-sm text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md mb-2"
          >
            <i class="pi pi-eye mr-2"></i> View CV
          </button>
        </li>
        <li>
          <button
            @click="handleAccept()"
            :disabled="actionMenuVisibleData.application?.status !== 'SEEN'"
            class="w-full text-left text-sm text-white hover:bg-green-600 bg-green-500 px-4 py-2 rounded-md mb-2 disabled:opacity-50"
          >
            Accept
          </button>
        </li>
        <li>
          <button
            @click="handleReject()"
            :disabled="actionMenuVisibleData.application?.status !== 'SEEN'"
            class="w-full text-left text-sm text-white hover:bg-red-600 bg-red-500 px-4 py-2 rounded-md mb-2 disabled:opacity-50"
          >
            Reject
          </button>
        </li>
      </ul>
    </div>
  </div>

  <EmailTemplatePopup
    v-if="isEmailPopupVisible"
    :application="selectedApplication"
    @templateSelected="handleTemplateSelected"
    @close="closeEmailTemplatePopup"
  />

  <ScoreTooltip :visible="tooltipVisible" :content="tooltipContent" :position="tooltipPosition" />
</template>
