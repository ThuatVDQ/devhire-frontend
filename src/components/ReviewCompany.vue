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
  }
})

const newReview = reactive({
  rating: 0,
  comment: ''
})

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

const formatReviewDate = (createdAt) => {
  const date = parseISO(createdAt)
  return formatDistanceToNow(date, { addSuffix: true })
}

const loadMoreReviews = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchReviews()
  }
}

const setRating = (star) => {
  newReview.rating = star
}

const submitReview = async () => {
  const token = localStorage.getItem('token')
  if (token === null) {
    toastr.error('Please login to submit a review', 'Error')
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
    console.error('Error submitting review:', error)
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
    <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
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
