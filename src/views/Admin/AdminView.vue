<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SideBar />

    <!-- Content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import SideBar from './SideBar.vue'
import { onMounted } from 'vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token || token === 'null') {
    toastr.error('Please login to access this page', 'Error')
    router.push('/recruiter/login')
  }
})
</script>
