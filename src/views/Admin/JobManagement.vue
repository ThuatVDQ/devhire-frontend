<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">Jobs Management</h1>
  </header>

  <div class="mb-2 px-6">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="filter in filters"
        :key="filter"
        @click="toggleFilter(filter)"
        :class="{
          'bg-gray-600 text-white': selectedFilters.includes(filter),
          'bg-gray-200 text-gray-600': !selectedFilters.includes(filter)
        }"
        class="cursor-pointer px-4 py-1 rounded-full text-sm"
      >
        {{ filter }}
      </span>
    </div>
  </div>

  <section class="p-6">
    <!-- Search Section -->
    <div class="flex items-center justify-between mb-4">
      <div class="relative w-1/3">
        <input
          type="text"
          placeholder="Search jobs..."
          v-model="searchQuery"
          @input="fetchData"
          class="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
        />
        <i
          class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <!-- Tailwind Spinner -->
      <div
        class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Jobs Table -->
    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full text-left" :class="{ 'opacity-50 pointer-events-none': isLoading }">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-center">
              <input type="checkbox" @change="selectAll" v-model="selectAllCheckbox" />
            </th>
            <th class="py-3 px-6">Title</th>
            <th class="py-3 px-6">Company</th>
            <th class="py-3 px-6">Created At</th>
            <th class="py-3 px-6">Location</th>
            <th class="py-3 px-6">Status</th>
            <th class="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm">
          <tr
            v-for="(job, index) in jobs"
            :key="job.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-center">
              <input type="checkbox" v-model="job.selected" />
            </td>
            <td class="py-3 px-6">
              <span class="cursor-pointer" @click="goToJobDetail(job.id)">
                {{ job.title }}
              </span>
            </td>
            <td class="py-3 px-6">{{ job.company.name }}</td>
            <td class="py-3 px-6">{{ formatDate(job.deadline) }}</td>
            <td class="py-3 px-6">
              {{ job.addresses.map((address) => address.city).join(', ') }}
            </td>
            <td class="py-3 px-6">
              <span
                :class="{
                  'bg-orange-400': job.status === 'PENDING',
                  'bg-emerald-500': job.status === 'OPEN',
                  'bg-red-500': job.status === 'CLOSED',
                  'bg-blue-500': job.status === 'HOT',
                  'bg-gray-500': job.status === 'REJECTED'
                }"
                class="text-white px-2 py-1 rounded-full text-xs w-20 text-center inline-block"
              >
                {{ job.status }}
              </span>
            </td>
            <td class="py-3 px-6">
              <button
                class="text-blue-500 hover:underline mr-4"
                @click="showDialog('approve', job.id)"
              >
                Approve
              </button>
              <button
                class="text-gray-500 hover:underline mr-4"
                @click="showDialog('reject', job.id)"
              >
                Reject
              </button>
              <button class="text-red-500 hover:underline" @click="showDialog('close', job.id)">
                Close
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <nav aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
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

  <ConfirmationDialog
    :isVisible="isDialogVisible"
    :message="dialogMessage"
    @confirm="onConfirm"
    @cancel="closeDialog"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const filters = ref(['All', 'Pending', 'Open', 'Closed', 'Hot', 'Rejected']) // Thêm 'All' vào danh sách bộ lọc
const selectedFilters = ref(['All'])

const jobs = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = ref(5) // Số lượng công việc mỗi trang
const selectAllCheckbox = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:8090/api/jobs', {
      params: { page, limit: pageSize.value }
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
    console.log(response.data.jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const isDialogVisible = ref(false)
const dialogMessage = ref('')
const currentJobId = ref(null)
const currentAction = ref('')

function showDialog(action, jobId) {
  currentJobId.value = jobId
  currentAction.value = action
  isDialogVisible.value = true

  // Set message based on action
  if (action === 'approve') {
    dialogMessage.value = 'Are you sure you want to approve this job?'
  } else if (action === 'reject') {
    dialogMessage.value = 'Are you sure you want to reject this job?'
  }
}

function onConfirm() {
  if (currentAction.value === 'approve') {
    approveJob(currentJobId.value)
  } else if (currentAction.value === 'reject') {
    rejectJob(currentJobId.value)
  }
  closeDialog()
}

function closeDialog() {
  isDialogVisible.value = false
  currentJobId.value = null
  currentAction.value = ''
}

async function approveJob(jobId) {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/approve`, null)

    if (response.status === 200) {
      fetchData(currentPage.value)
    }
  } catch (error) {
    toastr.error(error.response.data, 'Error: ')
  }
}

async function rejectJob(jobId) {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/reject`, null)

    if (response.status === 200) {
      fetchData(currentPage.value) // Làm mới danh sách sau khi từ chối
    }
  } catch (error) {
    toastr.error(error.response.data, 'Error: ')
  }
}

function changePage(page) {
  if (page >= 0 && page < totalPages.value) {
    fetchData(page)
  }
}

function selectAll() {
  jobs.value.forEach((job) => {
    job.selected = selectAllCheckbox.value
  })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function goToJobDetail(jobId) {
  router.push({ name: 'admin-detail-job', params: { id: jobId } })
}

onMounted(() => fetchData(currentPage.value))
</script>
