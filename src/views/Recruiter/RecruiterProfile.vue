<template>
  <div class="container mx-auto p-6">
    <div class="relative inline-block mb-6">
      <img
        :src="avatarSrc"
        @error="avatarSrc = defaultAvatar"
        alt="avatar"
        class="w-20 h-20 rounded-full object-cover"
      />
      <button class="absolute bottom-0 right-0 p-1 rounded-full" @click="openPopup">
        <i class="pi pi-camera"></i>
      </button>
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <label class="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 h-10"
          placeholder="John Doe"
          v-model="data.user.full_name"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Gender</label>
        <select
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 h-10"
          v-model="data.user.gender"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="relative">
        <div class="flex justify-between">
          <label class="block text-gray-700 font-medium">Phone Number</label>
        </div>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter phone number"
          v-model="data.user.phone"
          readonly
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">Email</label>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter email"
          v-model="data.user.email"
          readonly
        />
      </div>
    </div>
    <!-- Action buttons -->
    <div class="flex justify-end space-x-4">
      <button
        class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        @click="saveUserDetails"
      >
        Save
      </button>
    </div>

    <EditAvatar v-if="showAvatarPopup" :cropAvatar="avatarSrc" @close="showAvatarPopup = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import defaultAvatar from '../../assets/avatar-default.svg'
import EditAvatar from '@/components/EditAvatar.vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const API_URL = import.meta.env.VITE_APP_API_URL

const avatarSrc = ref(defaultAvatar)
const cropAvatar = ref(defaultAvatar)
const showAvatarPopup = ref(false)
const data = reactive({
  user: {}
})

const openPopup = () => {
  showAvatarPopup.value = true
}

async function fetchDataUser() {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    data.user = response.data
    if (data.user.avatar_url) {
      avatarSrc.value = `http://localhost:8090/uploads/${data.user.avatar_url}`
      cropAvatar.value = avatarSrc.value
    }
  } catch (e) {
    console.error(e)
  }
}

const saveUserDetails = async () => {
  try {
    const response = await axios.put(`${API_URL}/users/updateProfile`, data.user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    toastr.success('User details updated successfully')
  } catch (error) {
    console.log(error)
    toastr.error(error.response.data, 'Error')
  }
}

onMounted(() => {
  fetchDataUser()
  const message = sessionStorage.getItem('message')

  if (message) {
    toastr.success(message)
    sessionStorage.removeItem('message')
  }
})
</script>
