<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SimilarJobs from '@/components/SimilarJobs.vue'
import axios from 'axios'

const route = useRoute()

const state = reactive({
  job: {},
  isLoading: true,
  isFormVisible: false,
  candidate: {
    name: '',
    email: '',
    cv: null
  }
})

const fetchJobData = async (id) => {
  state.isLoading = true
  try {
    const response = await axios.get(`http://localhost:8000/jobs/${id}`)
    state.job = response.data
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

const handleFileUpload = (event) => {
  state.candidate.cv = event.target.files[0]
}

const submitApplication = async () => {
  try {
    const formData = new FormData()
    formData.append('name', state.candidate.name)
    formData.append('email', state.candidate.email)
    formData.append('cv', state.candidate.cv)

    await axios.post(`http://localhost:8000/apply`, formData)
    alert('Application submitted successfully!')
    closeApplicationForm()
  } catch (error) {
    console.error(error)
    alert('Error submitting application.')
  }
}

onMounted(() => {
  fetchJobData(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    fetchJobData(newId)
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-800 md:pb-24 pb-16">
    <div class="container mt-10">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-6">
          <div
            class="md:flex items-center p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <img
              src=""
              alt=""
              class="rounded-full size-28 p-4 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700"
            />
            <div class="md:ms-4 md:mt-0 mt-6">
              <h5 class="text-xl font-semibold">{{ state.job.title }}</h5>
              <div class="mt-2">
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-building"></i>Lenovo pvt. ltd .
                </span>
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-map-marker"></i>Norway,Oslo
                </span>
              </div>
            </div>
          </div>
          <h5 class="text-lg font-semibold mt-6">Job Description:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.description }}
          </p>
          <h5 class="text-lg font-semibold mt-6">Requirements:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.requirement }}
          </p>
          <h5 class="text-lg font-semibold mt-6">Benefit:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.benefit }}
          </p>
          <div class="mt-5">
            <button
              @click="showApplicationForm"
              class="py-2 px-4 font-[600] rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white md:ms-2 w-full md:w-auto"
            >
              Apply Now
            </button>
          </div>

          <!-- Form ứng tuyển -->
          <!-- Application Form Popup -->
          <div
            v-if="state.isFormVisible"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div class="bg-white dark:bg-slate-900 p-6 rounded-md shadow-lg w-[500px] max-w-full">
              <h3 class="text-xl font-semibold mb-4">Ứng tuyển {{ state.job.title }}</h3>
              <form @submit.prevent="submitApplication">
                <div class="mb-4">
                  <label class="block text-sm font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    v-model="state.candidate.name"
                    class="w-full p-2 border rounded-md"
                    placeholder="Họ tên hiển thị với NTD"
                    required
                  />
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      v-model="state.candidate.email"
                      class="w-full p-2 border rounded-md"
                      placeholder="Email hiển thị với NTD"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium">Số điện thoại *</label>
                    <input
                      type="text"
                      v-model="state.candidate.phone"
                      class="w-full p-2 border rounded-md"
                      placeholder="Số điện thoại hiển thị với NTD"
                      required
                    />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium">Tải lên CV *</label>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    class="w-full p-2 border rounded-md"
                    accept=".pdf, .doc, .docx"
                    required
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
                  </p>
                </div>
                <div class="flex gap-4">
                  <button
                    type="button"
                    @click="closeApplicationForm"
                    class="py-2 px-4 bg-gray-500 text-white rounded-md"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    class="py-2 px-4 font-[600] rounded-md bg-green-600 hover:bg-green-700 text-white"
                  >
                    Nộp hồ sơ ứng tuyển
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                    <p class="font-medium">Employee Type:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{ state.job.type }}</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-map-marker"></i>
                  <div class="ms-4">
                    <p class="font-medium">Location:</p>
                    <span class="text-emerald-600 font-medium text-sm">Australia</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-desktop"></i>
                  <div class="ms-4">
                    <p class="font-medium">Job Type:</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{ state.job.level }} {{ state.job.position }}</span
                    >
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
                  <i class="pi pi-book"></i>
                  <div class="ms-4">
                    <p class="font-medium">Qualifications:</p>
                    <span class="text-emerald-600 font-medium text-sm">MCA</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-dollar"></i>
                  <div class="ms-4">
                    <p class="font-medium">Salary:</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{ state.job.salary_start }} - {{ state.job.salary_end }}
                      {{ state.job.currency }}</span
                    >
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-clock"></i>
                  <div class="ms-4">
                    <p class="font-medium">Date posted:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{
                      state.job.created_at
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
</template>
