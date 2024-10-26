<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Account Settings</h1>

    <div class="flex justify-center">
      <!-- Sidebar -->
      <div class="w-1/6 bg-gray-50 p-2 rounded-lg">
        <ul class="space-y-4">
          <li>
            <router-link
              to="/recruiter/settings/change-password"
              class="flex items-center text-gray-700 hover:text-green-500"
              :class="{
                'text-green-500 font-semibold':
                  $route.path === '/recruiter/settings/change-password'
              }"
            >
              <i class="pi pi-lock mr-2"></i> Change Password
            </router-link>
          </li>
          <li>
            <router-link
              to="/recruiter/settings/profile"
              class="flex items-center text-gray-700 hover:text-green-500"
              :class="{ 'text-green-500 font-semibold': $route.path === '/settings/personal' }"
            >
              <i class="pi pi-user mr-2"></i> Personal Information
            </router-link>
          </li>
          <li>
            <router-link
              to="/recruiter/settings/company"
              class="flex items-center text-gray-700 hover:text-green-500"
              :class="{ 'text-green-500 font-semibold': $route.path === '/settings/company' }"
            >
              <i class="pi pi-briefcase mr-2"></i> Company Information
            </router-link>
          </li>
          <li
            @click="logout"
            class="flex items-center text-gray-700 hover:text-red-500 cursor-pointer"
          >
            <i class="pi pi-sign-out mr-2"></i> Logout
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
import { useRoute, useRouter } from 'vue-router'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
const $route = useRoute()
const router = useRouter()
const logout = () => {
  localStorage.removeItem('token') // Remove the token from localStorage
  toastr.success('Logged out successfully')
  router.push('/recruiter/login') // Redirect to login page
}
</script>
