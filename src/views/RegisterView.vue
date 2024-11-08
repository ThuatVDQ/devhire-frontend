<script setup>
import { ref, computed, watch } from 'vue'
import VerifyCodeView from './VerifyCodeView.vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { useRouter } from 'vue-router'

const router = useRouter()

// Biến mới để điều khiển popup
const showVerificationPopup = ref(false)

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const phoneError = ref('')
const emailError = ref('')
const nameError = ref('')
const termsAccepted = ref(false)
const passwordMismatchError = ref('')
const isSubmitting = ref(false)

// Theo dõi sự thay đổi của password và confirmPassword để cập nhật lỗi
watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
  if (newPassword && newConfirmPassword && newPassword !== newConfirmPassword) {
    passwordMismatchError.value = 'Passwords do not match!'
  } else {
    passwordMismatchError.value = ''
  }
})

const validateName = () => {
  if (!name.value) {
    nameError.value = 'Name is required.'
  } else {
    nameError.value = ''
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validatePhone = () => {
  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(phone.value)) {
    phoneError.value = 'Invalid phone number. Must be 10 digits.'
  } else {
    phoneError.value = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Invalid email address.'
  } else {
    emailError.value = ''
  }
}

const canSubmit = computed(() => {
  return (
    name.value &&
    phone.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    !phoneError.value &&
    !emailError.value &&
    !passwordMismatchError.value &&
    termsAccepted.value
  )
})

// Hàm đăng ký người dùng
const register = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    const payload = {
      full_name: name.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      retype_password: confirmPassword.value,
      role_id: 3
    }

    // Gửi yêu cầu POST tới API
    const response = await axios.post('http://localhost:8090/api/users/signup', payload)

    if (response.status === 200 || response.status === 201) {
      showVerificationPopup.value = true
    }
  } catch (error) {
    console.error('Registration failed:', error)
    toastr.error(error.response.data, 'Error')
  } finally {
    isSubmitting.value = false
  }
}

function closePopup() {
  showVerificationPopup.value = false
}

function onVerified() {
  toastr.success('Verification successful!')
  showVerificationPopup.value = false
  router.push('/login')
}
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-[url('../assets/bg.jpg')] bg-no-repeat bg-center bg-cover py-6"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <div
          class="relative overflow-hidden bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md"
        >
          <div class="p-6">
            <router-link to="/login" class="flex items-center justify-center">
              <img src="@/assets/logo.svg" alt="logo" class="w-8 h-8" />
              <h1 class="ml-2 text-2xl font-bold text-blue-600">DevHire</h1>
            </router-link>
            <h5 class="my-6 text-xl font-semibold">Sign up</h5>
            <form @submit.prevent="register">
              <div class="grid grid-cols-1">
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="name" class="font-semibold">Your name:</label>
                  <input
                    v-model="name"
                    type="text"
                    class="form-input rounded-md"
                    placeholder="Nguyen Van A"
                    @blur="validateName"
                  />
                  <span v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</span>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="phone" class="font-semibold">Phone number:</label>
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-input rounded-md"
                    placeholder="0912345678"
                    @blur="validatePhone"
                  />
                  <span v-if="phoneError" class="text-red-500 text-sm">{{ phoneError }}</span>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="email" class="font-semibold">Email:</label>
                  <input
                    v-model="email"
                    type="email"
                    class="form-input rounded-md"
                    placeholder="example@gmail.com"
                    @blur="validateEmail"
                  />
                  <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="password" class="font-semibold">Password:</label>
                  <div class="flex items-center relative">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input rounded-md w-full"
                      placeholder="Password"
                    />
                    <span @click="togglePassword" class="absolute right-4 cursor-pointer">
                      <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </span>
                  </div>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="confirmPassword" class="font-semibold">Confirm password:</label>
                  <div class="flex items-center relative">
                    <input
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-input rounded-md w-full"
                      placeholder="Confirm password"
                    />
                    <span @click="toggleConfirmPassword" class="absolute right-4 cursor-pointer">
                      <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </span>
                  </div>
                  <span v-if="passwordMismatchError" class="text-red-500 text-sm">{{
                    passwordMismatchError
                  }}</span>
                </div>
                <div class="mb-4">
                  <div class="inline-flex items-center mb-0">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
                      v-model="termsAccepted"
                    />
                    <label for="remember" class="form-checkbox-label text-slate-400"
                      >I Accept <a href="" class="text-emerald-600">Terms And Conditions</a></label
                    >
                  </div>
                </div>
                <div class="mb-4">
                  <input
                    type="submit"
                    value="Register"
                    :class="{
                      'p-2 rounded-md w-full': true,
                      'bg-gray-400 cursor-not-allowed': !canSubmit || isSubmitting,
                      'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white cursor-pointer':
                        canSubmit && !isSubmitting
                    }"
                    :disabled="!canSubmit || isSubmitting"
                  />
                </div>
                <div class="text-center">
                  <span class="text-slate-400 me-2">Already have an account?</span>
                  <router-link to="/login" class="text-black dark:text-white font-bold"
                    >Sign in</router-link
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <VerifyCodeView
    :show="showVerificationPopup"
    :email="email"
    @close="closePopup"
    @verified="onVerified"
  />
</template>
