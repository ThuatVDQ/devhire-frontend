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

    <!-- Danh sách tin tuyển dụng -->
    <div class="bg-white shadow-2xl rounded-xl p-6">
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
                  <div v-if="applicants[job.id]?.length">
                    <table class="min-w-full divide-y divide-gray-300 mt-2">
                      <thead class="bg-indigo-100">
                        <tr>
                          <th class="px-4 py-2 text-sm font-medium text-gray-700">
                            <input type="checkbox" @change="toggleAll(job.id, $event)" />
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
                </td>
              </tr>
            </template>
          </tbody>
        </table>
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
</template>

<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import CreateInterviewSchedulePopup from '@/components/CreateInterviewSchedulePopup.vue'

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
  console.log('Open interview popup for:', applicant)
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
  const payload = {
    interview_time:
      typeof data.interview_time === 'string'
        ? data.interview_time.replace(' ', 'T')
        : formatDateTimeToLocal(data.interview_time),

    duration_minutes: Number(data.duration_minutes), // chắc chắn là số

    location: String(data.location || '').trim(),
    note: String(data.note || '').trim(),

    job_application_id: selectedApplicant.value.id
  }

  console.log('Payload:', payload)

  axios
    .post('http://localhost:8090/api/interview-schedules/create', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      console.log('Interview schedule created:', response.data)
      toastr.success('Lịch phỏng vấn đã được tạo thành công!')
      closeDialog()
    })
    .catch((error) => {
      toastr.error('Có lỗi xảy ra khi tạo lịch phỏng vấn!')
      console.error('Error creating interview schedule:', error)
    })
}

function onEdit(data) {
  const payload = {
    id: data.id, // cần id để biết đang sửa cái nào
    interview_time:
      typeof data.interview_time === 'string'
        ? data.interview_time.replace(' ', 'T')
        : formatDateTimeToLocal(data.interview_time),

    duration_minutes: Number(data.duration_minutes),
    location: String(data.location || '').trim(),
    note: String(data.note || '').trim()
  }

  console.log('Edit Payload:', payload)

  axios
    .post(`http://localhost:8090/api/interview-schedules/${payload.id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      console.log('Interview schedule updated:', response.data)
      toastr.success('Lịch phỏng vấn đã được cập nhật thành công!')
      fetchInterviewSchedules()
      closeDialog()
    })
    .catch((error) => {
      toastr.error('Có lỗi xảy ra khi cập nhật lịch phỏng vấn!')
      console.error('Error updating interview schedule:', error)
    })
}

async function fetchJobs(page = 0) {
  try {
    const params = {
      page: page,
      limit: pageSize.value,
      status: 'CLOSED'
    }

    const response = await axios.get('http://localhost:8090/api/jobs/company', {
      params: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (e) {
    jobs.value = []
    console.error('Failed to fetch jobs:', e)
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
        const res = await axios.get(`http://localhost:8090/api/job-application/${jobId}`, {
          params: {
            status: 'ACCEPTED'
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(res.data)

        applicants.value[jobId] = res.data
        console.log('Applicants:', applicants.value[jobId])
      } catch (err) {
        console.error('Error loading applicants:', err)
        applicants.value[jobId] = []
      }
    }
  }
}

const events = ref([])

const fetchInterviewSchedules = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/interview-schedules', {
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

onMounted(() => {
  fetchJobs(currentPage.value)
  fetchInterviewSchedules()
})
</script>

<style scoped>
::v-deep(.custom-vuecal .vuecal__header) {
  @apply bg-emerald-600 text-white rounded-t-xl px-4 py-3 font-semibold;
}
</style>
