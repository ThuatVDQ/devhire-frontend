<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">User Management</h1>
  </header>

  <section class="p-6">
    <!-- Filter Labels -->
    <div class="flex space-x-4">
      <div class="flex space-x-4 mb-4">
        <button
          v-for="roleFilter in roleFilters"
          :key="roleFilter.value"
          @click="toggleRoleFilter(roleFilter.value)"
          :class="[
            'px-4 py-2 rounded-full border text-sm w-26 text-center',
            currentRoleFilter === roleFilter.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          ]"
        >
          {{ roleFilter.label }}
        </button>
      </div>

      <!-- Status Filter -->
      <div class="flex space-x-4 mb-4">
        <button
          v-for="statusFilter in statusFilters"
          :key="statusFilter.value"
          @click="toggleStatusFilter(statusFilter.value)"
          :class="[
            'px-4 py-2 rounded-full border text-sm w-24',
            currentStatusFilter === statusFilter.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          ]"
        >
          {{ statusFilter.label }}
        </button>
      </div>
    </div>

    <!-- User Table -->

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <div v-if="!users.length" class="">
        <img
          :src="icon_sad"
          alt="Empty Jobs"
          class="mx-auto mb-4"
          style="width: 300px; height: auto"
        />
        <p class="text-gray-500 text-lg text-center">No results found. Please try again.</p>
      </div>
      <table v-else class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">ID</th>
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">Email</th>
            <th class="py-3 px-6">Role</th>
            <th class="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm">
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6">{{ user.id }}</td>
            <td class="py-3 px-6">
              <img
                :src="`http://localhost:8090/uploads/${user.avatar_url}`"
                alt="Logo"
                @error="(e) => (e.target.src = defaultAvatar)"
                class="w-6 h-6 rounded-full mr-2"
              /><span>{{ user.full_name }}</span>
            </td>
            <td class="py-3 px-6">{{ user.email }}</td>
            <td class="py-3 px-6">{{ user.role_name }}</td>
            <td class="py-3 px-6">
              <button
                v-if="user.status === 'ACTIVE'"
                class="text-red-700 hover:underline mr-4"
                @click="showDialog('block', user.id)"
              >
                Block
              </button>
              <button
                v-else
                class="text-emerald-500 hover:underline mr-4"
                @click="showDialog('unblock', user.id)"
              >
                Unblock
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
    <ConfirmationDialog
      :isVisible="isDialogVisible"
      :message="dialogMessage"
      @confirm="onConfirm"
      @cancel="closeDialog"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import defaultAvatar from '../../assets/avatar-default.svg'
import icon_sad from '@/assets/icon-sad.png'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const router = useRouter()
// State
const users = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = ref(5)
const currentRoleFilter = ref('')
const currentStatusFilter = ref('')

const isDialogVisible = ref(false)
const dialogMessage = ref('')
const currentUserId = ref(null)
const currentAction = ref('')

// Filters
const roleFilters = ref([
  { label: 'Recruiters', value: 2 }, // roleId = 2
  { label: 'Candidates', value: 3 } // roleId = 3
])

// Status Filters
const statusFilters = ref([
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
])

// Fetch Users API
const fetchUsers = async (page = 0) => {
  try {
    const params = {
      page: page,
      limit: pageSize.value
    }

    // Kiểm tra filter để thêm tham số phù hợp
    if (currentRoleFilter.value) {
      params.roleId = currentRoleFilter.value
    }

    // Thêm status nếu có
    if (currentStatusFilter.value) {
      params.status = currentStatusFilter.value
    }

    const response = await axios.get('http://localhost:8090/api/admin/getAllUsers', {
      params: params,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    // Update state
    users.value = response.data.users
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    users.value = []
    console.error('Error fetching users:', error)
  }
}

// Apply Filter
const toggleRoleFilter = (role) => {
  currentRoleFilter.value = currentRoleFilter.value === role ? '' : role
  fetchUsers(0) // Reset về trang 0 khi đổi filter
}

// Toggle Status Filter
const toggleStatusFilter = (status) => {
  currentStatusFilter.value = currentStatusFilter.value === status ? '' : status
  fetchUsers(0) // Reset về trang 0 khi đổi filter
}

function showDialog(action, userId) {
  currentUserId.value = userId
  currentAction.value = action
  isDialogVisible.value = true

  // Set message based on action
  if (action === 'block') {
    dialogMessage.value = 'Are you sure you want to block this user?'
  } else {
    dialogMessage.value = 'Are you sure you want to unblock this user?'
  }
}

function onConfirm() {
  if (currentAction.value === 'block') {
    blockUser(currentUserId.value)
  } else {
    unblockUser(currentUserId.value)
  }
  closeDialog()
}

function closeDialog() {
  isDialogVisible.value = false
  currentUserId.value = null
  currentAction.value = ''
}

const blockUser = async (userId) => {
  try {
    const response = await axios.post(
      'http://localhost:8090/api/admin/banUser',
      {},
      {
        params: { userId },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    toastr.success(response.data, 'Success')
    fetchUsers(currentPage.value) // Refresh danh sách người dùng
  } catch (error) {
    toastr.error(error.response?.data || 'Error banning user', 'Error')
  }
}

const unblockUser = async (userId) => {
  try {
    const response = await axios.post(
      'http://localhost:8090/api/admin/unbanUser',
      {},
      {
        params: { userId },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    toastr.success(response.data, 'Success')
    fetchUsers(currentPage.value) // Refresh danh sách người dùng
  } catch (error) {
    toastr.error(error.response?.data || 'Error unbanning user', 'Error')
  }
}

// Change page handler
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchUsers(page)
  }
}

// Initial fetch on component mount
onMounted(() => fetchUsers(0))
</script>
