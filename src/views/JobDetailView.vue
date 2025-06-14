<script setup>
import { reactive, onMounted, ref, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import SimilarJobs from '@/components/SimilarJobs.vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import defaultLogo from '../assets/logo.svg'
import Reviews from '@/components/ReviewCompany.vue'

const route = useRoute()

const state = reactive({
  job: {
    company: {
      images: []
    }
  },
  isLoading: true,
  isApplying: false,
  isFormVisible: false,
  isAddingLetter: false,
  isModalOpen: false,
  currentImageIndex: 0,
  candidate: {
    name: '',
    email: '',
    phone: '',
    cv: null,
    letter: ''
  },
  currentTab: 'overview',
  isChoosingNewCV: 'old',
  latestCV: null
})

const changeTab = (tab) => {
  state.currentTab = tab
}

const openImageModal = (index) => {
  state.currentImageIndex = index
  state.isModalOpen = true
}

const closeImageModal = () => {
  state.isModalOpen = false
}

const goToImage = (index) => {
  state.currentImageIndex = index
}

const previousImage = () => {
  if (state.currentImageIndex > 0) {
    state.currentImageIndex -= 1
  }
}

const nextImage = () => {
  if (state.currentImageIndex < state.job.company.images.length - 1) {
    state.currentImageIndex += 1
  }
}
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeImageModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const formatDate = (dateArray) => {
  console.log('dateArray', dateArray)
  if (!Array.isArray(dateArray) || dateArray.length < 7) {
    return ''
  }

  // Mảng của bạn: [year, month, day, hour, minute, second, millisecond]
  const [year, month, day, hour, minute, second] = dateArray

  // Chuyển mảng thành đối tượng Date
  const date = new Date(year, month - 1, day, hour, minute, second)

  // Định dạng ngày tháng theo kiểu 'dd-MMM-yyyy'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const fetchCandidateData = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')

    // Exit function if no token is available
    if (!token) {
      console.warn('No token found. Exiting fetchCandidateData function.')
      return
    }

    // Configure headers with token
    const headers = { Authorization: `Bearer ${token}` }

    // Make API call
    const response = await axios.get('http://localhost:8090/api/users/profile', {
      headers
    }) // Change URL according to your API

    // Update candidate state with response data
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
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')

    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const response = await axios.get(`http://localhost:8090/api/jobs/${id}`, {
      headers
    })
    state.job = response.data
    if (state.job.company.logo)
      state.job.company.logo = `http://localhost:8090/uploads/${state.job.company.logo}`

    if (state.job.company.images) {
      state.job.company.images = state.job.company.images.map(
        (image) => `http://localhost:8090/uploads/${image}`
      )
    }
  } catch (e) {
    console.error(e)
  } finally {
    state.isLoading = false
  }
}

const showApplicationForm = () => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('token')
  if (token) {
    state.isFormVisible = true
    state.candidate.cv = null
    state.candidate.letter = ''
    state.isAddingLetter = false
  } else {
    toastr.error('Please login to apply for this job.', 'Error')
    localStorage.setItem('redirectAfterLogin', window.location.pathname)
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  }
}

const toggleLetter = () => {
  state.isAddingLetter = !state.isAddingLetter
  if (!state.isAddingLetter) {
    state.candidate.letter = '' // Xóa giá trị của letter khi remove
  }
}

const closeApplicationForm = () => {
  state.isFormVisible = false
}

const submitApplication = async () => {
  state.isApplying = true
  try {
    const jobId = route.params.id

    const formData = new FormData()
    formData.append('file', state.candidate.cv)
    // Thêm letter vào formData
    formData.append('letter', state.candidate.letter)
    formData.append('cvId', state.latestCV ? state.latestCV.id : 0)

    // Gửi POST request đến endpoint phù hợp với jobId
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/apply`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    toastr.success(response.data, 'Success')
    state.job.apply_status = 'IN_PROGRESS'
    fetchLastedCV()
    closeApplicationForm()
  } catch (error) {
    console.error(error)
    toastr.error(error.response.data, 'Error')
  } finally {
    state.isApplying = false
  }
}

watch(
  () => route.params.id, // Watch for changes in the id parameter
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchJobData(newId) // Fetch new job data when id changes
    }
  }
)

onMounted(() => {
  fetchJobData(route.params.id)
  fileInput.value = document.getElementById('file-upload')
  fetchCandidateData()
  fetchLastedCV()
})

const differenceInDays = computed(() => {
  const currentDate = new Date()
  const deadlineArray = state.job.deadline

  if (!Array.isArray(deadlineArray) || deadlineArray.length < 5) return null

  const [year, month, day, hour, minute] = deadlineArray
  const deadlineDate = new Date(year, month - 1, day, hour, minute)

  const differenceInTime = deadlineDate.getTime() - currentDate.getTime()
  return Math.floor(differenceInTime / (1000 * 3600 * 24))
})

function formatSalary(amount) {
  if (amount >= 1000000) {
    return `${amount / 1000000}M`
  }
  return amount
}

const fetchLastedCV = async () => {
  try {
    if (`Bearer ${localStorage.getItem('token')}` == 'Bearer null') {
      return
    }
    const response = await axios.get('http://localhost:8090/api/cv/latest', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    state.latestCV = response.data
  } catch (error) {
    console.log(error)
    state.latestCV = null
    state.isChoosingNewCV = 'new'
    console.log(state.latestCV)
  }
}

async function viewCV(cv_url) {
  if (!cv_url) {
    toastr.error('No CV found', 'Error')
    return
  }
  const baseUrl = 'http://localhost:8090/uploads/' // Change this base URL as needed
  const fullUrl = `${baseUrl}${cv_url}`
  window.open(fullUrl, '_blank')
}
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-800 md:pb-24 pb-16">
    <div v-if="state.isLoading" class="flex justify-center">
      <div
        class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
      ></div>
    </div>
    <div class="container pt-10">
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
              <div class="flex items-center justify-between">
                <h5 class="text-xl font-semibold">{{ state.job.title }}</h5>
                <span
                  class="bg-teal-100 text-teal-600 font-medium text-sm py-2 px-4 rounded-lg shadow-md transition-colors duration-300 hover:bg-teal-200"
                >
                  {{
                    state.job.salary_start && state.job.salary_end
                      ? `${formatSalary(state.job.salary_start)} - ${formatSalary(state.job.salary_end)} ${state.job.currency}`
                      : 'Negotiable'
                  }}
                </span>
              </div>
              <div class="mt-3">
                <RouterLink
                  :to="`/companies/${state.job.company?.id}`"
                  class="text-slate-600 font-medium me-2 inline-flex items-center hover:text-emerald-600 transition-all duration-500"
                >
                  <i class="pi pi-building mr-2"></i>
                  {{ state.job.company?.name || 'Dev Hire' }}
                </RouterLink>

                <span class="text-slate-600 font-medium me-2 inline-flex items-center mt-2">
                  <i class="pi pi-map-marker mr-2"></i>
                  {{ state.job.company?.address || 'Dev Hire' }}
                </span>
                <a
                  :href="state.job.company?.web_url || '#'"
                  class="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mt-2 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="pi pi-globe mr-2"></i>
                  {{ state.job.company?.web_url || 'Dev Hire' }}
                </a>
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

          <div class="grid grid-cols-2 gap-4 my-6">
            <div
              v-for="(image, index) in state.job.company.images.slice(0, 2)"
              :key="index"
              class="relative cursor-pointer"
              @click="openImageModal(index)"
            >
              <img
                :src="image"
                alt="Company Image"
                class="rounded-md shadow dark:shadow-gray-700 w-full h-[150px] object-contain object-center"
              />
              <!-- Nếu là ảnh thứ 2, hiển thị lớp phủ -->
              <div
                v-if="index === 1 && state.job.company.images.length > 2"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl"
              >
                +{{ state.job.company.images.length - 2 }}
              </div>
            </div>
          </div>

          <div
            v-if="state.isModalOpen"
            class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            @click.self="closeImageModal"
          >
            <div class="bg-white p-4 rounded-md shadow-lg max-w-3xl relative">
              <!-- Hình ảnh hiện tại -->
              <img
                :src="state.job.company.images[state.currentImageIndex]"
                alt="Company Image"
                class="rounded-md"
                :style="{ height: '600px' }"
              />

              <!-- Nút mũi tên trái -->
              <button
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
                :disabled="state.currentImageIndex === 0"
              >
                <i class="pi pi-angle-left"></i>
              </button>

              <!-- Nút mũi tên phải -->
              <button
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
                :disabled="state.currentImageIndex === state.job.company.images.length - 1"
              >
                <i class="pi pi-angle-right"></i>
              </button>

              <!-- Dấu chấm tròn hiển thị vị trí -->
              <div class="flex justify-center mt-4">
                <span
                  v-for="(image, index) in state.job.company.images"
                  :key="index"
                  @click="goToImage(index)"
                  class="w-3 h-3 rounded-full mx-1 cursor-pointer"
                  :class="{
                    'bg-gray-300': state.currentImageIndex !== index,
                    'bg-emerald-600': state.currentImageIndex === index
                  }"
                ></span>
              </div>
            </div>
          </div>
          <div class="flex justify-start border-b-2 border-gray-200 mb-6 mt-6">
            <button
              @click="changeTab('overview')"
              :class="[
                state.currentTab === 'overview'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              ]"
              class="py-2 px-6 font-semibold text-lg transition-all duration-300"
            >
              Overview
            </button>
            <button
              @click="changeTab('reviews')"
              :class="[
                state.currentTab === 'reviews'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              ]"
              class="py-2 px-6 font-semibold text-lg transition-all duration-300"
            >
              Reviews
              <span
                v-if="state.job.company.totalReviews > 0"
                :class="[
                  state.currentTab === 'reviews'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-300 text-gray-600',
                  'ml-2 text-sm px-2 py-1 rounded-full font-semibold'
                ]"
                >{{ state.job.company.totalReviews }}</span
              >
            </button>
          </div>
          <div v-if="state.currentTab === 'overview'">
            <h5 class="text-lg font-semibold mt-6">Job Description:</h5>
            <p
              class="mt-4 p-4 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700"
              style="
                white-space: pre-line;
                word-break: break-word;
                text-align: justify;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              "
            >
              {{ state.job.description }}
            </p>

            <h5 class="text-lg font-semibold mt-16">Requirements:</h5>
            <p
              class="mt-4 p-4 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700"
              style="
                white-space: pre-line;
                word-break: break-word;
                text-align: justify;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              "
            >
              {{ state.job.requirement }}
            </p>

            <h5 class="text-lg font-semibold mt-16">Benefit:</h5>
            <p
              class="mt-4 p-4 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700"
              style="
                white-space: pre-line;
                word-break: break-word;
                text-align: justify;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              "
            >
              {{ state.job.benefit }}
            </p>
          </div>
          <div v-else>
            <Reviews :companyId="state.job.company.id" />
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
                  <i class="pi pi-lightbulb"></i>
                  <div class="ms-4">
                    <p class="font-medium">Skills:</p>
                    <span
                      v-for="(skill, index) in state.job.skills"
                      :key="index"
                      class="text-emerald-600 font-medium text-sm"
                    >
                      {{ skill.name }}<span v-if="index < state.job.skills.length - 1"> - </span>
                    </span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-clock"></i>
                  <div class="ms-4">
                    <p class="font-medium">Date posted:</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{
                        `${formatDate(state.job.created_at)} - Remaining:  ${differenceInDays} days`
                      }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SimilarJobs :id="route.params.id" />
  </section>
  <div
    v-if="state.isFormVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white dark:bg-slate-900 shadow-lg w-[600px] max-w-full overflow-y-auto rounded-3xl"
    >
      <h3 class="text-xl font-semibold bg-emerald-600 text-white p-3 rounded-t-3xl">
        Apply for {{ state.job.title }}
      </h3>
      <form @submit.prevent="submitApplication" class="p-6">
        <div
          class="max-h-[70vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
        >
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Choose CV *</label>
            <div class="items-center mb-4">
              <div
                v-if="state.latestCV !== null"
                class="shadow rounded-md p-6 mb-4"
                :class="{ 'bg-gray-50': state.isChoosingNewCV !== 'old' }"
              >
                <div class="flex items-center mb-3">
                  <input
                    type="radio"
                    id="oldCV"
                    v-model="state.isChoosingNewCV"
                    value="old"
                    class="mr-2"
                  />
                  <label for="oldCV" class="text-sm font-medium">Select Old CV</label>
                </div>
                <!-- Section to select an old CV -->
                <div class="ml-4 w-full flex items-center">
                  <span class="font-semibold text-gray-700 mr-3">Latest CV:</span>
                  <span
                    class="text-blue-600 cursor-pointer"
                    @click="viewCV(state.latestCV.cv_url)"
                    >{{ state.latestCV?.name }}</span
                  >
                </div>
              </div>
              <div
                class="shadow rounded-md p-6"
                :class="{ 'bg-gray-50': state.isChoosingNewCV !== 'new' }"
              >
                <div class="flex items-center mb-3">
                  <input
                    type="radio"
                    id="newCV"
                    v-model="state.isChoosingNewCV"
                    value="new"
                    class="mr-2"
                  />
                  <label for="newCV" class="text-sm font-medium mr-4">Upload CV</label>
                </div>
                <div
                  v-bind:class="{
                    'pointer-events-none opacity-50': state.isChoosingNewCV !== 'new'
                  }"
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
                <p class="text-xs text-gray-500 mt-2">
                  Supported formats: pdf, img. Max size: 10MB
                </p>
              </div>
            </div>
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

          <!-- Add Letter Button and Textarea -->
          <div class="mb-4">
            <button
              type="button"
              @click="toggleLetter"
              class="py-2 px-4 bg-blue-600 text-white rounded-md"
            >
              {{ state.isAddingLetter ? 'Remove Letter' : 'Add Letter' }}
            </button>
          </div>
          <div v-if="state.isAddingLetter" class="mb-4">
            <label class="block text-sm font-medium">Cover Letter</label>
            <textarea
              v-model="state.candidate.letter"
              rows="4"
              class="w-full p-2 border rounded-md"
              placeholder="Write your cover letter here"
            ></textarea>
          </div>

          <div
            v-if="state.isApplying"
            class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          >
            <div
              class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
            ></div>
            <p class="text-white text-lg">Please waiting ...</p>
          </div>

          <div v-else class="flex justify-end gap-4">
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
        </div>
      </form>
    </div>
  </div>
</template>
