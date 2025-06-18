<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10">Candidates Search</h1>
  </header>
  <div class="px-11 pt-11">
    <div class="flex justify-between mt-2">
      <div class="relative w-full max-w-sm flex">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by..."
          class="border rounded-xl p-2 pl-10 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="searchByKeyword"
        />
        <button
          @click="searchByKeyword"
          class="bg-emerald-600 text-white px-4 rounded-2xl ml-4 text-sm hover:bg-emerald-700"
        >
          Search
        </button>
      </div>
    </div>
  </div>
  <div class="mx-auto px-11 py-4">
    <!-- Filter Bar (above search bar) -->

    <div class="bg-white shadow-md rounded-lg overflow-hidden mb-12">
      <div v-if="!jobs.length" class="">
        <img
          :src="icon_sad"
          alt="Empty Jobs"
          class="mx-auto mb-6"
          style="width: 300px; height: auto"
        />
        <p class="text-gray-500 text-lg text-center">No results found. Please try again.</p>
      </div>
      <table v-else class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
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
          </tr>
        </thead>
        <tbody>
          <!-- Loop through paginated jobs and display each one -->
          <template v-for="(job, index) in jobs" :key="job.id">
            <tr class="border-b hover:bg-gray-100">
              <td class="p-4 text-sm text-gray-700">
                <div
                  @click="toggleApplicants(job.id)"
                  class="cursor-pointer hover:text-blue-500 flex items-center"
                >
                  <i
                    :class="expandedJobId === job.id ? 'pi pi-angle-down' : 'pi pi-angle-right'"
                    class="mr-2 text-blue-500"
                  ></i>
                  <div class="text-sm font-medium text-gray-800">{{ job.title }}</div>
                </div>
              </td>
              <td class="py-4 px-6 text-sm text-gray-700">
                {{ job.category ? job.category.name : '' }}
              </td>
              <td class="py-4 px-6 text-sm text-gray-700">{{ job.type }}</td>
              <td class="py-4 px-6 text-sm text-gray-700">
                {{
                  job.salary_start && job.salary_end
                    ? job.salary_start > 1000000 && job.salary_end > 1000000
                      ? `${(job.salary_start / 1000000).toFixed(1)} - ${(job.salary_end / 1000000).toFixed(1)}Tr ${job.currency}`
                      : `${job.salary_start} - ${job.salary_end} ${job.currency}`
                    : 'Negotiable'
                }}
              </td>
              <td class="py-4 px-6 text-sm text-gray-700">
                <div class="flex items-center justify-start space-x-2">
                  <span>{{ job.apply_number }} RESUME</span>
                </div>
              </td>
            </tr>

            <tr v-if="expandedJobId === job.id" class="bg-gray-50 border-b border-gray-200">
              <td :colspan="5" class="p-4">
                <h4 class="text-md font-semibold text-gray-800 mb-3">
                  Matching Candidates for "{{ job.title }}"
                </h4>
                <div v-if="getApplicantsForJob(job.id).length > 0" class="overflow-x-auto">
                  <table class="min-w-full text-sm text-left text-gray-600">
                    <thead class="bg-gray-100 text-xs text-gray-700 uppercase">
                      <tr>
                        <th scope="col" class="px-6 py-3">Applicant Name</th>
                        <th scope="col" class="px-6 py-3">Match Percentage</th>
                        <th scope="col" class="px-6 py-3">Last Applied Date</th>
                        <th scope="col" class="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="applicant in getApplicantsForJob(job.id)"
                        :key="applicant.user_id"
                      >
                        <tr class="bg-white border-b hover:bg-gray-100">
                          <td class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                            <div
                              @click="toggleSkills(applicant.user_id)"
                              class="cursor-pointer hover:text-blue-500 flex items-center"
                            >
                              <i
                                :class="
                                  expandedApplicantId === applicant.user_id
                                    ? 'pi pi-angle-down'
                                    : 'pi pi-angle-right'
                                "
                                class="mr-2 text-blue-500"
                              ></i>
                              {{ applicant.full_name }}
                            </div>
                          </td>
                          <td class="px-6 py-4 text-emerald-600 font-semibold">
                            {{ applicant.match_percentage }}%
                          </td>
                          <td class="px-6 py-4 font-semibold">
                            {{ formatDate(applicant.latest_apply_date) }}
                          </td>
                          <td class="px-6 py-4">
                            <template v-if="applicant.isSendEmail">
                              <span class="text-green-600 font-semibold">Email Sent</span>
                            </template>
                            <template v-else>
                              <button
                                @click="openEmailPopup(applicant)"
                                class="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                Send Email
                              </button>
                            </template>
                          </td>
                        </tr>
                        <tr v-if="expandedApplicantId === applicant.user_id" class="bg-gray-100">
                          <td :colspan="4" class="px-6 py-3">
                            <div v-if="applicant.matched_skills && applicant.matched_skills.length">
                              <p class="text-sm font-semibold mb-2">Matched Skills:</p>
                              <div class="flex flex-wrap gap-2">
                                <span
                                  v-for="skill in applicant.matched_skills"
                                  :key="skill"
                                  class="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                  {{ skill }}
                                </span>
                              </div>
                            </div>
                            <p v-else class="text-gray-500 italic text-xs">
                              No matched skills found.
                            </p>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <p v-else class="text-gray-500 italic text-center py-4">
                  No applicants for this job yet.
                </p>
              </td>
            </tr>
          </template>
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

  <div
    v-if="showEmailPopup"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-2xl w-1/2 mx-auto transform transition-all duration-300 scale-100 opacity-100"
    >
      <h3 class="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Send Job Invitation Email
      </h3>
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
          @click="handleSendEmail"
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
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import icon_sad from '@/assets/icon-sad.png'
import qs from 'qs'

const API_URL = import.meta.env.VITE_APP_API_URL

const jobs = ref([]) // Store job data
const searchQuery = ref('') // Store search query
const currentPage = ref(0) // Current page
const totalPages = ref(0)
const pageSize = ref(10)

const searchByKeyword = () => {
  fetchJobs(0) // Gọi lại API từ trang đầu tiên
}

// Fetch all jobs posted by the recruiter
async function fetchJobs(page = 0) {
  try {
    const params = {
      status: ['OPEN', 'HOT'],
      page: page,
      limit: pageSize.value
    }

    if (searchQuery.value.trim() !== '') {
      params.keyword = searchQuery.value.trim()
    }
    const response = await axios.get(`${API_URL}/jobs/company`, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (e) {
    jobs.value = []
    console.error('Failed to fetch jobs:', e)
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchJobs(page)
    scrollToTop()
  }
}
const expandedJobId = ref(null) // Track which job is expanded
const loadedApplicants = ref({})

const expandedApplicantId = ref(null)

async function fetchMatchingCandidates(jobId) {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/candidates/match`, {
      params: {
        threshold: 0 // Ngưỡng phù hợp, bạn có thể làm cho nó động nếu muốn
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    loadedApplicants.value[jobId] = response.data.slice(0, 5)
  } catch (error) {
    console.error(`Failed to fetch matching candidates for job ${jobId}:`, error)
    loadedApplicants.value[jobId] = []
    toastr.error(`Failed to load candidates for job ${jobId}.`)
  } finally {
  }
}

const toggleApplicants = async (jobId) => {
  if (expandedJobId.value === jobId) {
    expandedJobId.value = null
  } else {
    expandedJobId.value = jobId
    if (!loadedApplicants.value[jobId] || loadedApplicants.value[jobId].length === 0) {
      await fetchMatchingCandidates(jobId)
    }
  }
}

const toggleSkills = (applicantId) => {
  if (expandedApplicantId.value === applicantId) {
    expandedApplicantId.value = null // Đóng nếu đang mở
  } else {
    expandedApplicantId.value = applicantId // Mở nếu đang đóng
  }
}

function formatDate(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 7) {
    return ''
  }

  const [year, month, day, hour, minute, second, millisecond] = dateArray

  const date = new Date(year, month - 1, day, hour, minute, second, millisecond)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getApplicantsForJob = (jobId) => {
  return loadedApplicants.value[jobId] || []
}

const closeEmailPopup = () => {
  showEmailPopup.value = false
  emailSubject.value = ''
  emailBody.value = ''
}

const isLoading = ref(false)

const handleSendEmail = async () => {
  if (!selectedApplicant.value.user_id || !emailSubject.value || !emailBody.value) {
    toastr.error('Please fill in both Subject and Body for the email.')
    return
  }
  isLoading.value = true

  const formattedBody = emailBody.value.replace(/\n/g, '<br>')

  try {
    const emailDto = {
      name: selectedApplicant.value.full_name,
      email: selectedApplicant.value.email,
      subject: emailSubject.value,
      content: formattedBody,
      confirmation: true
    }

    // Bước 1: Gửi email
    await axios.post(`${API_URL}/job-application/send-email`, emailDto, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    // Bước 2: Gửi thông báo đến ứng viên
    const notificationDto = {
      message: `You have received an email regarding a job opportunity: ${emailSubject.value}`, // Nội dung thông báo
      username: selectedApplicant.value.email, // Sử dụng user_id của ứng viên để gửi thông báo
      target_url: `/jobs/${expandedJobId.value}` // URL mà ứng viên sẽ được chuyển hướng đến khi click vào thông báo (ví dụ: trang danh sách việc làm của họ)
    }

    // Gọi API để tạo và gửi thông báo
    await axios.post(`${API_URL}/notifications/create`, notificationDto, {
      // Giả định endpoint của bạn là /notification/create
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    toastr.success('Email sent successfully!')
    closeEmailPopup()
  } catch (e) {
    console.error(`Failed to send email or notification:`, e)
    toastr.error(e.response?.data || 'Failed to complete action. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

const showEmailPopup = ref(false)
const emailSubject = ref('')
const emailBody = ref('')
const selectedApplicant = ref(null)

const openEmailPopup = (applicant) => {
  // Đổi tên biến 'interview' thành 'applicant' cho rõ ràng hơn
  selectedApplicant.value = applicant // Sử dụng applicant thay vì interview
  const jobTitle = jobs.value.find((job) => job.id === expandedJobId.value)?.title
  emailSubject.value = `Potential Job Opportunity at [Company Name] for ${jobTitle || 'a Job Opportunity'}`
  emailBody.value =
    `Dear ${applicant.full_name},\n` +
    `\n` +
    `We hope this email finds you well.\n` +
    `\n` +
    `Our team at [Company Name] was impressed by your profile and experience, which aligns well with the requirements for the **${jobTitle || 'an exciting'}** position we currently have open. We believe your skills and qualifications would be a great fit for this role.\n` +
    `\n` +
    `You can find more details about this exciting opportunity and apply directly through the following link:\n` +
    `[Link to Job Posting - Placeholder, you need to replace this]\n` +
    `\n` +
    `We encourage you to explore this role and consider submitting your application. We are looking for talented individuals like you to join our growing team.\n` +
    `\n` +
    `If you have any questions or require further information, please feel free to contact us at:\n` +
    `[Your Email Address] or [Your Phone Number]\n` +
    `\n` +
    `We look forward to hearing from you.\n` +
    `\n` +
    `Sincerely,\n` +
    `\n` +
    `The Recruitment Team\n` +
    `[Company Name]`
  showEmailPopup.value = true
}

onMounted(() => {
  fetchJobs()
})

watch(searchQuery, (newValue, oldValue) => {
  if (newValue.trim() === '' && oldValue.trim() !== '') {
    fetchJobs(0)
  }
})
</script>
