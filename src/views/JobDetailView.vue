<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SimilarJobs from '@/components/SimilarJobs.vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import defaultLogo from '../assets/logo.svg'

const route = useRoute()

const state = reactive({
  job: {},
  isLoading: true,
  isFormVisible: false,
  candidate: {
    name: '',
    email: '',
    phone: '',
    cv: null
  }
})

const formatDate = (dateString) => {
  if (!dateString) {
    return '' // Trả về chuỗi rỗng nếu dateString là null hoặc undefined
  }

  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const fetchCandidateData = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }) // Đổi URL theo API của bạn
    state.candidate.name = response.data.full_name
    state.candidate.email = response.data.email
    state.candidate.phone = response.data.phone
  } catch (error) {
    console.error('Error fetching candidate data:', error)
  }
}

const fileInput = ref(null)

const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleFileUploadNew = (event) => {
  state.candidate.cv = event.target.files[0]
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (
    file &&
    (file.type === 'application/pdf' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif')
  ) {
    state.candidate.cv = file
  } else {
    toastr.error('Invalid file type. Please upload a .pdf, .jpeg, .png, or .gif file.', 'Error')
  }
}

const fetchJobData = async (id) => {
  state.isLoading = true
  try {
    const response = await axios.get(`http://localhost:8090/api/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    state.job = response.data
    if (state.job.company.logo)
      state.job.company.logo = `http://localhost:8090/uploads/${state.job.company.logo}`
  } catch (e) {
    console.error(e)
  } finally {
    state.isLoading = false
  }
}

const showApplicationForm = () => {
  state.isFormVisible = true
}

const closeApplicationForm = () => {
  state.isFormVisible = false
}

const submitApplication = async () => {
  const fileInput = document.getElementById('file-upload')
  if (!fileInput.files.length) {
    toastr.error('Please upload a file.')
    fileInput.focus()
    return
  }
  try {
    const jobId = route.params.id

    const formData = new FormData()
    formData.append('file', state.candidate.cv)

    // Gửi POST request đến endpoint phù hợp với jobId
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/apply`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    toastr.success(response.data, 'Success')
    closeApplicationForm()
  } catch (error) {
    console.error(error)
    toastr.error(error.response.data, 'Error')
  }
}

onMounted(() => {
  fetchJobData(route.params.id)
  fileInput.value = document.getElementById('file-upload')
  fetchCandidateData()
})
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-800 md:pb-24 pb-16">
    <div v-if="state.isLoading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <div class="container mt-10">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-6">
          <div
            class="md:flex items-center p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <img
              :src="state.job.company?.logo || defaultLogo"
              @error="(e) => (e.target.src = defaultLogo)"
              alt="Logo Company"
              class="rounded-full size-28 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700"
            />

            <div class="md:ms-4 md:mt-0 mt-6">
              <h5 class="text-xl font-semibold">{{ state.job.title }}</h5>
              <div class="mt-2">
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-building mr-2"></i>
                  {{ state.job.company?.name || 'Dev Hire' }}
                </span>
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-map-marker mr-2"></i>
                  {{ state.job.company?.address || 'Dev Hire' }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <button
              @click="showApplicationForm"
              class="py-2 px-4 font-[600] rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white w-full md:w-auto"
            >
              <i v-if="state.job.apply_status" class="pi pi-replay mr-2"></i>
              {{ state.job.apply_status ? 'Applied' : 'Apply Now' }}
            </button>
          </div>
          <h5 class="text-lg font-semibold mt-6">Job Description:</h5>
          <p class="text-slate-400 mt-4" style="white-space: pre-line; word-break: break-word">
            {{ state.job.description }}
          </p>

          <h5 class="text-lg font-semibold mt-6">Requirements:</h5>
          <p class="text-slate-400 mt-4" style="white-space: pre-line; word-break: break-word">
            {{ state.job.requirement }}
          </p>

          <h5 class="text-lg font-semibold mt-6">Benefit:</h5>
          <p class="text-slate-400 mt-4" style="white-space: pre-line; word-break: break-word">
            {{ state.job.benefit }}
          </p>
        </div>
        <div class="lg:col-span-4 md:col-span-6">
          <div
            class="shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900 sticky top-20"
          >
            <div class="p-6">
              <h5 class="text-lg font-semibold">Job Information</h5>
            </div>
            <div class="p-6 border-t border-slate-100 dark:border-t-gray-700">
              <ul class="list-none">
                <li class="flex items-center">
                  <i class="pi pi-verified"></i>
                  <div class="ms-4">
                    <p class="font-medium">Position</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{ state.job.position }} - {{ state.job.level }}</span
                    >
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-map-marker"></i>
                  <div class="ms-4">
                    <p class="font-medium">Location:</p>
                    <span
                      v-for="(address, index) in state.job.addresses"
                      :key="index"
                      class="text-emerald-600 font-medium text-sm"
                    >
                      {{
                        [address.street, address.district, address.city, address.country]
                          .filter(Boolean)
                          .join(', ')
                      }}
                      <br v-if="index < state.job.addresses.length" />
                    </span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-desktop"></i>
                  <div class="ms-4">
                    <p class="font-medium">Job Type:</p>
                    <span class="text-emerald-600 font-medium text-sm">
                      {{ [state.job.category?.name, state.job.type].filter(Boolean).join(' - ') }}
                    </span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-briefcase"></i>
                  <div class="ms-4">
                    <p class="font-medium">Experience:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{
                      state.job.experience
                    }}</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-dollar"></i>
                  <div class="ms-4">
                    <p class="font-medium">Salary:</p>
                    <span class="text-emerald-600 font-medium text-sm">
                      {{
                        state.job.salary_start && state.job.salary_end
                          ? `${state.job.salary_start} - ${state.job.salary_end} ${state.job.currency}`
                          : 'Negotiable'
                      }}
                    </span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-clock"></i>
                  <div class="ms-4">
                    <p class="font-medium">Date posted:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{
                      formatDate(state.job.deadline)
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SimilarJobs />
  </section>
  <div
    v-if="state.isFormVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white dark:bg-slate-900 shadow-lg w-[500px] max-w-full rounded-3xl overflow-hidden"
    >
      <h3 class="text-xl font-semibold bg-emerald-600 text-white p-3 rounded-t-3xl">
        Apply for {{ state.job.title }}
      </h3>
      <form @submit.prevent="submitApplication" class="p-6">
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Upload CV *</label>
          <div
            class="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100"
            @click="triggerFileUpload"
            @dragover.prevent
            @dragenter.prevent
            @dragleave.prevent
            @drop.prevent="handleFileDrop"
          >
            <input
              ref="fileInput"
              id="file-upload"
              type="file"
              @change="handleFileUploadNew"
              class="hidden"
              accept=".pdf, .jpeg, .jpg, .png, .gif"
            />
            <span class="text-sm text-gray-500">
              Drag and drop your file here or click to browse
            </span>
          </div>
          <span
            class="mt-2 block text-sm font-medium text-blue-600 truncate bg-blue-100 p-2 rounded-md"
            v-if="state.candidate.cv"
          >
            {{ state.candidate.cv.name }}
          </span>
          <p class="text-xs text-gray-500 mt-2">Supported formats: pdf, img. Max size: 10MB</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Full Name *</label>
          <input
            type="text"
            v-model="state.candidate.name"
            class="w-full p-2 border rounded-md"
            placeholder="Full name displayed to employer"
            required
            readonly
          />
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium">Email *</label>
            <input
              type="email"
              v-model="state.candidate.email"
              class="w-full p-2 border rounded-md"
              placeholder="Email displayed to employer"
              required
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Phone Number *</label>
            <input
              type="text"
              v-model="state.candidate.phone"
              class="w-full p-2 border rounded-md"
              placeholder="Phone number displayed to employer"
              required
              readonly
            />
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="closeApplicationForm"
            class="py-2 px-4 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="py-2 px-4 font-[600] rounded-md bg-green-600 hover:bg-green-700 text-white"
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
