<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostForm from '@/components/PostForm.vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

// Lấy ID từ URL params
const route = useRoute()
const id = route.params.id

// Biến lưu dữ liệu
const jobDetails = ref(null)
const skills = ref([])
const address = ref([])
const cities = ref([])

// Hàm gọi API lấy danh sách thành phố
const fetchCities = async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    cities.value = response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
}

// Hàm gọi API lấy chi tiết công việc
const fetchJobDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:8090/api/jobs/${id}`)
    const job = response.data
    console.log('Job details:', job)
    jobDetails.value = job

    skills.value =
      job.skills?.map((skill) => ({
        name: skill.name
      })) || []

    // Chuẩn hóa address
    address.value = (job.addresses || []).map((addr) => {
      // Tìm city từ cities
      const city = cities.value.find((c) => c.name === addr.city)
      const cityCode = city?.code || ''
      const districts = city?.districts || []

      // Tìm district từ danh sách districts
      const district = districts.find((d) => d.name === addr.district)
      const districtCode = district?.code || ''

      return {
        selectedCity: cityCode,
        selectedCityName: addr.city || '',
        selectedDistrict: districtCode,
        selectedDistrictName: addr.district || '',
        street: addr.street || '',
        districts: districts,
        isCityDropdownOpen: false
      }
    })
  } catch (error) {
    console.error('Error fetching job details:', error)
  }
}

async function updateJob(data) {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${id}/edit`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    toastr.success(response.data, 'Success')
    setTimeout(() => {
      window.location.href = '/recruiter/jobs'
    }, 1000)
  } catch (error) {
    console.error(error)
    toastr.error(JSON.stringify(error.response.data), 'Error')
  }
}

// Gọi API khi component được mount
onMounted(async () => {
  await fetchCities() // Đảm bảo cities có trước
  await fetchJobDetails()
})
</script>

<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10 text-center">
      Edit Information to Job
    </h1>
  </header>
  <div>
    <!-- Truyền dữ liệu qua PostForm -->
    <PostForm
      v-if="jobDetails"
      :skills="skills"
      :address="address"
      :job="jobDetails"
      :isEdit="true"
      @submit="updateJob"
    />
    <p v-else><div class="flex justify-center items-center h-screen">
    <div
      class="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"
    ></div>
  </div></p>
  </div>
</template>
