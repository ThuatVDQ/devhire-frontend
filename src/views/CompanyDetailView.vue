<script setup>
import CompanyList from '@/components/CompanyList.vue'
import CardExploreJob from '@/components/CardExploreJob.vue'
import { useRoute } from 'vue-router'
import { reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import axios from 'axios'
import defaultLogo from '../assets/logo.svg'
import CardJob from '@/components/CardJob.vue'
import { formatDistanceToNow, parseISO } from 'date-fns'

const route = useRoute()

const state = reactive({
  company: {
    images: []
  },
  isModalOpen: false,
  currentImageIndex: 0,
  jobs: [],
  reviews: [],
  totalPages: 0,
  currentPage: 0,
  companies: [],
  isLoading: true
})

const newReview = reactive({
  rating: 0,
  comment: ''
})

const setRating = (star) => {
  newReview.rating = star
}

const hoverRating = (star) => {
  // Temporarily set rating to the hovered star for visual effect
  newReview.hoverRating = star
}

const clearHover = () => {
  // Clear the temporary hover rating
  newReview.hoverRating = null
}

const submitReview = async () => {
  try {
    // Assuming you have a function to submit the review to the server
    await axios.post(
      `http://localhost:8090/api/reviews/${route.params.id}`,
      {
        rating: newReview.rating,
        comment: newReview.comment
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    // Reset the form after submitting
    newReview.rating = 0
    newReview.comment = ''
    fetchCompanyReviews(route.params.id)
  } catch (error) {
    console.error('Error submitting review:', error)
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

const fetchCompanies = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/companies')
    state.companies = response.data
    console.log('Companies fetched:', response.data)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
  }
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

const fetchCompanyData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8090/api/companies/${id}`)
    state.company = response.data
    console.log('Company fetched:', response.data)
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

const fetchCompanyReviews = async (companyId, page = 0, limit = 10) => {
  try {
    const response = await axios.get(`http://localhost:8090/api/reviews/${companyId}`, {
      params: {
        page,
        limit
      }
    })
    console.log('Company reviews:', response.data)
    const data = response.data
    state.reviews = data.company_reviews || []
    state.totalPages = data.totalPages
    state.isLoading = false
  } catch (error) {
    console.error('Error fetching company reviews:', error)
    state.isLoading = false
  }
}

const formatReviewDate = (createdAt) => {
  const date = parseISO(createdAt)
  const distance = formatDistanceToNow(date, { addSuffix: true })

  // If the review is older than 1 year, display the full date
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  if (date < oneYearAgo) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return distance
}

const loadMoreReviews = () => {
  if (state.currentPage < state.totalPages - 1) {
    state.currentPage += 1
    fetchCompanyReviews(route.params.companyId, state.currentPage)
  }
}

onMounted(async () => {
  state.isLoading = true
  await fetchCompanies()
  fetchCompanyData(route.params.id)
  fetchCompanyReviews(route.params.id)
  state.isLoading = false
  fetchJobsByCompany()
})

// Theo dõi sự thay đổi của route.params.id để cập nhật dữ liệu khi id thay đổi
watch(
  () => route.params.id,
  (newId) => {
    fetchCompanyData(newId)
    fetchCompanyReviews(newId)
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
    <div class="container">
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
    <div class="container mt-12">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-7">
          <!-- Hiển thị 2 ảnh đầu tiên -->
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
            class="text-slate-400 mt-4"
            style="white-space: pre-line; word-break: break-word; text-align: justify"
          >
            {{ state.company.description }}
          </p>
          <h5 class="text-xl font-semibold mt-6">Vacancies:</h5>
          <div class="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6">
            <CardJob v-for="job in state.jobs" :key="job.id" :job="job" />
          </div>
        </div>
        <div class="lg:col-span-4 md:col-span-5">
          <div
            class="bg-slate-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-6 sticky top-20"
          >
            <div class="w-full leading-[0] border-0">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=31+duong+2+Lang+Bao+Chi,Phuong+Thao+Dien,Thanh+pho+Thu+Duc,Thanh+pho+Ho+Chi+Minh,Viet+Nam&zoom=15&language=vi"
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

    <div class="container mt-14">
      <!-- Reviews Section -->
      <h3 class="text-2xl font-semibold text-gray-800 mb-6">Reviews</h3>

      <!-- Display Reviews if available -->
      <div v-if="state.reviews.length" class="space-y-6">
        <div
          v-for="(review, index) in state.reviews"
          :key="index"
          class="review-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div class="flex space-x-3 items-center">
            <h4 class="text-xl font-semibold text-gray-800">{{ review.full_name }}</h4>
            <!-- <span class="text-sm text-gray-500">
            {{ formatReviewDate(review.createdAt) }}
          </span> -->
          </div>
          <div class="flex items-center text-yellow-500 mb-2">
            <span
              v-for="star in 5"
              :key="star"
              class="text-xl"
              :class="{
                'text-yellow-400': review.rating >= star,
                'text-gray-300': review.rating < star
              }"
              >★</span
            >
          </div>
          <p class="text-gray-700">{{ review.comment }}</p>
        </div>

        <!-- Pagination Button -->
        <button
          v-if="state.currentPage < state.totalPages - 1"
          @click="loadMoreReviews"
          class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Load More Reviews
        </button>
      </div>

      <!-- Submit Review Form -->
      <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h4 class="text-xl font-semibold text-gray-800 mb-4">Submit Your Review</h4>

        <div class="space-y-4">
          <!-- Rating System with 5 stars -->
          <div class="flex items-center">
            <span
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              class="text-3xl cursor-pointer"
              :class="{
                'text-yellow-400': newReview.rating >= star,
                'text-gray-300': newReview.rating < star
              }"
            >
              ★
            </span>
          </div>

          <!-- Review Textarea -->
          <textarea
            v-model="newReview.comment"
            placeholder="Write your review here..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>

          <!-- Submit Button -->
          <button
            @click="submitReview"
            :disabled="!newReview.rating || !newReview.comment"
            class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Send Review
          </button>
        </div>
      </div>
    </div>

    <div class="container lg:mt-24 mb-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <div class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Related Companies
        </div>
        <p class="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <CompanyList :companies="state.companies" :pagination="false" />
    </div>
    <CardExploreJob />
  </section>
</template>
