<template>
  <p
    class="text-blue-500 text-right underline cursor-pointer mt-4 mb-4"
    @click="markAllAsRead(notifications)"
  >
    Mark all as read
  </p>

  <div class="bg-white shadow-md rounded-lg p-4">
    <ul>
      <li
        v-for="notification in notifications"
        :key="notification.id"
        :class="{
          'p-2 border-b last:border-0 flex justify-between items-center cursor-pointer': true, // Con trỏ chuột bàn tay
          'bg-gray-100': !notification.is_read // Nền xám nếu chưa đọc
        }"
        @click="markAsRead(notification)"
      >
        <!-- Nội dung thông báo -->
        <div class="flex-1">
          <p class="text-base text-gray-500">{{ notification.message }}</p>
          <p class="text-sm text-gray-400 mt-1">
            {{ formatTimeAgo(notification.send_at) }}
          </p>
        </div>

        <!-- Dấu chấm xanh -->
        <div
          v-if="!notification.is_read"
          class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 ml-2"
        ></div>
        <button
          v-if="notification.is_read"
          @click.stop="deleteNotification(notification.id)"
          class="text-red-500 ml-2"
        >
          <i class="pi pi-times"></i>
        </button>
      </li>
    </ul>
    <div v-if="notifications.length === 0" class="text-center text-gray-500 py-4">
      No notifications available.
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'
import axios from 'axios'
import { ref } from 'vue'

// Hàm định dạng thời gian thành dạng "x phút trước"
const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString * 1000)
  return formatDistanceToNow(date, { addSuffix: true })
}

// Props
const props = defineProps({
  notifications: {
    type: Array,
    required: true,
    default: () => []
  }
})

const markAsRead = async (notification) => {
  try {
    const response = await axios.put(
      `http://localhost:8090/api/notifications/${notification.id}/read`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

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
const markAllAsRead = async (notifications) => {
  try {
    const token = localStorage.getItem('token') // Lấy token từ localStorage

    // Gửi yêu cầu PUT đến API
    const response = await axios.put(
      'http://localhost:8090/api/notifications/mark-all-read',
      null,
      {
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong tiêu đề
        }
      }
    )
    for (const notification of notifications) {
      notification.is_read = true
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8090/api/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const index = props.notifications.findIndex(
      (notification) => notification.id === notificationId
    )
    if (index !== -1) {
      props.notifications.splice(index, 1) // Xóa thông báo trong mảng
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}
</script>
