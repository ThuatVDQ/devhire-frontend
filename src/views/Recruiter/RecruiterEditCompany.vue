<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="updateCompanyInfo" class="bg-gray-100 rounded-lg" v-if="company">
      <div class="flex items-center">
        <div class="relative inline-block">
          <img
            :src="avatarSrc"
            @error="avatarSrc = avatarSrc"
            alt="avatar"
            class="w-20 h-20 rounded-full object-cover"
          />
          <button class="absolute bottom-0 right-0 p-1 rounded-full">
            <i class="pi pi-camera"></i>
          </button>
        </div>
        <div class="relative ml-4 w-1/2 items-center">
          <input
            v-model="company.name"
            type="text"
            id="name"
            class="border border-gray-300 rounded-md p-2 w-full"
            required
          />
          <button class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
            <i class="pi pi-pencil"></i>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label for="tax_code" class="block mb-2 text-sm font-medium text-gray-700"
            >Tax Code</label
          >
          <input
            v-model="company.tax_code"
            type="text"
            id="tax_code"
            class="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label for="scale" class="block mb-2 text-sm font-medium text-gray-700">Scale</label>
          <input
            v-model="company.scale"
            type="number"
            id="scale"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="company.email"
            type="email"
            id="email"
            class="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Phone</label>
          <input
            v-model="company.phone"
            type="text"
            id="phone"
            class="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label for="address" class="block mb-2 text-sm font-medium text-gray-700">Address</label>
          <input
            v-model="company.address"
            type="text"
            id="address"
            class="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label for="web_url" class="block mb-2 text-sm font-medium text-gray-700"
            >Website URL</label
          >
          <input
            v-model="company.web_url"
            type="url"
            id="web_url"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
      </div>
      <div class="mt-4">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          v-model="company.description"
          id="description"
          class="border border-gray-300 rounded-md p-2 w-full"
          rows="4"
        ></textarea>
      </div>
      <button type="submit" class="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded">
        Save
      </button>
    </form>
    <p v-else>Loading company information...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import defaultAvatar from '../../assets/avatar-default.svg'

const avatarSrc = ref(defaultAvatar)
const company = ref(null)

// Fetch company information from API when component mounts
const fetchCompanyInfo = async () => {
  try {
    const response = await axios.get('YOUR_API_ENDPOINT') // Thay thế YOUR_API_ENDPOINT bằng URL của API
    company.value = response.data
  } catch (error) {
    console.error('Error fetching company info:', error)
  }
}

// Function to update company information
const updateCompanyInfo = async () => {
  try {
    const response = await axios.put('YOUR_API_UPDATE_ENDPOINT', company.value) // Thay thế bằng URL của API cập nhật
    console.log('Company Info Updated:', response.data)
  } catch (error) {
    console.error('Error updating company info:', error)
  }
}

// Fetch data on component mount
onMounted(fetchCompanyInfo)
</script>
