<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" v-if="show">
    <div class="bg-white p-8 rounded-xl max-w-sm w-full text-left shadow-lg">
      <h2 class="text-2xl font-semibold mb-2 text-center">Reset Password</h2>
      <p class="text-gray-500 mb-4">Enter a new password for your account.</p>

      <!-- New Password Input -->
      <div class="mb-4 relative">
        <label class="text-left w-full font-semibold" for="new-password">New Password</label>
        <input
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          id="new-password"
          class="w-full p-2 border border-gray-300 rounded-md pr-10"
          placeholder="New password"
        />
        <!-- Đoạn mã hiện tại hiển thị icon để hiển thị/ẩn mật khẩu -->
        <span
          @click="toggleNewPassword"
          class="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
        >
          <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </span>
      </div>

      <!-- Confirm New Password Input -->
      <div class="mb-4 relative">
        <label class="text-left w-full font-semibold" for="confirm-password"
          >Confirm Password</label
        >
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirm-password"
          class="w-full p-2 border border-gray-300 rounded-md pr-10"
          placeholder="Confirm new password"
        />
        <span
          @click="toggleConfirmPassword"
          class="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
        >
          <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </span>
      </div>

      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <!-- Submit Button -->
      <button
        @click="submitNewPassword"
        class="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md w-full font-semibold"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

const props = defineProps({
  show: Boolean,
  email: String
})

const emit = defineEmits(['close', 'passwordReset'])

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Toggle password visibility functions
const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Submit new password to backend
async function submitNewPassword() {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Both fields are required.'
    return
  }

  console.log(props.email)

  try {
    const response = await axios.post(`${API_URL}/users/forgot-password/reset`, {
      email: props.email,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })

    if (response.status === 200) {
      emit('passwordReset')
      closePopup()
    }
  } catch (err) {
    error.value = 'Failed to reset password. Please try again.'
    console.error(err)
  }
}

// Close the popup
function closePopup() {
  emit('close')
}
</script>

<style scoped>
.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
