<script setup>
import { ref, onMounted, onUnmounted, watchEffect, nextTick } from 'vue'
import axios from 'axios'
import CardJob from './CardJob.vue'
import CardJobRecommend from './CardJobRecommend.vue'

const recommendedJobs = ref([])
const isLoading = ref(true)

let autoScrollInterval = null
const scrollSpeed = 1
const scrollIntervalDuration = 1000

const fetchRecommendedJobs = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      recommendedJobs.value = []
      return
    }

    const response = await axios.get('http://localhost:8090/api/recommendations', {
      params: { topK: 10 },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Recommended jobs response:', response.data)
    recommendedJobs.value = response.data || []
  } catch (error) {
    console.error('Error fetching recommended jobs:', error)
    recommendedJobs.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRecommendedJobs()
})

const scrollContainer = ref(null)

const scrollAmount = 350 // Số pixel cuộn mỗi lần

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

const startAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval) // Xóa interval cũ nếu có
  }

  if (!scrollContainer.value) {
    console.warn('scrollContainer is not available yet for auto-scroll.')
    return
  }

  autoScrollInterval = setInterval(() => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value

    // Thêm một ngưỡng nhỏ để xử lý lỗi làm tròn số khi so sánh
    if (scrollLeft + clientWidth >= scrollWidth - 1) {
      scrollContainer.value.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      scrollContainer.value.scrollBy({
        left: scrollSpeed,
        behavior: 'auto'
      })
    }
  }, scrollIntervalDuration)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

const setupScrollListeners = () => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('mouseenter', stopAutoScroll)
    scrollContainer.value.removeEventListener('mouseleave', startAutoScroll)
  }

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('mouseenter', stopAutoScroll)
    scrollContainer.value.addEventListener('mouseleave', startAutoScroll)
  }
}

onMounted(() => {
  fetchRecommendedJobs()
})

watchEffect(() => {
  if (!isLoading.value && recommendedJobs.value.length > 0) {
    nextTick(() => {
      startAutoScroll()
      setupScrollListeners()
    })
  } else if (!isLoading.value && recommendedJobs.value.length === 0) {
    stopAutoScroll()
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('mouseenter', stopAutoScroll)
      scrollContainer.value.removeEventListener('mouseleave', startAutoScroll)
    }
  }
})

onUnmounted(() => {
  stopAutoScroll()
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('mouseenter', stopAutoScroll)
    scrollContainer.value.removeEventListener('mouseleave', startAutoScroll)
  }
})
</script>
<template>
  <div v-if="!isLoading && recommendedJobs.length" class="container relative">
    <h2 class="text-2xl font-semibold my-4">Jobs Recommended For You</h2>

    <button
      @click="scrollLeft"
      @mouseenter="stopAutoScroll"
      @mouseleave="startAutoScroll"
      class="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hidden md:block"
      aria-label="Scroll left"
    >
      <i class="pi pi-chevron-left text-lg"></i>
    </button>
    <button
      @click="scrollRight"
      @mouseenter="stopAutoScroll"
      @mouseleave="startAutoScroll"
      class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hidden md:block"
      aria-label="Scroll right"
    >
      <i class="pi pi-chevron-right text-lg"></i>
    </button>

    <div
      ref="scrollContainer"
      @mouseenter="stopAutoScroll"
      @mouseleave="startAutoScroll"
      class="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory"
    >
      <CardJobRecommend
        v-for="job in recommendedJobs"
        :key="job.id"
        :job="job"
        class="flex-none w-80 snap-center"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ẩn thanh cuộn cho trình duyệt WebKit (Chrome, Safari, Edge) */
.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Hoặc height: 0; */
}

/* Ẩn thanh cuộn cho Firefox */
.custom-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
