<template>
  <div class="flex justify-center">
    <div class="max-w-md w-full bg-white rounded-lg p-6">
      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="mb-4 relative">
          <label for="current-password" class="block text-gray-700 font-medium mb-2"
            >Current Password</label
          >
          <div class="flex items-center">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              id="current-password"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              v-model="currentPassword"
            />
            <span @click="toggleCurrentPassword" class="absolute right-3">
              <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </span>
          </div>
        </div>

        <!-- New Password -->
        <div class="mb-4 relative">
          <label for="new-password" class="block text-gray-700 font-medium mb-2"
            >New Password</label
          >
          <div class="flex items-center">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              id="new-password"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              v-model="newPassword"
            />
            <span @click="toggleNewPassword" class="absolute right-3">
              <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </span>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="mb-6 relative">
          <label for="confirm-password" class="block text-gray-700 font-medium mb-2"
            >Confirm New Password</label
          >
          <div class="flex items-center">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              v-model="confirmPassword"
            />
            <span @click="toggleConfirmPassword" class="absolute right-3">
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </span>
          </div>
        </div>

        <!-- Update Password Button -->
        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
        >
          Update Password
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const changePassword = () => {
  if (newPassword.value === confirmPassword.value) {
    alert('Password updated successfully!')
    // Logic để cập nhật mật khẩu
  } else {
    alert('Passwords do not match.')
  }
}

const toggleCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>
