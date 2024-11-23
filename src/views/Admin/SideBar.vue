<template>
  <div>
    <!-- Toggle button, only visible when sidebar is collapsed -->
    <button
      v-if="isCollapsed"
      @click="toggleSidebar"
      class="fixed top-20 left-0 z-20 bg-white rounded-full p-2 shadow focus:outline-none"
    >
      <i class="pi pi-list text-lg"></i>
    </button>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed bg-gray-800 text-gray-100 transition-all duration-300 h-screen z-10',
        isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
      ]"
    >
      <div v-if="!isCollapsed" class="p-4">
        <!-- Close Button (inside the sidebar) -->
        <div class="flex items-center justify-between">
          <button @click="toggleSidebar" class="focus:outline-none">
            <i class="pi pi-times text-xl"></i>
          </button>
          <span class="text-xl font-semibold">DevHire</span>
        </div>

        <!-- Logo and Sidebar Title -->
        <div class="flex items-center mt-4">
          <img src="@/assets/logo.svg" alt="DevHire Logo" class="w-8 h-8 mr-3" />
          <span class="text-xl font-semibold">DevHire</span>
        </div>

        <!-- Search Box -->
        <div class="mt-4">
          <div class="relative text-gray-600 focus-within:text-gray-400">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <i class="pi pi-search text-gray-500"></i>
            </span>
            <input
              v-model="searchQuery"
              type="search"
              class="py-2 text-sm text-white bg-gray-700 rounded-md pl-10 focus:outline-none w-full"
              placeholder="Search..."
            />
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-6 space-y-2">
          <RouterLink
            v-for="item in filteredMenuItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center p-2 rounded transition duration-200 hover:bg-gray-700"
            active-class="bg-gray-700"
            @click="item.name === 'Notifications' && viewNotifications()"
          >
            <i :class="item.icon" class="mr-3"></i>
            <span>{{ item.name }}</span>
            <span
              v-if="item.name === 'Notifications' && newNotification"
              class="absolute right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ unreadCount }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <main :class="isCollapsed ? 'ml-0' : 'ml-64'">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { initializeWebSocket, disconnectWebSocket } from '@/utils/websocket'
import axios from 'axios'

const isCollapsed = ref(false) // Trạng thái của sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const searchQuery = ref('') // Từ khóa tìm kiếm

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-home' },
  { name: 'Users', path: '/admin/users', icon: 'pi pi-users' },
  { name: 'Jobs', path: '/admin/jobs', icon: 'pi pi-briefcase' },
  { name: 'Companies', path: '/admin/companies', icon: 'pi pi-building' },
  { name: 'Notifications', path: '/admin/notifications', icon: 'pi pi-bell' }
]

// Lọc danh sách menu theo từ khóa tìm kiếm
const filteredMenuItems = computed(() => {
  if (!searchQuery.value.trim()) return menuItems
  return menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const unreadCount = ref(0)
const newNotification = ref(false)
const fetchUnreadCount = async () => {
  try {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    const response = await axios.get('http://localhost:8090/api/notifications/unread-count', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    unreadCount.value = response.data
  } catch (error) {
    console.error('Error fetching unread notification count:', error)
  }
}

const handleNewNotification = () => {
  fetchUnreadCount()
  newNotification.value = true // Cập nhật số lượng thông báo chưa đọc từ API
}

const viewNotifications = () => {
  newNotification.value = false // Khi xem thông báo, đặt cờ về false
}

onMounted(() => {
  fetchUnreadCount()

  // Kết nối WebSocket và lắng nghe thông báo
  const username = localStorage.getItem('username')
  if (username) {
    initializeWebSocket(username, handleNewNotification)
  }
})

onBeforeUnmount(() => {
  disconnectWebSocket() // Ngắt kết nối WebSocket khi component bị hủy
})
</script>
