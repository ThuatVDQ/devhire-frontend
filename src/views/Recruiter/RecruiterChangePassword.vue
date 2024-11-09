<template>
  <div class="flex justify-center">
    <div class="max-w-2xl w-full bg-white rounded-lg p-6">
      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="mb-6 flex items-center">
          <label for="current-password" class="w-1/3 text-gray-700 font-medium text-right mr-6">
            Current Password <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3 relative">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              id="current-password"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              v-model="currentPassword"
            />
            <span
              @click="toggleCurrentPassword"
              class="absolute right-3 top-2/4 transform -translate-y-1/2 cursor-pointer"
            >
              <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </span>
          </div>
        </div>

        <!-- New Password -->
        <div class="mb-6 flex items-center">
          <label for="new-password" class="w-1/3 text-gray-700 font-medium text-right mr-6">
            New Password <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3 relative">
            <div class="relative">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="new-password"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                v-model="newPassword"
              />
              <span
                @click="toggleNewPassword"
                class="absolute right-3 top-2/4 transform -translate-y-1/2 cursor-pointer"
              >
                <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </span>
            </div>
            <span v-if="sameAsCurrentPasswordError" class="text-red-500 text-sm mt-2 block">
              {{ sameAsCurrentPasswordError }}
            </span>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="mb-6 flex items-center">
          <label for="confirm-password" class="w-1/3 text-gray-700 font-medium text-right mr-6">
            Confirm New Password <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3 relative">
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                v-model="confirmPassword"
              />
              <span
                @click="toggleConfirmPassword"
                class="absolute right-3 top-2/4 transform -translate-y-1/2 cursor-pointer"
              >
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </span>
            </div>
            <span v-if="passwordMismatchError" class="text-red-500 text-sm mt-2 block">
              {{ passwordMismatchError }}
            </span>
          </div>
        </div>

        <!-- Update Password Button -->
        <div class="flex items-center">
          <div class="w-1/3 mr-6"></div>
          <div class="w-2/3">
            <button
              type="submit"
              :class="[
                'w-full p-2 rounded-lg font-semibold transition duration-300',
                isFormValid
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              ]"
              :disabled="!isFormValid"
            >
              Update Password
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordMismatchError = ref('')
const sameAsCurrentPasswordError = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

watch([newPassword, confirmPassword], ([newPwd, confirmPwd]) => {
  if (newPwd === currentPassword.value && newPwd) {
    sameAsCurrentPasswordError.value = 'New password cannot be the same as the current password.'
  } else {
    sameAsCurrentPasswordError.value = ''
  }

  if (newPwd && confirmPwd && newPwd !== confirmPwd) {
    passwordMismatchError.value = 'Passwords do not match!'
  } else {
    passwordMismatchError.value = ''
  }
})

const isFormValid = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    !passwordMismatchError.value &&
    !sameAsCurrentPasswordError.value
  )
})

const changePassword = async () => {
  try {
    const response = await axios.put(
      'http://localhost:8090/api/users/update-password',
      {
        password: currentPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    toastr.success(response.data, 'Success')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    console.log('Change password failed:', error)
    toastr.error(error.response.data, 'Error')
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
