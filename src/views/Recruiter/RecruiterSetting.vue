<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Account Settings</h1>

    <div class="flex justify-center">
      <!-- Sidebar -->
      <div class="w-1/4 bg-gray-50 p-5 rounded-lg">
        <ul class="space-y-6">
          <li>
            <RouterLink to="/recruiter/settings/change-password" v-slot="{ isActive }">
              <div
                class="flex items-center text-gray-700 hover:text-emerald-500"
                :class="{ 'text-green-500 font-semibold': isActive }"
              >
                <i class="pi pi-lock mr-4"></i> Change Password
              </div>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/recruiter/settings/profile" v-slot="{ isActive }">
              <div
                class="flex items-center text-gray-700 hover:text-emerald-500"
                :class="{ 'text-green-500 font-semibold': isActive }"
              >
                <i class="pi pi-user mr-4"></i> Personal Information
              </div>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/recruiter/settings/company" v-slot="{ isActive }">
              <div
                class="flex items-center text-gray-700 hover:text-emerald-500"
                :class="{ 'text-green-500 font-semibold': isActive }"
              >
                <i class="pi pi-briefcase mr-4"></i> Company Information
              </div>
            </RouterLink>
          </li>
          <li
            @click="logout"
            class="flex items-center text-gray-700 hover:text-red-500 cursor-pointer"
          >
            <i class="pi pi-sign-out mr-4"></i> Logout
          </li>
        </ul>
      </div>

      <!-- Main content -->
      <div class="w-2/3 p-2 shadow-md rounded-lg">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username') // Remove the token from localStorage
  toastr.success('Logged out successfully')
  router.push('/recruiter/login') // Redirect to login page
}
</script>
