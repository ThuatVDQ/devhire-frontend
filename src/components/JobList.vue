<script setup>
import { reactive, computed } from 'vue'
import CardJob from './CardJob.vue'

const props = defineProps({
  jobs: {
    type: Array,
    required: true
  },
  container: {
    type: String,
    default: 'container md:mt-24'
  },
  pagination: {
    type: Boolean,
    default: true
  }
})

// Thiết lập state cho phân trang
const state = reactive({
  currentPage: 1,
  itemsPerPage: 5 // Số công việc hiển thị trên mỗi trang
})

// Tính tổng số trang
const totalPages = computed(() => Math.ceil(props.jobs.length / state.itemsPerPage))

// Lấy các công việc cho trang hiện tại
const paginatedJobs = computed(() => {
  const start = (state.currentPage - 1) * state.itemsPerPage
  const end = start + state.itemsPerPage
  return props.jobs.slice(start, end)
})

// Chuyển đến trang trước đó
const prevPage = () => {
  if (state.currentPage > 1) {
    state.currentPage--
    scrollToTop()
  }
}

// Chuyển đến trang kế tiếp
const nextPage = () => {
  if (state.currentPage < totalPages.value) {
    state.currentPage++
    scrollToTop()
  }
}

// Chuyển đến một trang cụ thể
const goToPage = (page) => {
  state.currentPage = page
  scrollToTop()
}

// Hàm cuộn lên đầu danh sách công việc
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
  })
}
</script>

<template>
  <div :class="`${container}`">
    <div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px] auto-rows-fr">
      <CardJob v-for="job in paginatedJobs" :key="job.id" :job="job" />
    </div>
    <div v-if="pagination && totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <nav aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <button
                @click="prevPage"
                :disabled="state.currentPage === 1"
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-s-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
              >
                <i class="pi pi-angle-left"></i>
              </button>
            </li>
            <li v-for="page in totalPages" :key="page">
              <button
                @click="goToPage(page)"
                :class="{
                  'bg-emerald-600 text-white': page === state.currentPage,
                  'text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600':
                    page !== state.currentPage
                }"
                class="size-[40px] inline-flex justify-center items-center"
              >
                {{ page }}
              </button>
            </li>
            <li>
              <button
                @click="nextPage"
                :disabled="state.currentPage === totalPages"
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-e-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
              >
                <i class="pi pi-angle-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
