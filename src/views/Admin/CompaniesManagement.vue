<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">
      Companies Management
    </h1>
  </header>

  <section class="p-6">
    <div class="flex justify-between mb-8">
      <div class="relative w-full max-w-lg flex">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          @keydown.enter="searchByKeyword"
          v-model="keyword"
          placeholder="Search by..."
          class="border rounded-xl p-2 pl-10 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchByKeyword"
          class="bg-emerald-600 text-white px-4 rounded-2xl ml-4 text-sm hover:bg-emerald-700"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Companies Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <div v-if="!companies.length" class="p-12">
        <img
          :src="icon_sad"
          alt="Empty Saved Jobs"
          class="mx-auto mb-4"
          style="width: 300px; height: auto"
        />
        <p class="text-gray-500 text-lg text-center">No results found. Please try again.</p>
      </div>
      <table v-else class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">License</th>
            <th class="py-3 px-6">Email</th>
            <th class="py-3 px-6">Phone</th>
            <th class="py-3 px-6">Status</th>
            <th class="py-3 px-6">Address</th>
            <th class="py-3 px-6">Scale</th>
            <th class="py-3 px-6">Total Jobs</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-base">
          <tr
            v-for="company in companies"
            :key="company.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 overflow-hidden text-ellipsis">
              <img
                :src="`http://localhost:8090/uploads/${company.logo}`"
                alt="Logo"
                @error="(e) => (e.target.src = defaultAvatar)"
                class="w-10 h-10 rounded-full mr-2"
              />
              <span class="cursor-pointer" @click="goToDetail(company.id)">{{ company.name }}</span>
            </td>
            <td class="py-3 px-6">
              <template v-if="!company.business_license">
                <!-- Trường hợp chưa có License -->
                <span class="text-gray-500 italic">Not Available</span>
              </template>

              <template v-else-if="company.business_license.endsWith('.pdf')">
                <!-- Hiển thị nút mở PDF -->
                <a
                  :href="`http://localhost:8090/uploads/${company.business_license}`"
                  target="_blank"
                  class="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <i class="pi pi-file-pdf text-red-500 text-2xl mr-2"></i>
                  <span>View License</span>
                </a>
              </template>

              <template v-else>
                <!-- Hiển thị ảnh nếu không phải PDF -->
                <img
                  :src="`http://localhost:8090/uploads/${company.business_license}`"
                  alt="License"
                  class="w-10 h-10 rounded-full"
                />
              </template>
            </td>
            <td class="py-3 px-6">{{ company.email }}</td>
            <td class="py-3 px-6">{{ company.phone }}</td>
            <td class="py-3 px-6">
              <span
                class="px-2 py-1 rounded text-white text-sm font-semibold"
                :class="{
                  'bg-yellow-500': company.company_status === 'PENDING',
                  'bg-green-500': company.company_status === 'ACTIVE',
                  'bg-red-500': company.company_status === 'REJECTED',
                  'bg-gray-500': !['PENDING', 'ACTIVE', 'REJECTED'].includes(company.company_status) // Màu mặc định
                }"
              >
                {{ company.company_status }}
              </span>
            </td>
            <td class="py-3 px-6">{{ company.address }}</td>
            <td class="py-3 px-6">{{ company.scale }}</td>
            <td class="py-3 px-6">{{ company.totalJob }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <nav aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <!-- Previous Button -->
            <li>
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-l-full border border-gray-300"
                @click.prevent="changePage(currentPage - 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage <= 0 }"
              >
                <i class="pi pi-angle-left"></i>
              </a>
            </li>
            <!-- Page Numbers -->
            <li v-for="page in totalPages" :key="page">
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center border border-gray-300"
                :class="{
                  'bg-emerald-600 text-white': currentPage === page - 1,
                  'bg-white text-gray-700': currentPage !== page - 1
                }"
                @click.prevent="changePage(page - 1)"
              >
                {{ page }}
              </a>
            </li>
            <!-- Next Button -->
            <li>
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-r-full border border-gray-300"
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
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import defaultAvatar from '../../assets/logo.svg'
import icon_sad from '@/assets/icon-sad.png'

const router = useRouter()
// State
const companies = ref([])
const currentPage = ref(0)
const keyword = ref('')
const totalPages = ref(1)
const pageSize = ref(5)

const searchByKeyword = () => {
  fetchCompanies(0)
}

watch(keyword, (newKeyword) => {
  if (newKeyword === '') {
    fetchCompanies(0)
  }
})

// Fetch Companies API
const fetchCompanies = async (page = 0) => {
  try {
    const params = {
      page: page,
      limit: pageSize.value
    }

    if (keyword.value.trim() !== '') {
      params.keyword = keyword.value.trim() // Thêm từ khóa tìm kiếm
    }

    const response = await axios.get('http://localhost:8090/api/companies/search', {
      params: params,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    // Update state
    companies.value = response.data.companies
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    companies.value = []
    totalPages.value = 0
    currentPage.value = 0
    console.error('Error fetching companies:', error)
  }
}

// Change page handler
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchCompanies(page)
  }
}
fetchCompanies()

const goToDetail = (id) => {
  router.push({ name: 'admin-companies-detail', params: { id: id } })
}
// Initial fetch on component mount
</script>
