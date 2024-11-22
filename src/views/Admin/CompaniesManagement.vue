<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">
      Companies Management
    </h1>
  </header>

  <section class="p-6">
    <!-- Companies Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">Email</th>
            <th class="py-3 px-6">Phone</th>
            <th class="py-3 px-6">Address</th>
            <th class="py-3 px-6">Scale</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-base">
          <tr
            v-for="company in companies"
            :key="company.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 flex items-center">
              <img
                :src="`http://localhost:8090/uploads/${company.logo}`"
                alt="Logo"
                @error="(e) => (e.target.src = defaultAvatar)"
                class="w-6 h-6 rounded-full mr-2"
              />
              {{ company.name }}
            </td>
            <td class="py-3 px-6">{{ company.email }}</td>
            <td class="py-3 px-6">{{ company.phone }}</td>
            <td class="py-3 px-6">{{ company.address }}</td>
            <td class="py-3 px-6">{{ company.scale }}</td>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import defaultAvatar from '../../assets/logo.svg'

// State
const companies = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = ref(5)

// Fetch Companies API
const fetchCompanies = async (page = 0) => {
  try {
    const params = {
      page: page,
      limit: pageSize.value
    }

    const response = await axios.get('http://localhost:8090/api/companies', {
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
// Initial fetch on component mount
</script>
