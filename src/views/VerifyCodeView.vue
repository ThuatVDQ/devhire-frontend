<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" v-if="show">
    <div class="bg-white p-8 rounded-xl max-w-sm w-full text-center shadow-lg">
      <h2 class="text-2xl font-semibold mb-2">Verification Code</h2>
      <p class="text-gray-500 mb-4">We have sent the code verification to your email.</p>

      <!-- Verification Code Inputs -->
      <div class="flex justify-center space-x-2 mb-4">
        <input
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          type="text"
          maxlength="1"
          class="w-10 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:border-blue-500"
          @input="moveToNextInput(index)"
          @keypress="onlyNumber($event)"
          @paste="handlePaste($event)"
          :ref="(el) => (codeInputRefs[index] = el)"
        />
      </div>

      <!-- Email and Countdown Timer -->
      <p class="text-gray-500 text-sm mb-2">{{ email }}</p>
      <p class="text-gray-500 text-sm mb-4">
        Time remaining: <span class="font-semibold text-red-500">{{ formattedTime }}</span>
      </p>

      <!-- Buttons -->
      <div class="flex flex-col space-y-2">
        <button @click="resendCode" class="text-blue-500 underline">Send Again</button>
        <button
          @click="submitCode"
          class="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white py-2 rounded-md font-semibold"
        >
          Submit
        </button>
      </div>

      <span v-if="error" class="text-red-500 text-sm block mt-4">{{ error }}</span>
    </div>
  </div>

  <!-- Overlay mờ và icon xoay tròn khi đợi phản hồi từ backend -->
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="text-center">
      <div
        class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-white text-lg">Processing, please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: Boolean,
  email: String,
  messageType: String
})

const emit = defineEmits(['close', 'verified'])

const code = ref(Array(6).fill(''))
const error = ref('')
const countdown = ref(300) // 5 minutes in seconds
const isLoading = ref(false) // Biến kiểm tra trạng thái đang đợi phản hồi từ backend

// Format countdown as mm:ss
const formattedTime = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (countdown.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

// Countdown logic
let interval
onMounted(() => {
  interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      closePopup()
    }
  }, 1000)
})

// Clear interval when component is unmounted
onUnmounted(() => {
  clearInterval(interval)
})

// Ensure only numbers are entered
function onlyNumber(event) {
  const charCode = event.keyCode ? event.keyCode : event.which
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

const codeInputRefs = ref([]) // Sử dụng mảng để lưu ref cho mỗi ô nhập mã

function moveToNextInput(index) {
  if (code.value[index] && index < code.value.length - 1) {
    nextTick(() => {
      codeInputRefs.value[index + 1]?.focus() // Di chuyển đến ô nhập tiếp theo
    })
  }
}

function handlePaste(event) {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('Text').trim() // Lấy dữ liệu từ clipboard

  // Chỉ cho phép dán nếu đủ 6 chữ số
  if (pasteData.length === code.value.length && /^[0-9]+$/.test(pasteData)) {
    for (let i = 0; i < code.value.length; i++) {
      code.value[i] = pasteData[i] // Gán từng chữ số vào ô nhập tương ứng
    }
    nextTick(() => {
      codeInputRefs.value[code.value.length - 1]?.focus() // Di chuyển con trỏ đến ô cuối cùng
    })
  } else {
    error.value = 'Please enter a valid 6 digit code!' // Thông báo lỗi nếu mã không hợp lệ
  }
}

async function submitCode() {
  isLoading.value = true // Bắt đầu trạng thái loading
  try {
    const verificationCode = code.value.join('')
    const response = await axios.post(`http://localhost:8090/api/users/verify`, {
      email: props.email,
      verification_code: verificationCode
    })

    if (response.status === 200) {
      emit('verified', props.messageType)
      closePopup()
    }
  } catch (err) {
    error.value = 'The verification code is incorrect. Please try again!'
  } finally {
    isLoading.value = false // Kết thúc trạng thái loading
  }
}

async function resendCode() {
  isLoading.value = true // Bắt đầu trạng thái loading
  try {
    countdown.value = 300

    const response = await axios.post(`http://localhost:8090/api/users/resend?email=` + props.email)

    if (response.status === 200) {
      error.value = 'A new verification code has been sent to your email.'
    }
  } catch (err) {
    error.value = 'Failed to resend code. Please try again later.'
  } finally {
    isLoading.value = false // Kết thúc trạng thái loading
  }
}

function closePopup() {
  clearInterval(interval)
  emit('close') // Close the popup
}
</script>

<style scoped>
.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
