<script setup>
import { useRoute } from 'vue-router'
import { reactive, onMounted, watch, onBeforeUnmount, ref } from 'vue'
import axios from 'axios'
import defaultLogo from '@/assets/logo.svg'
import CardJob from '@/components/CardJob.vue'
import Reviews from '@/components/ReviewCompany.vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const route = useRoute()

const state = reactive({
  company: {
    images: []
  },
  isModalOpen: false,
  currentImageIndex: 0,
  jobs: [],
  isLoading: true,
  currentTab: 'vacancies'
})

const isMenuOpen = ref(false)
const isRejectModalOpen = ref(false)
const rejectReason = ref('')
const reasonInput = ref(null)

const openRejectModal = () => {
  isRejectModalOpen.value = true
  rejectReason.value = '' // Reset lý do khi mở modal
}

const closeRejectModal = () => {
  isRejectModalOpen.value = false
}

watch(isRejectModalOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      reasonInput.value?.focus()
    }, 100) // Delay để đảm bảo DOM đã render xong
  }
})

const changeTab = (tab) => {
  state.currentTab = tab
}

const fetchJobsByCompany = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get('http://localhost:8090/api/jobs/company/' + route.params.id, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    state.jobs = response.data
  } catch (error) {
    console.error('Error fetching jobs:', error)
  }
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
  if (state.currentImageIndex < state.company.images.length - 1) {
    state.currentImageIndex += 1
  }
}
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && state.isModalOpen) {
    closeImageModal()
  }

  if (event.key === 'Escape' && isRejectModalOpen.value) {
    closeRejectModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const fetchCompanyData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8090/api/companies/${id}`)
    state.company = response.data
    if (state.company.logo)
      state.company.logo = `http://localhost:8090/uploads/${state.company.logo}`

    if (state.company.images) {
      state.company.images = state.company.images.map(
        (image) => `http://localhost:8090/uploads/${image}`
      )
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  state.isLoading = true
  fetchCompanyData(route.params.id)
  state.isLoading = false
  fetchJobsByCompany()
})

const viewLicense = () => {
  const baseUrl = 'http://localhost:8090/uploads/'
  const fileName = state.company.business_license

  if (!fileName) {
    console.error('No business license file available')
    return
  }

  const fullUrl = `${baseUrl}${fileName}`
  const fileExtension = fileName.split('.').pop().toLowerCase()

  // Nếu là PDF, mở trực tiếp
  if (fileExtension === 'pdf') {
    window.open(fullUrl, '_blank')
  }
  // Nếu là ảnh (bao gồm cả .jfif), mở trong tab mới
  else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
    const imageWindow = window.open()
    imageWindow.document.write(`
      <html>
  <head>
    <title>Business License</title>
    <style>
      body {
        margin: 0;
        background: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        max-width: 90%;
        max-height: 90%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="${fullUrl}" alt="Business License">
    </div>
  </body>
</html>
    `)
  }
  // Nếu định dạng không xác định, mở trực tiếp
  else {
    window.open(fullUrl, '_blank')
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const approveCompany = async () => {
  isMenuOpen.value = false
  try {
    const response = await axios.put(
      `http://localhost:8090/api/companies/approve-company?companyId=${route.params.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    toastr.success('Company approved successfully')
    fetchCompanyData(route.params.id)
  } catch (error) {
    console.error('Error:', error)
    toastr.error(error.response.data.message)
  } finally {
    isMenuOpen.value = false
  }
}

const rejectCompany = async () => {
  if (!rejectReason.value.trim()) {
    toastr.error('Please enter a rejection reason')
    return
  }

  isRejectModalOpen.value = false // Đóng modal khi gửi request

  try {
    await axios.put(
      `http://localhost:8090/api/companies/reject-company?companyId=${route.params.id}&reason=${encodeURIComponent(rejectReason.value)}`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )

    toastr.success('Company rejected successfully')
    fetchCompanyData(route.params.id)
  } catch (error) {
    console.error('Error:', error)
    toastr.error(error.response?.data?.message || 'An error occurred')
  } finally {
    isMenuOpen.value = false
  }
}
// Theo dõi sự thay đổi của route.params.id để cập nhật dữ liệu khi id thay đổi
watch(
  () => route.params.id,
  (newId) => {
    fetchCompanyData(newId)
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <section
    class="relative table w-full py-40 bg-[url('../assets/banner.png')] bg-center bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0 bg-emerald-900/60"></div>
  </section>
  <section class="relative mb:pb-24 pb-16 -mt-16 z-1">
    <div class="px-14 pt-14 pb-4">
      <div class="grid grid-cols-1">
        <div
          class="md:flex justify-between items-center shadow dark:shadow-gray-700 rounded-md p-6 bg-white dark:bg-slate-900"
        >
          <div class="flex items-center">
            <img
              :src="state.company?.logo || defaultLogo"
              alt="logo-company"
              class="size-20 shadow dark:shadow-gray-700 rounded-md bg-slate-50 dark:bg-slate-800"
            />
            <div class="ms-4">
              <div class="flex items-center space-x-4">
                <h5 class="text-xl font-bold">{{ state.company.name }}</h5>
                <div
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700 border border-yellow-500':
                      state.company.company_status === 'PENDING',
                    'bg-green-100 text-green-700 border border-green-500':
                      state.company.company_status === 'ACTIVE',
                    'bg-red-100 text-red-700 border border-red-500':
                      state.company.company_status === 'REJECTED'
                  }"
                >
                  {{ state.company.company_status }}
                </div>
              </div>
              <div class="flex items-center space-x-4 mt-2">
                <a
                  :href="state.company.web_url || '#'"
                  class="text-base text-blue-600 hover:text-blue-800 flex items-center underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="pi pi-globe pr-1"></i>
                  {{ state.company.web_url || 'Website not available' }}
                </a>

                <h6 class="text-base text-slate-400 flex items-center">
                  <i class="pi pi-building pr-1"></i>
                  {{ state.company.scale }} employees
                </h6>
              </div>
            </div>
          </div>
          <div class="relative">
            <button
              @click="toggleMenu"
              :disabled="state.company.company_status !== 'PENDING'"
              class="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center relative group"
            >
              <i
                class="pi pi-ellipsis-v text-gray-500 text-xl"
                :class="{
                  'cursor-not-allowed text-gray-400': state.company.company_status !== 'PENDING'
                }"
              ></i>
              <span
                v-if="state.company.company_status !== 'PENDING'"
                class="absolute left-1/2 -top-8 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-700 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap"
              >
                Company is not pending approval
              </span>
            </button>

            <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-lg py-2 border border-gray-200 dark:border-gray-700"
            >
              <!-- Approve -->
              <button
                @click="approveCompany"
                :disabled="state.company.company_status !== 'PENDING'"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <i class="pi pi-check text-green-500 mr-2"></i>
                Approve Company
              </button>

              <!-- Reject -->
              <button
                @click="openRejectModal"
                :disabled="state.company.company_status !== 'PENDING'"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700 transition"
              >
                <i class="pi pi-times text-red-500 mr-2"></i>
                Reject Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-14">
      <button
        @click="viewLicense"
        :disabled="!state.company.business_license"
        :class="[
          state.company.business_license
            ? 'text-blue-600 hover:text-blue-700 hover:no-underline hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 active:text-blue-800 active:bg-blue-200'
            : 'text-gray-400 bg-gray-100 cursor-not-allowed relative group',
          'font-semibold underline transition duration-300 ease-in-out px-2 py-1 rounded'
        ]"
      >
        View License
        <!-- Tooltip -->
        <span
          v-if="!state.company.business_license"
          class="absolute left-1/2 -top-8 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-700 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap"
        >
          License Not Updated
        </span>
      </button>
    </div>

    <div class="px-14 pb-14 pt-4">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-7">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div
              v-for="(image, index) in state.company.images.slice(0, 2)"
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
                v-if="index === 1 && state.company.images.length > 2"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl"
              >
                +{{ state.company.images.length - 2 }}
              </div>
            </div>
          </div>

          <!-- Modal hiển thị tất cả ảnh -->
          <div
            v-if="state.isModalOpen"
            class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            @click.self="closeImageModal"
          >
            <div class="bg-white p-4 rounded-md shadow-lg max-w-3xl relative w-auto">
              <!-- Hình ảnh hiện tại -->
              <img
                :src="state.company.images[state.currentImageIndex]"
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
                :disabled="state.currentImageIndex === state.company.images.length - 1"
              >
                <i class="pi pi-angle-right"></i>
              </button>

              <!-- Dấu chấm tròn hiển thị vị trí -->
              <div class="flex justify-center mt-4">
                <span
                  v-for="(image, index) in state.company.images"
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
          <h5 class="text-xl font-semibold">Company Story</h5>
          <p
            class="text-slate-400 mt-4 shadow-2xl p-4 bg-white"
            style="
              white-space: pre-line;
              word-break: break-word;
              text-align: justify;
              border-radius: 12px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            "
          >
            {{ state.company.description }}
          </p>
          <div class="flex justify-start border-b-2 border-gray-200 mb-6 mt-6">
            <button
              @click="changeTab('vacancies')"
              :class="[
                state.currentTab === 'vacancies'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              ]"
              class="py-2 px-6 font-semibold text-lg transition-all duration-300"
            >
              Vacancies
            </button>
            <button
              @click="changeTab('reviews')"
              :class="[
                state.currentTab === 'reviews'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 '
                  : 'text-gray-600 hover:text-emerald-600'
              ]"
              class="py-2 px-6 font-semibold text-lg transition-all duration-300 flex items-center"
            >
              Reviews
              <span
                v-if="state.company.totalReviews > 0"
                :class="[
                  state.currentTab === 'reviews'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-300 text-gray-600',
                  'ml-2 text-sm px-2 py-1 rounded-full font-semibold'
                ]"
                >{{ state.company.totalReviews }}</span
              >
            </button>
          </div>

          <!-- Vacancies Tab Content -->
          <div v-if="state.currentTab === 'vacancies'">
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6">
              <CardJob v-for="job in state.jobs" :key="job.id" :job="job" />
            </div>
          </div>

          <!-- Reviews Tab Content -->
          <div v-if="state.currentTab === 'reviews'">
            <Reviews :companyId="route.params.id" :isAdmin="true" />
          </div>
        </div>
        <div class="lg:col-span-4 md:col-span-5">
          <div
            class="bg-white dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-6 sticky top-20"
          >
            <div class="w-full leading-[0] border-0">
              <iframe
                :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${encodeURIComponent(state.company.address)}&zoom=15&language=vi`"
                frameborder="0"
                class="w-full h-[350px] rounded-md shadow dark:shadow-gray-700"
                allowfullscreen
              ></iframe>
            </div>
            <ul class="list-none mt-4">
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Email:</span
                ><span class="font-medium">{{ state.company.email }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Phone:</span
                ><span class="font-medium">{{ state.company.phone }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Headquarters:</span
                ><span class="font-medium">{{ state.company.address }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Number of employees:</span
                ><span class="font-medium">{{ state.company.scale }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Website:</span
                ><span class="font-medium ml-2 break-all">{{ state.company.web_url }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal nhập lý do từ chối -->
  <teleport to="body">
    <div
      v-if="isRejectModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
      @click.self="closeRejectModal"
    >
      <div
        class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-[400px] transition-transform transform scale-100"
      >
        <!-- Tiêu đề -->
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Enter Rejection Reason
        </h3>

        <!-- Ô nhập lý do -->
        <textarea
          ref="reasonInput"
          v-model="rejectReason"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white transition"
          rows="4"
          placeholder="Enter reason..."
        ></textarea>

        <!-- Hàng nút bấm -->
        <div class="flex justify-end space-x-3 mt-5">
          <button
            @click="closeRejectModal"
            class="px-5 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition active:scale-95"
          >
            Cancel
          </button>
          <button
            @click="rejectCompany"
            class="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-md active:scale-95"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
