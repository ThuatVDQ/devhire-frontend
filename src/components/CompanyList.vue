<script setup>
import CardCompany from './CardCompany.vue'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import icon_sad from '@/assets/icon-sad.png'

const props = defineProps({
  keyword: {
    type: String,
    required: true
  }
})

const companies = ref([])
const currentPage = ref(0)
const pageSize = ref(8)
const totalPages = ref(0)
const isLoading = ref(true)

const searchCompanies = async (keyword, page = 0) => {
  isLoading.value = true
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')

    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const response = await axios.get('http://localhost:8090/api/companies/search', {
      params: { keyword, page, limit: pageSize.value },
      headers
    })

    companies.value = response.data.companies
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error searching companies:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch theo dõi sự thay đổi của `keyword` và gọi API tìm kiếm khi `keyword` thay đổi
watch(
  () => props.keyword,
  (newKeyword) => {
    if (newKeyword.trim()) {
      searchCompanies(newKeyword, 0) // Reset trang về 0 và tìm kiếm lại
    } else {
      fetchData(0) // Nếu không có từ khóa, gọi lại hàm fetchData để lấy tất cả công ty
    }
  }
)

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token')

    // Cấu hình headers chỉ khi có token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const response = await axios.get('http://localhost:8090/api/companies', {
      params: { page, limit: pageSize.value },
      headers
    })

    companies.value = response.data.companies
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching companies:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    if (props.keyword.trim()) {
      searchCompanies(props.keyword, page) // Gọi API tìm kiếm với từ khóa khi thay đổi trang
    } else {
      fetchData(page) // Gọi API lấy tất cả công ty nếu không có từ khóa
    }
    scrollToTop()
  }
}

onMounted(() => {
  fetchData(currentPage.value)
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
  })
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center">
    <div
      class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
    ></div>
  </div>
  <div v-else>
    <div v-if="!companies.length" class="">
      <img
        :src="icon_sad"
        alt="Empty Saved Jobs"
        class="mx-auto mb-4"
        style="width: 300px; height: auto"
      />
      <p class="text-gray-500 text-lg text-center">No results found. Please try again.</p>
    </div>
    <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
      <CardCompany v-for="company in companies" :key="company.id" :company="company" />
    </div>

    <!-- Phân trang -->
    <div v-if="totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <nav aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white rounded-s-3xl"
                @click.prevent="changePage(currentPage - 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage <= 0 }"
              >
                <i class="pi pi-angle-left"></i>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page">
              <a
                href="#"
                class="size-[40px] inline-flex justify-center items-center"
                @click.prevent="changePage(page - 1)"
                :class="{ 'bg-emerald-600 text-white': currentPage === page - 1 }"
              >
                {{ page }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white rounded-e-3xl"
                @click.prevent="changePage(currentPage + 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage >= totalPages - 1 }"
              >
                <i class="pi pi-angle-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
