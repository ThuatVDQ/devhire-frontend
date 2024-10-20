<template>
  <div class="container mx-auto p-6">
    <div class="relative inline-block mb-6">
      <img
        :src="avatarSrc"
        @error="avatarSrc = defaultAvatar"
        alt="avatar"
        class="w-20 h-20 rounded-full object-cover"
      />
      <button class="absolute bottom-0 right-0 p-1 rounded-full">
        <i class="pi pi-camera"></i>
      </button>
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <label class="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Gender</label>
        <select
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      <div class="relative">
        <div class="flex justify-between">
          <label class="block text-gray-700 font-medium">Phone Number</label>
          <button class="text-green-500">Update</button>
        </div>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">Email</label>
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter email"
        />
      </div>
    </div>
    <!-- Action buttons -->
    <div class="flex justify-end space-x-4">
      <button class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
        Cancel
      </button>
      <button class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">Save</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import defaultAvatar from '../../assets/avatar-default.jpg'

const avatarSrc = ref('')
</script>
