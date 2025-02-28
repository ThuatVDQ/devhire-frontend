<script setup>
import CompanyList from '@/components/CompanyList.vue'
import CardExploreJob from '@/components/CardExploreJob.vue'
import { useRoute } from 'vue-router'
import { reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import axios from 'axios'
import defaultLogo from '@/assets/logo.svg'
import CardJob from '@/components/CardJob.vue'
import Reviews from '@/components/ReviewCompany.vue'

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
  const fullUrl = `${baseUrl}${state.company.business_license}`
  window.open(fullUrl, '_blank')
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
    <div class="p-14">
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
              <h5 class="text-xl font-bold">{{ state.company.name }}</h5>
              <div class="flex items-center space-x-4">
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
        </div>
      </div>
    </div>
    <div class="pl-14">
      <button
        @click="viewLicense"
        class="text-blue-600 font-semibold underline transition duration-300 ease-in-out hover:text-blue-700 hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-400 active:text-blue-800"
      >
        View License
      </button>
    </div>

    <div class="p-14">
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
</template>
