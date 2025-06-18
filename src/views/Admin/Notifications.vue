<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-11 py-10 text-center">
      Notifications
    </h1>
  </header>
  <div class="container">
    <NotificationsView :notifications="notifications" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import NotificationsView from '@/components/NotificationsView.vue'
import { initializeWebSocket, disconnectWebSocket } from '@/utils/websocket'

const API_URL = import.meta.env.VITE_APP_API_URL

// State để lưu danh sách thông báo
const notifications = ref([])

// Hàm gọi API để lấy danh sách thông báo
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token') // Lấy token từ localStorage

    const response = await axios.get(`${API_URL}/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào tiêu đề
      }
    })

    notifications.value = response.data || []
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

const handleNewNotification = () => {
  fetchNotifications()
}

onMounted(() => {
  fetchNotifications()

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
