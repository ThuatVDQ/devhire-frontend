<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { formatDistanceToNow, parseISO } from 'date-fns'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const newReview = reactive({
  rating: 0,
  comment: ''
})

const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token // Trả về true nếu có token, false nếu không
}

// Hàm xử lý hành động khi người dùng chưa đăng nhập
const handleLoginRequired = () => {
  toastr.error('Please login to continue.', 'Error') // Thông báo tổng quát hơn
  localStorage.setItem('redirectAfterLogin', window.location.pathname) // Lưu đường dẫn hiện tại
  setTimeout(() => {
    window.location.href = '/login' // Chuyển hướng
  }, 1000)
}

// Hàm được gọi khi focus vào textarea
const handleTextareaFocus = (event) => {
  if (!isAuthenticated()) {
    event.target.blur() // Bỏ focus khỏi textarea
    handleLoginRequired()
  }
}

// Hàm được gọi khi click vào ngôi sao
const setRating = (star) => {
  if (isAuthenticated()) {
    // Nếu đã đăng nhập, cho phép đặt rating
    newReview.rating = star
  } else {
    // Nếu chưa đăng nhập, xử lý yêu cầu đăng nhập
    handleLoginRequired()
  }
}

const reviews = ref([])
const currentPage = ref(0)
const totalPages = ref(0)

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:8090/api/reviews/${props.companyId}`, {
      params: { page: currentPage.value, limit: 5 }
    })
    reviews.value = response.data.company_reviews
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Error fetching reviews:', error)
  }
}

const formatReviewDate = (created_at) => {
  try {
    const [year, month, day, hour, minute, second] = created_at
    const date = new Date(year, month - 1, day, hour, minute, second)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (e) {
    return 'Invalid date'
  }
}

const loadMoreReviews = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchReviews()
  }
}

const submitReview = async () => {
  if (!isAuthenticated()) {
    toastr.error('Please login to submit a review', 'Error')
    handleLoginRequired()
    return
  }
  if (newReview.rating === 0 || !newReview.comment.trim()) {
    toastr.info('Please provide a rating and a comment.', 'Info')
    return
  }
  try {
    await axios.post(
      `http://localhost:8090/api/reviews/${props.companyId}`,
      { rating: newReview.rating, comment: newReview.comment },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    newReview.rating = 0
    newReview.comment = ''
    fetchReviews()
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toastr.error('Session expired. Please login again.', 'Error')
      localStorage.removeItem('token')
      handleLoginRequired()
    } else {
      toastr.error('Failed to submit review. Please try again.', 'Error')
    }
  }
}

onMounted(() => {
  fetchReviews()
})
</script>
<template>
  <div class="">
    <!-- Reviews Section -->

    <!-- Display Reviews if available -->
    <div v-if="reviews" class="space-y-6">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="review-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      >
        <div class="flex space-x-3 items-center">
          <h4 class="text-lg font-semibold text-gray-800">{{ review.full_name }}</h4>
          <span class="text-sm text-gray-500">
            {{ formatReviewDate(review.created_at) }}
          </span>
        </div>
        <div class="flex items-center text-yellow-500 mb-2">
          <span
            v-for="star in 5"
            :key="star"
            class="text-lg"
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
        v-if="currentPage < totalPages - 1"
        @click="loadMoreReviews"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Load More Reviews
      </button>
    </div>

    <!-- Submit Review Form -->
    <div v-if="!props.isAdmin" class="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h4 class="text-lg font-semibold text-gray-800 mb-4">Submit Your Review</h4>

      <div class="space-y-4">
        <!-- Rating System with 5 stars -->
        <div class="flex items-center">
          <span
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            class="text-xl cursor-pointer"
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
          @focus="handleTextareaFocus"
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
</template>
