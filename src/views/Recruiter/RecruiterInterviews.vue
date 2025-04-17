<template>
  <div class="p-8 bg-gray-50 min-h-screen space-y-8">
    <!-- Tiêu đề và breadcrumb -->
    <div>
      <h1 class="text-4xl font-semibold text-gray-800">Phỏng vấn</h1>
    </div>

    <!-- Lịch phỏng vấn -->
    <div class="bg-white shadow-2xl rounded-xl p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Lịch phỏng vấn</h2>
      <VueCal
        :events="events"
        default-view="month"
        time="24"
        hide-view-selector
        locale="vi"
        class="rounded-lg shadow-xl border border-gray-300 overflow-hidden"
        @event-click="handleClick"
      />
    </div>

    <!-- Danh sách tin tuyển dụng -->
    <div class="bg-white shadow-2xl rounded-xl p-6">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Danh sách tin tuyển dụng</h2>
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
                            <button
                              class="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                              @click="openInterviewPopup(applicant)"
                            >
                              Đặt lịch
                            </button>
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

  <CreateInterviewSchedulePopup :isVisible="showPopup" @confirm="onConfirm" @cancel="closeDialog" />
</template>

<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { ref, onMounted, watch } from 'vue'
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

function openInterviewPopup(applicant) {
  console.log('Open interview popup for:', applicant)
  selectedApplicant.value = applicant
  showPopup.value = true
}

function closeDialog() {
  showPopup.value = false
  selectedApplicant.value = null
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

async function fetchJobs(page = 0) {
  try {
    const params = {
      page: page,
      limit: pageSize.value
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
      } catch (err) {
        console.error('Error loading applicants:', err)
        applicants.value[jobId] = []
      }
    }
  }
}

// Biến lưu lịch phỏng vấn (hiển thị trên lịch)
const eventss = ref([])

// Gọi API lấy dữ liệu phỏng vấn
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
    console.log(response.data)
    const rawData = response.data.content || []

    // // Chuyển đổi dữ liệu về định dạng VueCal
    // eventss.value = rawData.map((item) => ({
    //   start: item.interviewTime,
    //   end: item.interviewEndTime || item.interviewTime, // hoặc +1h nếu không có
    //   title: item.candidateName,
    //   content: `Position: ${item.jobTitle}`
    // }))
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  }
}

const events = ref([
  {
    start: '2025-04-18 09:00',
    end: '2025-04-18 10:00',
    title: 'Phỏng vấn ứng viên A',
    content: 'Vị trí: Frontend Developer'
  },
  {
    start: '2025-04-20 14:00',
    end: '2025-04-20 15:00',
    title: 'Phỏng vấn ứng viên B',
    content: 'Vị trí: UX Designer'
  }
])

onMounted(() => {
  fetchJobs(currentPage.value)
  fetchInterviewSchedules()
})
</script>
