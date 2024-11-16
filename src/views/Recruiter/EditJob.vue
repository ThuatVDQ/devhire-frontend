<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostForm from '@/components/PostForm.vue'
import axios from 'axios'

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

// Gọi API khi component được mount
onMounted(async () => {
  await fetchCities() // Đảm bảo cities có trước
  await fetchJobDetails()
})
</script>

<template>
  <div>
    <!-- Truyền dữ liệu qua PostForm -->
    <PostForm v-if="jobDetails" :skills="skills" :address="address" :job="jobDetails" />
    <p v-else>Loading job details...</p>
  </div>
</template>
