<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import VerifyCodeView from './../VerifyCodeView.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import LoginWithGoogle from '@/components/LoginWithGoogle.vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import axios from 'axios'
import logo from '../../assets/logo.svg'

// Reactive state
const form = ref({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const showVerifyPopup = ref(false)

const showResetPasswordPopup = ref(false)
const currentMessageType = ref('')

const openVerifyPopup = async (messageType) => {
  currentMessageType.value = messageType
  if (!form.value.phone) {
    toastr.error('Please enter your email address.')
    return
  }
  isSubmitting.value = true
  try {
    const endpoint = `http://localhost:8090/api/users/resend?email=${form.value.phone}`

    const response = await axios.post(endpoint)

    if (response.status === 200) {
      showVerifyPopup.value = true
    }
  } catch (error) {
    toastr.error(error.response.data, 'Error')
  } finally {
    isSubmitting.value = false
  }
}

function onVerified() {
  if (currentMessageType.value === 'forgotPassword') {
    showVerifyPopup.value = false
    showResetPasswordPopup.value = true
  } else {
    toastr.success('Enable successful!')
    showVerifyPopup.value = false
  }
}

function onPasswordReset() {
  toastr.success('Password reset successful!')
  showResetPasswordPopup.value = false // Đóng popup đặt lại mật khẩu
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const phoneError = ref('')
const isSubmitting = ref(false)
const router = useRouter()

// Kiểm tra tính hợp lệ của email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(form.value.phone)) {
    phoneError.value = 'Please enter a valid email address.'
  } else {
    phoneError.value = ''
  }
}
watch(
  () => form.value.phone,
  () => {
    if (phoneError.value) {
      phoneError.value = '' // Reset lỗi khi người dùng sửa lại email
    }
  }
)

// Computed để kiểm tra nếu tất cả các trường hợp lệ
const canSubmit = computed(() => {
  return form.value.phone && form.value.password && !phoneError.value
})

// Hàm xử lý đăng nhập
const login = async () => {
  validateEmail()
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    const payload = {
      username: form.value.phone,
      password: form.value.password,
      role_id: 2
    }

    const response = await axios.post('http://localhost:8090/api/users/login', payload)

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', form.value.phone)
      router.push('/recruiter/dashboard')
      toastr.success('Login successfully!')
    } else {
      toastr.error('Login failed: Invalid credentials')
    }
  } catch (error) {
    toastr.error(error.response.data.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {})
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
            <div class="flex items-center justify-center">
              <img :src="logo" alt="logo" class="w-8 h-8" />
              <h1 class="ml-2 text-2xl font-bold text-blue-600">DevHire</h1>
            </div>
            <h5 class="my-6 text-xl font-semibold">Login for Recruiter</h5>
            <form @submit.prevent="login">
              <div class="grid grid-cols-1">
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="phone" class="font-semibold">Email address</label>
                  <input
                    v-model="form.phone"
                    @blur="validatePhoneOrEmail"
                    type="text"
                    class="form-input rounded-md"
                    placeholder="example@email.com"
                  />
                  <span v-if="phoneError" class="text-red-500 text-sm">{{ phoneError }}</span>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="password" class="font-semibold">Password:</label>
                  <div class="flex items-center relative">
                    <input
                      v-model="form.password"
                      @blur="validatePassword"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input rounded-md w-full"
                      placeholder="Password"
                    />
                    <span @click="togglePasswordVisibility" class="absolute right-4 cursor-pointer">
                      <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </span>
                  </div>
                </div>
                <div class="flex justify-between mb-4">
                  <div class="inline-flex items-center mb-0"></div>
                  <p class="text-slate-400 mb-0">
                    <a
                      href="#"
                      @click.prevent="openVerifyPopup('forgotPassword')"
                      class="text-slate-400"
                      >Forgot password?</a
                    >
                  </p>
                </div>
                <div class="mb-4">
                  <input
                    type="submit"
                    value="Login"
                    :class="{
                      'p-2 rounded-md w-full': true,
                      'bg-gray-400 cursor-not-allowed': !canSubmit || isSubmitting,
                      'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white cursor-pointer':
                        canSubmit && !isSubmitting
                    }"
                    :disabled="!canSubmit || isSubmitting"
                  />
                </div>
                <div class="mb-4 text-center">
                  <button
                    @click="openVerifyPopup('enableAccount')"
                    type="button"
                    class="text-blue-500 underline"
                  >
                    Enable Account
                  </button>
                </div>
                <div class="flex items-center my-4">
                  <hr class="flex-grow border-t border-gray-300" />
                  <h5 class="mx-4 text-lg font-mono text-center">OR</h5>
                  <hr class="flex-grow border-t border-gray-300" />
                </div>
                <button
                  class="w-full mb-3 flex items-center justify-center py-2 px-4 bg-white border border-red-300 rounded-lg text-red-500 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
                >
                  <i class="pi pi-google mr-3"></i>
                  <LoginWithGoogle :role_id="2" />
                </button>
                <div class="text-center">
                  <span class="text-slate-400 me-2">Don't have an account?</span>
                  <router-link to="/recruiter/signup" class="text-black dark:text-white font-bold"
                    >Sign up</router-link
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isSubmitting"
      class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
    >
      <!-- Vòng tròn xoay tròn đồng bộ -->
      <div
        class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-white text-lg">Please waiting ...</p>
    </div>
  </section>

  <VerifyCodeView
    :show="showVerifyPopup"
    :email="form.phone"
    :messageType="currentMessageType"
    @close="showVerifyPopup = false"
    @verified="onVerified"
  />

  <ResetPassword
    :show="showResetPasswordPopup"
    :email="form.phone"
    @close="showResetPasswordPopup = false"
    @passwordReset="onPasswordReset"
  />
</template>
