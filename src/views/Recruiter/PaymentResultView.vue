<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const message = ref('')
const status = ref('loading') // 🟢 Mặc định là "loading"
const router = useRouter()

const handlePaymentResult = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const vnp_ResponseCode = urlParams.get('vnp_ResponseCode')
  const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus')
  const subscriptionId = urlParams.get('vnp_OrderInfo')

  if (!vnp_ResponseCode || !vnp_TransactionStatus) {
    status.value = 'error'
    message.value = 'Invalid payment response.'
    return
  }

  if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
    try {
      await axios.get('http://localhost:8090/api/payments/payment-callback', {
        params: {
          vnp_ResponseCode,
          vnp_OrderInfo: subscriptionId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      status.value = 'success'
      message.value = 'Subscription activated!'
      toastr.success('Subscription activated!', 'Success')
    } catch (error) {
      console.error(error)
      status.value = 'error'
      message.value = 'Error processing subscription.'
      toastr.error('Error processing subscription.', 'Error')
    }
  } else {
    status.value = 'error'
    message.value = 'Payment failed. Please try again.'
    toastr.error('Payment failed. Please try again.', 'Error')
  }

  setTimeout(() => {
    router.push('/recruiter/upgrade') // Chuyển về trang khác sau 3 giây
  }, 3000)
}

const redirectToHome = () => {
  router.push('/recruiter/upgrade')
}

onMounted(handlePaymentResult)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen w-full transition-all"
    :class="{
      'bg-gray-100': status === 'loading',
      'bg-green-100': status === 'success',
      'bg-red-100': status === 'error'
    }"
  >
    <!-- 🟢 Loading -->
    <div v-if="status === 'loading'" class="text-center p-8">
      <i class="pi pi-spin pi-spinner text-6xl text-gray-500"></i>
      <h2 class="text-xl mt-3 text-gray-600">Processing your payment...</h2>
    </div>

    <!-- ✅ Kết quả thanh toán -->
    <div
      v-else
      class="p-8 rounded-lg shadow-lg text-center max-w-md w-full transform animate-fadeIn"
      :class="{
        'bg-green-500 text-white': status === 'success',
        'bg-red-500 text-white': status === 'error'
      }"
    >
      <!-- Icon trạng thái -->
      <i
        v-if="status === 'success'"
        class="pi pi-check-circle text-white text-6xl animate-bounce"
      ></i>
      <i v-else class="pi pi-times-circle text-white text-6xl animate-shake"></i>

      <!-- Tiêu đề -->
      <h2 class="text-2xl font-semibold mt-4">
        {{ status === 'success' ? 'Payment Successful!' : 'Payment Failed' }}
      </h2>

      <!-- Nội dung -->
      <p class="mt-3 text-lg opacity-80">{{ message }}</p>
      <p class="mt-1 text-sm opacity-60">Redirecting to homepage...</p>

      <!-- Nút chuyển hướng -->
      <button
        @click="redirectToHome"
        class="mt-6 px-6 py-3 rounded-lg font-medium shadow-md transition-all bg-white text-lg"
        :class="
          status === 'success'
            ? 'text-green-600 hover:bg-green-300'
            : 'text-red-600 hover:bg-red-300'
        "
      >
        Go to Homepage
      </button>
    </div>
  </div>
</template>
