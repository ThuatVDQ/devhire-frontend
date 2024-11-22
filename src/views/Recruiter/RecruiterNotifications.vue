<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10 text-center">
      Notifications
    </h1>
  </header>
  <div class="container">
    <NotificationsView :notifications="notifications" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NotificationsView from '@/components/NotificationsView.vue'

// State để lưu danh sách thông báo
const notifications = ref([])

// Hàm gọi API để lấy danh sách thông báo
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token') // Lấy token từ localStorage

    const response = await axios.get('http://localhost:8090/api/notifications/', {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào tiêu đề
      }
    })

    notifications.value = response.data || []
    console.log(notifications.value)
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

// Gọi API khi component được mount
onMounted(() => {
  fetchNotifications()
})
</script>
