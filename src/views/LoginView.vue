<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import axios from 'axios'

// Reactive state
const form = ref({
  phone: '',
  password: ''
})

// Trạng thái ẩn/hiện mật khẩu
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const phoneError = ref('')
const isSubmitting = ref(false)
const router = useRouter()

// Kiểm tra tính hợp lệ của số điện thoại
const validatePhone = () => {
  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(form.value.phone)) {
    phoneError.value = 'Invalid phone number. Must be 10 digits.'
  } else {
    phoneError.value = ''
  }
}

// Computed để kiểm tra nếu tất cả các trường hợp lệ
const canSubmit = computed(() => {
  return form.value.phone && form.value.password && !phoneError.value
})

// Hàm xử lý đăng nhập
const login = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    const payload = {
      username: form.value.phone,
      password: form.value.password,
      roleId: 2
    }

    // Gửi yêu cầu POST tới API đăng nhập
    const response = await axios.post('http://localhost:8090/api/users/login', payload)

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('token', response.data.token)
      if (response.data.role_id === 3) {
        router.push('/').then(() => {
          window.location.href = '/'
        })
      } else if (response.data.role_id === 2) {
        router.push('/recruiter/dashboard')
      }

      toastr.success('Login successfully!')
    } else {
      toastr.error('Login failed: Invalid credentials')
    }
  } catch (error) {
    console.error('Login failed:', error)
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
            <router-link to="/login" class="flex items-center justify-center">
              <img src="../assets/logo.svg" alt="logo" class="w-8 h-8" />
              <h1 class="ml-2 text-2xl font-bold text-blue-600">DevHire</h1>
            </router-link>
            <h5 class="my-6 text-xl font-semibold">Login</h5>
            <form @submit.prevent="login">
              <div class="grid grid-cols-1">
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="phone" class="font-semibold">Phone number:</label>
                  <input
                    v-model="form.phone"
                    @blur="validatePhone"
                    type="text"
                    class="form-input rounded-md"
                    placeholder="0912345678"
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
                  <div class="inline-flex items-center mb-0">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
                    />
                    <label for="remember" class="form-checkbox-label text-slate-400"
                      >Remember me</label
                    >
                  </div>
                  <p class="text-slate-400 mb-0">
                    <a href="" class="text-slate-400">Forgot password?</a>
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
                <div class="text-center">
                  <span class="text-slate-400 me-2">Don't have an account?</span>
                  <router-link to="/signup" class="text-black dark:text-white font-bold"
                    >Sign up</router-link
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
