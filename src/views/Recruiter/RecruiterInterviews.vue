<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10">Interview Management</h1>
  </header>
  <div class="p-8 bg-gray-50 min-h-screen space-y-8">
    <!-- Tiêu đề và breadcrumb -->

    <!-- Lịch phỏng vấn -->
    <div class="bg-white shadow-2xl rounded-xl p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Interview Schedule</h2>
      <VueCal
        class="custom-vuecal"
        :events="events"
        default-view="week"
        :disable-views="['years', 'year', 'day']"
        time="24"
        locale="en"
        :min-time="minTime"
        :max-time="maxTime"
        style="height: 800px"
        @event-click="handleClick"
      />
    </div>

    <div class="bg-white shadow-2xl rounded-xl p-6">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Interview Schedule Results</h2>
      <div class="mb-4 flex space-x-4">
        <button
          @click="filterResults('ALL')"
          :class="{
            'bg-purple-700 text-white': currentFilter === 'ALL',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': currentFilter !== 'ALL'
          }"
          class="px-4 py-2 rounded-2xl text-sm transition duration-200"
        >
          All
        </button>
        <button
          @click="filterResults('WAITING')"
          :class="{
            'bg-yellow-500 text-white': currentFilter === 'WAITING',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': currentFilter !== 'WAITING'
          }"
          class="px-4 py-2 rounded-2xl font-medium transition duration-200"
        >
          Waiting
        </button>
        <button
          @click="filterResults('PASS')"
          :class="{
            'bg-green-500 text-white': currentFilter === 'PASS',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': currentFilter !== 'PASS'
          }"
          class="px-4 py-2 rounded-2xl font-medium transition duration-200"
        >
          Pass
        </button>
        <button
          @click="filterResults('FAIL')"
          :class="{
            'bg-red-500 text-white': currentFilter === 'FAIL',
            'bg-gray-200 text-gray-700 hover:bg-gray-300': currentFilter !== 'FAIL'
          }"
          class="px-4 py-2 rounded-2xl font-medium transition duration-200"
        >
          Fail
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-purple-700 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium">#</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Job Title</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Applicant Name</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Applicant Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Result</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(interview, index) in interviewSchedulesResult" :key="interview.id">
              <tr class="hover:bg-gray-50 transition duration-300">
                <td class="px-6 py-4 text-sm text-gray-800">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                  {{ interview.job_title }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ interview.candidate_name }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ interview.candidate_email }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ interview.result }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <div v-if="interview.result === 'WAITING'">
                    <button
                      @click="openResultPopup(interview.id, 'PASS')"
                      class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    >
                      Pass
                    </button>
                    <button
                      @click="openResultPopup(interview.id, 'FAIL')"
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Fail
                    </button>
                  </div>
                  <div v-else-if="interview.email_sent">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 italic"
                    >
                      Email Sent
                    </span>
                  </div>
                  <div v-else-if="interview.result === 'PASS' && !interview.email_sent">
                    <button
                      @click="openEmailPopup(interview)"
                      class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Send Email
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!interviewSchedulesResult || interviewSchedulesResult.length === 0">
              <td colspan="8" class="px-6 py-4 text-sm text-gray-500 text-center italic">
                No interview results found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6">
        <button
          @click="prevPage"
          :disabled="pagination.currentPage === 0"
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
        >
          <i class="pi pi-angle-left"></i>
        </button>

        <div class="flex mx-2 space-x-2">
          <button
            v-for="pageNumber in pagination.totalPages"
            :key="pageNumber"
            @click="setPage(pageNumber - 1)"
            :class="[
              'w-10 h-10 rounded-full border-none text-base flex items-center justify-center transition-colors duration-300',
              pagination.currentPage === pageNumber - 1
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ pageNumber }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="pagination.currentPage === pagination.totalPages - 1"
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
        >
          <i class="pi pi-angle-right"></i>
        </button>
      </div>
    </div>

    <!-- Danh sách tin tuyển dụng -->
    <div class="bg-white shadow-2xl rounded-xl p-6" ref="jobsTableRef">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">List Jobs</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-emerald-600 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium">#</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Category</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Type</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Applications</th>
              <th class="px-6 py-3 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(job, index) in jobs" :key="job.id">
              <!-- Dòng job -->
              <tr
                class="hover:bg-gray-50 transition duration-300 cursor-pointer"
                @click="toggleApplicants(job.id)"
                :data-job-id="job.id"
              >
                <td class="px-6 py-4 text-sm text-gray-800">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{ job.title }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ job.category?.name }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ job.type }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ job.apply_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ job.status }}</td>
              </tr>

              <!-- Dòng mở rộng hiển thị ứng viên -->
              <tr v-if="expandedJobId === job.id">
                <td colspan="6" class="bg-gray-50 px-6 py-4">
                  <div v-if="applicants[job.id] && applicants[job.id].length > 0">
                    <table class="min-w-full divide-y divide-gray-300 mt-2">
                      <thead class="bg-indigo-100">
                        <tr>
                          <th class="px-4 py-2 text-sm font-medium text-gray-700">
                            <input
                              type="checkbox"
                              :checked="areAllApplicantsSelected(job.id)"
                              @change="toggleAll(job.id, $event)"
                            />
                          </th>
                          <th class="px-4 py-2 text-sm font-medium text-gray-700 text-left">
                            Name
                          </th>
                          <th class="px-4 py-2 text-sm font-medium text-gray-700 text-left">
                            Email
                          </th>
                          <th class="px-4 py-2 text-sm font-medium text-gray-700 text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(applicant, i) in applicants[job.id]"
                          :key="applicant.id"
                          class="hover:bg-gray-100"
                        >
                          <td class="px-4 py-2 text-sm text-center">
                            <input
                              type="checkbox"
                              :value="applicant.id"
                              v-model="selectedApplicants[job.id]"
                            />
                          </td>
                          <td class="px-4 py-2 text-sm">{{ applicant.full_name }}</td>
                          <td class="px-4 py-2 text-sm">{{ applicant.email }}</td>
                          <td class="px-4 py-2 text-sm">
                            <div>
                              <span
                                v-if="applicant.is_scheduled"
                                class="text-green-600 text-xs font-semibold"
                              >
                                Already Scheduled
                              </span>

                              <button
                                v-else
                                class="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                                @click="openInterviewPopup(applicant)"
                              >
                                Schedule Interview
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else class="text-sm text-gray-500 italic">No applicants found.</div>
                  <div v-if="selectedApplicants[job.id]?.length" class="mt-2 text-right">
                    <button
                      class="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
                      @click="openInterviewPopupMultiple(job.id)"
                    >
                      Schedule
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="flex justify-center mt-6">
        <button
          @click="prevPageJobs"
          :disabled="currentPage === 0"
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
        >
          <i class="pi pi-angle-left"></i>
        </button>

        <div class="flex mx-2 space-x-2">
          <button
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            @click="setPageJobs(pageNumber - 1)"
            :class="[
              'w-10 h-10 rounded-full border-none text-base flex items-center justify-center transition-colors duration-300',
              currentPage === pageNumber - 1
                ? 'bg-blue-500 text-white' // Màu xanh dương cho trang hiện tại
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ pageNumber }}
          </button>
        </div>

        <button
          @click="nextPageJobs"
          :disabled="currentPage === totalPages - 1"
          class="w-10 h-10 rounded-full border-none bg-gray-100 text-gray-600 text-base flex items-center justify-center transition-colors duration-300 hover:bg-gray-200"
        >
          <i class="pi pi-angle-right"></i>
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="selectedEvent"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative transform transition-all scale-95 hover:scale-100 duration-300 ease-out"
    >
      <!-- Title with elegance -->
      <h2
        class="text-3xl font-semibold mb-6 text-white bg-gradient-to-r bg-blue-500 p-8 rounded-lg"
      >
        {{ selectedEvent.title }}
      </h2>

      <div class="grid gap-4 px-8">
        <!-- Location -->
        <div class="grid grid-cols-[140px_1fr] text-lg text-gray-800">
          <span class="font-medium">Location:</span>
          <span class="text-gray-700">{{ selectedEvent.location }}</span>
        </div>

        <!-- Full name -->
        <div class="grid grid-cols-[140px_1fr] text-lg text-gray-800">
          <span class="font-medium">Full name:</span>
          <span class="text-gray-700">{{ selectedEvent.content }}</span>
        </div>

        <!-- Start time -->
        <div class="grid grid-cols-[140px_1fr] text-lg text-gray-800">
          <span class="font-medium">Start:</span>
          <span class="text-gray-700">{{ formatDateTime(selectedEvent.start) }}</span>
        </div>

        <!-- End time -->
        <div class="grid grid-cols-[140px_1fr] text-lg text-gray-800">
          <span class="font-medium">End:</span>
          <span class="text-gray-700">{{ formatDateTime(selectedEvent.end) }}</span>
        </div>

        <!-- Note -->
        <div class="grid grid-cols-[140px_1fr] text-lg text-gray-800">
          <span class="font-medium">Note:</span>
          <span class="text-gray-700">{{ selectedEvent.note }}</span>
        </div>
      </div>

      <!-- Close button with smooth hover -->
      <div class="flex justify-end mt-6 px-8 pb-4">
        <button
          class="bg-gradient-to-r bg-yellow-400 mr-4 text-white font-semibold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
          @click="editEvent(selectedEvent)"
        >
          Edit
        </button>
        <button
          class="bg-gradient-to-r bg-gray-600 text-white font-semibold py-2 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          @click="selectedEvent = null"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  <CreateInterviewSchedulePopup
    :isVisible="showPopup"
    :interviewDetails="interviewDetails"
    @confirm="onConfirm"
    @cancel="closeDialog"
    @edit="onEdit"
  />

  <div
    v-if="showEmailPopup"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-2xl w-1/2 mx-auto transform transition-all duration-300 scale-100 opacity-100"
    >
      <h3 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Send Pass Email</h3>
      <div class="mb-4">
        <label for="emailSubject" class="block text-gray-700 text-sm font-bold mb-2"
          >Subject:</label
        >
        <input
          type="text"
          id="emailSubject"
          v-model="emailSubject"
          class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter email subject"
        />
      </div>
      <div class="mb-4">
        <label for="emailBody" class="block text-gray-700 text-sm font-bold mb-2">Body:</label>
        <textarea
          id="emailBody"
          v-model="emailBody"
          rows="8"
          class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter email body"
        ></textarea>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="closeEmailPopup"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
        <button
          @click="submitEmailSend"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Send Email
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-[9999]"
  >
    <div
      class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
    ></div>
    <p class="text-white text-lg">Please waiting ...</p>
  </div>

  <div
    v-if="showResultPopup"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-96">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Update Interview Result</h3>
      <div class="mb-4">
        <label for="resultSelect" class="block text-gray-700 text-sm font-bold mb-2">Result:</label>
        <select
          id="resultSelect"
          v-model="popupResult"
          disabled
          class="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="recruiterNote" class="block text-gray-700 text-sm font-bold mb-2"
          >Recruiter Note:</label
        >
        <textarea
          id="recruiterNote"
          v-model="popupRecruiterNote"
          rows="4"
          class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter recruiter notes here..."
        ></textarea>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="closeResultPopup"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
        <button
          @click="submitResultUpdate"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import toastr, { error } from 'toastr'
import 'toastr/build/toastr.min.css'
import CreateInterviewSchedulePopup from '@/components/CreateInterviewSchedulePopup.vue'

const API_URL = import.meta.env.VITE_APP_API_URL

const route = useRoute()
const jobsTableRef = ref(null)
const isLoading = ref(false)

const jobs = ref([]) // Store job data
const currentPage = ref(0) // Current page
const totalPages = ref(0)
const pageSize = ref(10)

const selectedApplicants = ref({})
const selectedApplicant = ref(null)

const selectedEvent = ref(null)

const handleClick = (event) => {
  selectedEvent.value = event
}

const formatDateTime = (dt) => {
  const d = new Date(dt)
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Hàm chọn tất cả ứng viên trong một job
const toggleAll = (jobId, event) => {
  const isChecked = event.target.checked
  const list = applicants.value[jobId] || []

  if (!selectedApplicants.value[jobId]) {
    selectedApplicants.value[jobId] = []
  }

  selectedApplicants.value[jobId] = isChecked ? list.map((applicant) => applicant.id) : []
}

const areAllApplicantsSelected = computed(() => (jobId) => {
  const jobApplicants = applicants.value[jobId]
  const selectedIds = selectedApplicants.value[jobId]

  if (!jobApplicants || jobApplicants.length === 0) {
    return false // Không có ứng viên hoặc chưa tải, coi như không chọn tất cả
  }
  if (!selectedIds || selectedIds.length === 0) {
    return false // Không có ứng viên nào được chọn
  }

  // Kiểm tra xem tất cả các ID ứng viên có trong mảng selectedIds hay không
  return jobApplicants.every((applicant) => selectedIds.includes(applicant.id))
})

const showPopup = ref(false)
const interviewDetails = ref({
  interview_time: '',
  duration_minutes: 30,
  location: '',
  note: '',
  message: ''
})

function editEvent(event) {
  interviewDetails.value.interview_time = event.start
  interviewDetails.value.duration_minutes = event.duration_minutes
  interviewDetails.value.location = event.location
  interviewDetails.value.note = event.note
  interviewDetails.value.message = 'edit'
  interviewDetails.value.id = event.id
  selectedEvent.value = null
  showPopup.value = true
}

function openInterviewPopup(applicant) {
  selectedApplicant.value = applicant
  showPopup.value = true
}

function closeDialog() {
  showPopup.value = false
  selectedApplicant.value = null
  interviewDetails.value = {
    interview_time: '',
    duration_minutes: 30,
    location: '',
    note: '',
    message: ''
  }

  fetchInterviewSchedules()
  fetchJobs(currentPage.value)
}

const openInterviewPopupMultiple = (jobId) => {
  const selected = selectedApplicants.value[jobId] || []

  if (!selected.length) return

  selectedApplicant.value = {
    applicants: selected
  }
  interviewDetails.value.message = 'createMultiple'
  showPopup.value = true
}

function formatDateTimeToLocal(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

function onConfirm(data) {
  if (!data.interview_time) {
    toastr.error('Please select an interview time!')
    return
  }
  if (!data.duration_minutes || isNaN(data.duration_minutes) || data.duration_minutes <= 0) {
    toastr.error('Please enter a valid duration in minutes!')
    return
  }
  if (!data.location) {
    toastr.error('Please enter a location for the interview!')
    return
  }
  isLoading.value = true
  const payload = {
    interview_time:
      typeof data.interview_time === 'string'
        ? data.interview_time.replace(' ', 'T')
        : formatDateTimeToLocal(data.interview_time),

    duration_minutes: Number(data.duration_minutes),
    location: String(data.location || '').trim(),
    note: String(data.note || '').trim()
  }
  if (data.message === 'createMultiple') {
    const ids = selectedApplicant.value.applicants
    if (ids.length === 0) {
      toastr.error('No applicants selected!')
      return
    }
    payload.job_application_ids = ids
    axios
      .post(`${API_URL}/interview-schedules/create-bulk`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        toastr.success('Interview schedules created successfully!')
        closeDialog()
        fetchInterviewSchedules()
        fetchInterviewSchedulesResult()
      })
      .catch((error) => {
        toastr.error('An error occurred while creating bulk interview schedules!')
        console.error('Error:', error)
      })
      .finally(() => {
        isLoading.value = false
      })
  } else {
    payload.job_application_id = selectedApplicant.value.id
    axios
      .post(`${API_URL}/interview-schedules/create`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        toastr.success('Interview schedule created successfully!')
        closeDialog()
        fetchInterviewSchedules()
        fetchInterviewSchedulesResult()
      })
      .catch((error) => {
        toastr.error('An error occurred while creating the interview schedule!')
        console.error('Error:', error)
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

function onEdit(data) {
  isLoading.value = true
  const payload = {
    interview_time:
      typeof data.interview_time === 'string'
        ? data.interview_time.replace(' ', 'T')
        : formatDateTimeToLocal(data.interview_time),

    duration_minutes: Number(data.duration_minutes),
    location: String(data.location || '').trim(),
    note: String(data.note || '').trim()
  }

  axios
    .post(`${API_URL}/interview-schedules/${data.id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      toastr.success('Interview schedule updated successfully!')
      fetchInterviewSchedules()
      closeDialog()
    })
    .catch((error) => {
      toastr.error('An error occurred while updating the interview schedule!')
      console.error('Error updating interview schedule:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

async function fetchJobs(page = 0) {
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      status: 'CLOSED'
    }

    const response = await axios.get(`${API_URL}/jobs/company`, {
      params: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobs.value = response.data.jobs
    currentPage.value = response.data.currentPage || 0
    totalPages.value = response.data.totalPages || 0
    pageSize.value = response.data.pageSize || 1
  } catch (e) {
    jobs.value = []
    console.error('Failed to fetch jobs:', e)
  }
}

const prevPageJobs = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchJobs() // Fetch data for the new page
  }
}

// Function to go to the next page
const nextPageJobs = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchJobs()
  }
}

// Function to set a specific page
const setPageJobs = (pageNumber) => {
  // pageNumber is already 0-based index from template
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    currentPage.value = pageNumber
    fetchJobs() // Fetch data for the new page
  }
}

const expandedJobId = ref(null)
const applicants = ref({}) // lưu danh sách ứng viên theo jobId

const toggleApplicants = async (jobId) => {
  if (expandedJobId.value === jobId) {
    expandedJobId.value = null
  } else {
    expandedJobId.value = jobId
    if (!applicants.value[jobId]) {
      try {
        const res = await axios.get(`${API_URL}/job-application/${jobId}`, {
          params: {
            status: 'ACCEPTED'
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        applicants.value[jobId] = res.data
      } catch (err) {
        console.error('Error loading applicants:', err)
        applicants.value[jobId] = []
      }
    }
  }
}

const scrollToJobAndExpand = async (jobId) => {
  if (!jobId) {
    return
  }

  // Đảm bảo jobs đã được tải trước khi tìm kiếm
  if (jobs.value.length === 0) {
    await fetchJobs(currentPage.value)
  }

  const jobToFind = jobs.value.find((job) => String(job.id) === String(jobId))
  if (!jobToFind) {
    return
  }
  await toggleApplicants(jobId)

  if (jobsTableRef.value) {
    jobsTableRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })

    await nextTick()
    const jobRow = document.querySelector(`tr[data-job-id="${jobId}"]`)
    if (jobRow) {
      jobRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
    }
  } else {
  }
}

const events = ref([])

const fetchInterviewSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/interview-schedules`, {
      params: {
        page: 0,
        size: 10
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const rawData = response.data.content || []

    events.value = rawData.map((item) => {
      const [year, month, day, hour, minute] = item.interview_time

      const startDate = new Date(year, month - 1, day, hour, minute)
      const endDate = new Date(startDate.getTime() + item.duration_minutes * 60 * 1000)

      const formatDateTime = (date) => {
        const yyyy = date.getFullYear()
        const MM = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        const HH = String(date.getHours()).padStart(2, '0')
        const mm = String(date.getMinutes()).padStart(2, '0')
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}`
      }

      return {
        start: formatDateTime(startDate),
        end: formatDateTime(endDate),
        title: `${item.job_title}`,
        content: `${item.candidate_name}`,
        location: item.location,
        note: item.note,
        duration_minutes: item.duration_minutes,
        id: item.id
      }
    })
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  }
}

const parseHour = (datetime) => new Date(datetime).getHours()

const minTime = computed(() => {
  const hours = events.value.map((e) => parseHour(e.start))
  return `${Math.min(...hours)}:00`
})

const maxTime = computed(() => {
  const hours = events.value.map((e) => parseHour(e.end))
  return `${Math.max(...hours) + 1}:00`
})

onMounted(async () => {
  await fetchJobs(currentPage.value)
  await fetchInterviewSchedules()
  await fetchInterviewSchedulesResult()

  if (route.query.job) {
    await nextTick()
    await scrollToJobAndExpand(route.query.job)
  }
})

watch(
  applicants,
  (newApplicants) => {
    for (const jobId in newApplicants) {
      if (!selectedApplicants.value[jobId]) {
        selectedApplicants.value[jobId] = []
      }
    }
  },
  { deep: true }
)

watch(
  () => route.query.job,
  async (newJobId, oldJobId) => {
    if (newJobId && newJobId !== oldJobId) {
      await nextTick()
      scrollToJobAndExpand(newJobId)
    }
  }
)

const interviewSchedulesResult = ref([])
const pagination = ref({
  currentPage: 0,
  pageSize: 10, // Default page size, adjust as needed
  totalElements: 0,
  totalPages: 0
})
const currentFilter = ref('ALL')
const fetchInterviewSchedulesResult = async () => {
  try {
    const statusParam = currentFilter.value === 'ALL' ? '' : currentFilter.value

    const response = await axios.get(`${API_URL}/interview-schedules/result`, {
      params: {
        status: statusParam,
        page: pagination.value.currentPage, // Send current page
        size: pagination.value.pageSize
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    interviewSchedulesResult.value = response.data.content || response.data || []

    // Update pagination data
    pagination.value.currentPage = response.data.currentPage || 0
    pagination.value.pageSize = response.data.pageSize || pagination.value.pageSize
    pagination.value.totalElements = response.data.totalElements || 0
    pagination.value.totalPages = response.data.totalPages || 0
  } catch (e) {
    console.error('Failed to fetch jobs:', e)
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 0) {
    pagination.value.currentPage--
    fetchInterviewSchedulesResult()
  }
}

// Function để chuyển đến trang tiếp theo
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages - 1) {
    pagination.value.currentPage++
    fetchInterviewSchedulesResult()
  }
}

// Function để đặt trang cụ thể
const setPage = (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < pagination.value.totalPages) {
    pagination.value.currentPage = pageNumber
    fetchInterviewSchedulesResult()
  }
}

const filterResults = (status) => {
  currentFilter.value = status
  fetchInterviewSchedulesResult()
}

const showResultPopup = ref(false)
const currentInterviewId = ref(null)
const popupRecruiterNote = ref('')
const popupResult = ref('PASS')

const openResultPopup = (id, defaultResult) => {
  currentInterviewId.value = id
  popupResult.value = defaultResult // Đặt giá trị mặc định cho select
  popupRecruiterNote.value = '' // Xóa ghi chú cũ
  showResultPopup.value = true
}

const closeResultPopup = () => {
  showResultPopup.value = false
  currentInterviewId.value = null
  popupRecruiterNote.value = ''
  popupResult.value = 'PASS'
}

const submitResultUpdate = async () => {
  if (!currentInterviewId.value) {
    console.error('No interview ID selected for update.')
    return
  }

  try {
    const dto = {
      result: popupResult.value,
      recruiter_note: popupRecruiterNote.value
    }

    await axios.put(`${API_URL}/interview-schedules/${currentInterviewId.value}/result`, dto, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    closeResultPopup()
    fetchInterviewSchedulesResult()
  } catch (e) {
    console.error(`Failed to update interview ${currentInterviewId.value}:`, e)
  }
}

// Biến trạng thái cho popup gửi email
const showEmailPopup = ref(false)
const emailSubject = ref('')
const emailBody = ref('')
const selectedInterview = ref(null)

const openEmailPopup = (interview) => {
  selectedInterview.value = interview
  emailSubject.value = 'Congratulations! Your Interview Result'
  emailBody.value = `Dear ${interview.candidate_name},

Congratulations on successfully passing your interview at [Company Name] for the ${interview.job_title} position. We were very impressed with your knowledge and experience during the interview process.

We believe you'll be a fantastic addition to our team. We'll be in touch with you shortly to discuss the next steps, including a job offer and detailed information about our onboarding process.

In the meantime, if you have any questions, please don't hesitate to reach out to us.

Sincerely,

The Recruitment Team
[Company Name]` // Body mặc định
  showEmailPopup.value = true
}

const submitEmailSend = async () => {
  if (!selectedInterview.value.id || !emailSubject.value || !emailBody.value) {
    toastr.error('Please fill in both Subject and Body for the email.')
    return
  }
  isLoading.value = true

  const formattedBody = emailBody.value.replace(/\n/g, '<br>')

  try {
    const emailDto = {
      name: selectedInterview.value.candidate_name,
      email: selectedInterview.value.candidate_email,
      subject: emailSubject.value,
      content: formattedBody
    }

    await axios.post(
      `${API_URL}/interview-schedules/${selectedInterview.value.id}/send-email`,
      emailDto,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
    toastr.success('Email sent successfully!')
    closeEmailPopup()
    fetchInterviewSchedulesResult()
  } catch (e) {
    console.error(`Failed to send email for interview :`, e)
    toastr.error(e.response?.data || 'Failed to send email. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

const closeEmailPopup = () => {
  showEmailPopup.value = false
  currentInterviewId.value = null
  emailSubject.value = ''
  emailBody.value = ''
}
</script>

<style scoped>
::v-deep(.custom-vuecal .vuecal__header) {
  @apply bg-emerald-600 text-white rounded-t-xl px-4 py-3 font-semibold;
}
</style>
