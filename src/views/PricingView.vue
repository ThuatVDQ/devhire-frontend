<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from '../components//Card.vue'
import CardExploreJob from '../components/CardExploreJob.vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

// Card data
const cardItems = [
  {
    title: '24/7 Support',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-phone'
  },
  {
    title: 'Tech & Startup Jobs',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-slack'
  },
  {
    title: 'Quick & Easy',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-user-plus'
  },
  {
    title: 'Save Time',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-hourglass'
  }
]
// Biến lưu danh sách gói đăng ký (subscription)
const subscription = ref([])

// Hàm gọi API lấy danh sách subscription
const fetchSubscription = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/subscription', {
      params: { page: 0, limit: 10 } // Thêm tham số phân trang
    })
    subscription.value = response.data.map((sub) => ({
      id: sub.id,
      name: sub.name,
      price: sub.price,
      description: sub.description || 'No description available',
      benefit: sub.benefit ? sub.benefit.split(',') : [], // Chuyển chuỗi thành mảng
      duration: sub.duration || '1 month', // Giá trị mặc định nếu thiếu
      buttonLabel: 'Subscribe Now',
      borderColor: 'border-gray-300',
      bgColor: 'bg-white'
    }))
    console.log('Danh sách subscription:', subscription.value)
  } catch (error) {
    console.error('Lỗi khi tải danh sách subscription:', error)
  }
}

const handleSubscribe = async (plan) => {
  try {
    const paymentRequest = {
      amount: plan.price,
      subscription_id: plan.id,
      language: 'vn'
    }
    console.log('Payment request:', paymentRequest) // In ra thông tin yêu cầu thanh toán
    const response = await axios.post(
      'http://localhost:8090/api/payments/create_payment_url',
      paymentRequest,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (response.data.status === 'OK') {
      window.location.href = response.data.data // Chuyển hướng đến URL thanh toán
    } else {
      console.error('Lỗi khi tạo URL thanh toán:', response.data.message)
    }
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error)
  }
}

// Gọi API khi component được mount
onMounted(fetchSubscription)

const message = ref('')
const status = ref('')

// Hàm xử lý kết quả thanh toán
const handlePaymentResult = () => {
  // Lấy các tham số từ URL
  const urlParams = new URLSearchParams(window.location.search)

  // Kiểm tra nếu không có tham số thanh toán thì không làm gì
  const vnp_ResponseCode = urlParams.get('vnp_ResponseCode')
  const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus')

  // Nếu không có tham số thì không xử lý gì
  if (!vnp_ResponseCode || !vnp_TransactionStatus) {
    return
  }

  // Xử lý kết quả thanh toán
  if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
    const subscriptionId = urlParams.get('vnp_OrderInfo') // Giả sử vnp_OrderInfo là ID đăng ký
    axios
      .get('http://localhost:8090/api/payments/payment-callback', {
        params: {
          vnp_ResponseCode: vnp_ResponseCode,
          vnp_OrderInfo: subscriptionId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        console.log(response.data)
        toastr.success('Subscription activated!', 'Success')
        setTimeout(() => {
          const cleanUrl = window.location.origin + window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl) // Xóa tham số
          window.location.reload() // Reload trang
        }, 3000) // Chờ 3 giây trước khi reload
      })
      .catch((error) => {
        console.error(error)
        toastr.error('Error processing subscription.', 'Error')
      })
  } else {
    toastr.error('Payment failed. Please try again.', 'Error') // Hiển thị thông báo lỗi
  }
}

// Gọi hàm khi component được mount
onMounted(handlePaymentResult)
</script>
<template>
  <section
    class="relative table w-full py-36 bg-[url('../assets/banner.png')] bg-top bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0 bg-emerald-400/50"></div>
    <div class="container relative z-10">
      <div class="grid grid-cols-1 text-center">
        <h3
          class="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white"
        >
          Pricing Plans
        </h3>
      </div>
    </div>
  </section>
  <section class="relative lg:py-24 py-16">
    <div class="container">
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[30px]">
        <div
          v-for="(plan, index) in subscription"
          :key="index"
          :class="`group relative shadow hover:shadow-md dark:shadow-gray-800 rounded-md transition-all duration-500 ${plan.borderColor} ${plan.bgColor}`"
        >
          <div class="p-6 py-8">
            <h6 class="text-lg font-bold uppercase mb-5 text-emerald-600">{{ plan.name }}</h6>

            <!-- Giá và thời gian -->
            <div class="flex mb-5">
              <span class="text-xl font-semibold">$</span>
              <span class="price text-4xl font-semibold mb-0">{{ plan.price }}</span>
              <span class="text-xl font-semibold self-end mb-1">/ {{ plan.duration }}</span>
            </div>

            <!-- Mô tả -->
            <p class="text-gray-600 mb-4">{{ plan.description }}</p>

            <!-- Danh sách quyền lợi -->
            <ul
              class="list-none text-slate-400 border-t border-gray-100 dark:border-gray-700 pt-5 mb-8"
            >
              <li v-for="(feature, idx) in plan.benefit" :key="idx" class="my-2 flex items-center">
                <i class="pi pi-check-circle mr-3 text-emerald-600 text-xl me-2"></i>{{ feature }}
              </li>
            </ul>

            <!-- Nút đăng ký -->
            <button
              @click="handleSubscribe(plan)"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md"
            >
              {{ plan.buttonLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container md:mt-24 mt-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Here's why you'll love it Jobstack
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
        <Card
          v-for="(card, index) in cardItems"
          :key="index"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </div>
  </section>
</template>
