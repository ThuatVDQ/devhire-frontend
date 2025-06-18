<template>
  <div class="relative" ref="notificationPopup">
    <!-- Biểu tượng chuông -->
    <button @click="toggleNotifications" class="relative focus:outline-none">
      <i class="pi pi-bell text-gray-500 text-3xl"></i>
      <span
        v-if="newNotifications"
        class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full transform translate-x-1/2 -translate-y-1/2"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Popup thông báo -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-[28rem] bg-white shadow-xl rounded-2xl z-50"
    >
      <div
        class="p-5 border-b text-xl font-semibold text-gray-800 flex justify-between items-center @click.stop bg-emerald-600"
      >
        <span>Notifications</span>
        <button class="text-white text-sm" @click="markAllAsRead">Mark all as read</button>
      </div>
      <ul class="max-h-96 overflow-y-auto">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'p-5 border-b last:border-b-0 flex justify-between items-center',
            notification.is_read ? 'bg-white' : 'bg-gray-100 font-semibold'
          ]"
          @click="markAsRead(notification)"
        >
          <div>
            <p :class="notification.is_read ? 'text-gray-600' : 'text-gray-900'">
              {{ notification.message }}
            </p>
            <p class="text-gray-500 text-sm">{{ formatTimeAgo(notification.send_at) }}</p>
          </div>
          <button class="text-red-500 text-sm" @click="deleteNotification(notification.id)">
            <i class="pi pi-times"></i>
          </button>
        </li>
      </ul>
      <div v-if="!notifications.length" class="p-4 text-center text-gray-500">
        No new notifications
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { initializeWebSocket, disconnectWebSocket } from '@/utils/websocket'
import { formatDistanceToNow } from 'date-fns'

const API_URL = import.meta.env.VITE_APP_API_URL

const notifications = ref([]) // Lưu danh sách thông báo
const unreadCount = ref(0) // Số lượng thông báo chưa đọc
const newNotifications = ref(false) // Hiển thị chấm đỏ khi có thông báo mới
const showNotifications = ref(false) // Kiểm soát hiển thị popup
const token = localStorage.getItem('token') // Lấy token từ localStorage

const notificationPopup = ref(null)

// Hàm định dạng thời gian từ createdAt đến hiện tại
const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString * 1000)
  return formatDistanceToNow(date, { addSuffix: true })
}

// Toggle hiển thị popup và gọi API lấy thông báo
const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    newNotifications.value = false
    unreadCount.value = 0
    await fetchNotifications()
  }
}

// Gọi API lấy danh sách thông báo
const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    notifications.value = response.data
    console.log(notifications.value)
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

const markAsRead = async (notification) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${notification.id}/read`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (notification) {
      notification.is_read = true
    }
    // Chuyển hướng trang sau khi cập nhật thành công
    if (notification.targetUrl) {
      window.location.href = notification.targetUrl
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
  console.log('Notification marked as read:', notification)
}

// Gọi API đánh dấu tất cả thông báo là đã đọc
const markAllAsRead = async () => {
  try {
    await axios.put(
      `${API_URL}/notifications/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    notifications.value.forEach((notification) => {
      notification.is_read = true
    })
    showNotifications.value = false
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

// Gọi API xóa một thông báo
const deleteNotification = async (notificationId) => {
  try {
    await axios.delete(`${API_URL}/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== notificationId
    )
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

// Xử lý thông báo mới từ WebSocket
const addNotification = (notification) => {
  unreadCount.value += 1
  newNotifications.value = true
}

const handleClickOutside = (event) => {
  if (notificationPopup.value && !notificationPopup.value.contains(event.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

// Kết nối WebSocket khi component được mount
onMounted(() => {
  const username = localStorage.getItem('username')
  if (username) {
    initializeWebSocket(username, addNotification)
  }
})

// Ngắt kết nối WebSocket khi component bị hủy
onBeforeUnmount(() => {
  disconnectWebSocket()
})
</script>
