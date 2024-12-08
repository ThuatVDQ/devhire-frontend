<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">Jobs Management</h1>
  </header>

  <div class="mb-2 px-6">
    <div class="flex gap-2">
      <span
        v-for="filter in statusFilters"
        :key="filter.value"
        @click="toggleStatusFilter(filter.value)"
        :class="[
          selectedStatus === filter.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300'
        ]"
        class="cursor-pointer px-4 py-1 rounded-full text-sm w-24 text-center"
      >
        {{ filter.label }}
      </span>
    </div>
    <div class="flex gap-2 mt-2">
      <span
        v-for="filter in typeFilters"
        :key="filter.value"
        @click="toggleTypeFilter(filter.value)"
        :class="[
          selectedType === filter.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300'
        ]"
        class="cursor-pointer px-4 py-1 rounded-full text-sm w-24 text-center"
      >
        {{ filter.label }}
      </span>
    </div>
    <div class="flex justify-between mt-2">
      <div class="relative w-full max-w-sm flex">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          @keydown.enter="searchByKeyword"
          v-model="searchQuery"
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
  </div>

  <section class="px-6 pb-6">
    <div class="flex justify-end mb-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded-2xl mr-2"
        @click="handleBulkAction('approve')"
      >
        Approve All
      </button>
      <button
        class="bg-red-600 text-white px-4 py-2 rounded-2xl mr-2"
        @click="handleBulkAction('reject')"
      >
        Reject All
      </button>
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded-2xl"
        @click="handleBulkAction('close')"
      >
        Close All
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <!-- Tailwind Spinner -->
      <div
        class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Jobs Table -->
    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg pb-4">
      <div v-if="!jobs.length" class="">
        <img
          :src="icon_sad"
          alt="Empty Jobs"
          class="mx-auto mb-4"
          style="width: 300px; height: auto"
        />
        <p class="text-gray-500 text-lg text-center">No results found. Please try again.</p>
      </div>
      <table
        v-else
        class="min-w-full text-left"
        :class="{ 'opacity-50 pointer-events-none': isLoading }"
      >
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-center">
              <input type="checkbox" @change="selectAll" v-model="selectAllCheckbox" />
            </th>
            <th class="py-3 px-6">Title</th>
            <th class="py-3 px-6">Company</th>
            <th class="py-3 px-6">Deadline</th>
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
              <!-- Kiểm tra trạng thái và hiển thị nút tương ứng -->
              <template v-if="job.status === 'PENDING'">
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
              </template>
              <template v-else-if="job.status === 'OPEN' || job.status === 'HOT'">
                <button class="text-red-500 hover:underline" @click="showDialog('close', job.id)">
                  Close
                </button>
              </template>
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
import icon_sad from '@/assets/icon-sad.png'

const router = useRouter()

const searchQuery = ref('')
const selectedStatus = ref('')
const statusFilters = ref([
  { label: 'Hot', value: 'HOT' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Closed', value: 'CLOSED' }
]) // Thêm 'All' vào danh sách bộ lọc

const selectedType = ref('')
const typeFilters = ref([
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Part-time', value: 'PART_TIME' },
  { label: 'Internship', value: 'INTERNSHIP' }
])

const toggleStatusFilter = (status) => {
  selectedStatus.value = selectedStatus.value === status ? '' : status
  fetchData(0)
}

const toggleTypeFilter = (status) => {
  selectedType.value = selectedType.value === status ? '' : status
  fetchData(0)
}

const searchByKeyword = () => {
  fetchData(0) // Gọi lại API từ trang đầu tiên
}

const jobs = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = ref(10) // Số lượng công việc mỗi trang
const selectAllCheckbox = ref(false)
const isLoading = ref(false)
const selectedJobIds = ref([])

const fetchData = async (page = 0) => {
  isLoading.value = true
  try {
    const params = {
      page: page,
      limit: pageSize.value
    }

    // Kiểm tra filter để thêm tham số phù hợp
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    // Thêm status nếu có
    if (selectedType.value) {
      params.type = selectedType.value
    }

    if (searchQuery.value.trim() !== '') {
      params.keyword = searchQuery.value.trim() // Thêm từ khóa tìm kiếm
    }
    const response = await axios.get('http://localhost:8090/api/admin/getAllJobs', {
      params: params,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    jobs.value = response.data.jobs
    totalPages.value = response.data.totalPages
    currentPage.value = page
    console.log(response.data.jobs)
  } catch (error) {
    jobs.value = []
    console.error('Error fetching jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const isDialogVisible = ref(false)
const dialogMessage = ref('')
const currentJobId = ref(null)
const currentAction = ref('')
const currentBulkAction = ref(false)
function showDialog(action, jobId = null) {
  currentJobId.value = jobId
  currentAction.value = action
  isDialogVisible.value = true

  if (jobId) {
    // Hành động đơn lẻ
    currentBulkAction.value = false
    currentJobId.value = jobId
  } else {
    // Hành động hàng loạt
    currentBulkAction.value = true
    selectedJobIds.value = jobs.value.filter((job) => job.selected).map((job) => job.id)
  }

  // Set message based on action
  if (action === 'approve') {
    dialogMessage.value = currentBulkAction.value
      ? 'Are you sure you want to approve all selected jobs?'
      : 'Are you sure you want to approve this job?'
  } else if (action === 'reject') {
    dialogMessage.value = currentBulkAction.value
      ? 'Are you sure you want to reject all selected jobs?'
      : 'Are you sure you want to reject this job?'
  } else {
    dialogMessage.value = currentBulkAction.value
      ? 'Are you sure you want to close all selected jobs?'
      : 'Are you sure you want to close this job?'
  }
}

// function onConfirm() {
//   if (currentAction.value === 'approve') {
//     approveJob(currentJobId.value)
//   } else if (currentAction.value === 'reject') {
//     rejectJob(currentJobId.value)
//   } else {
//     closeJob(currentJobId.value)
//   }
//   closeDialog()
// }

async function onConfirm() {
  if (currentBulkAction.value) {
    // Hành động hàng loạt
    if (currentAction.value === 'approve') {
      await approveJobsBulk()
    } else if (currentAction.value === 'reject') {
      await rejectJobsBulk()
    } else {
      await closeJobsBulk()
    }
  } else {
    // Hành động đơn lẻ
    if (currentAction.value === 'approve') {
      await approveJob(currentJobId.value)
    } else if (currentAction.value === 'reject') {
      await rejectJob(currentJobId.value)
    } else {
      await closeJob(currentJobId.value)
    }
  }

  closeDialog()
}

function closeDialog() {
  isDialogVisible.value = false
  currentJobId.value = null
  currentAction.value = ''
}

async function closeJob(jobId) {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/expire`, null)

    if (response.status === 200) {
      fetchData(currentPage.value)
    }
  } catch (error) {
    toastr.error(error.response.data, 'Error: ')
  }
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

async function approveJobsBulk() {
  console.log(selectedJobIds.value)
  try {
    const response = await axios.post(
      'http://localhost:8090/api/jobs/approveJobs',
      selectedJobIds.value,
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      }
    )
    toastr.success(response.data, 'Success')
    fetchData(currentPage.value) // Làm mới dữ liệu
  } catch (error) {
    toastr.error(error.response?.data || 'Bulk approve failed.', 'Error')
  }
}

async function rejectJobsBulk() {
  console.log(selectedJobIds.value)

  try {
    const response = await axios.post(
      'http://localhost:8090/api/jobs/rejectJobs',
      selectedJobIds.value,
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      }
    )
    toastr.success(response.data, 'Success')
    fetchData(currentPage.value) // Làm mới dữ liệu
  } catch (error) {
    toastr.error(error.response?.data || 'Bulk reject failed.', 'Error')
  }
}

async function closeJobsBulk() {
  console.log(selectedJobIds.value)

  try {
    const response = await axios.post(
      'http://localhost:8090/api/jobs/closeJobs',
      selectedJobIds.value,
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      }
    )
    toastr.success(response.data, 'Success')
    fetchData(currentPage.value) // Làm mới dữ liệu
  } catch (error) {
    toastr.error(error.response?.data || 'Bulk close failed.', 'Error')
  }
}

const handleBulkAction = async (action) => {
  const jobIds = jobs.value.filter((job) => job.selected).map((job) => job.id)

  if (!jobIds.length) {
    toastr.warning('No jobs selected.', 'Warning')
    return
  }
  showDialog(action)
}

// Chọn tất cả công việc
const selectAll = () => {
  jobs.value.forEach((job) => {
    job.selected = selectAllCheckbox.value
  })
}

onMounted(() => fetchData(currentPage.value))
</script>
