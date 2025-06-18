<script setup>
import { ref, onMounted, computed } from 'vue'
import PostForm from '@/components/PostForm.vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const API_URL = import.meta.env.VITE_APP_API_URL

const skills = ref([])
const address = ref([])
const cities = ref([])

const fetchSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/companies/skills`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (response.status === 204 || response.data.length === 0) {
      skills.value = [{ name: '' }]
    } else {
      skills.value = response.data.map((skill) => ({ name: skill.name }))
    }
  } catch (error) {
    console.error('Error fetching skills:', error)
  }
}

const fetchAddresses = async () => {
  try {
    const response = await axios.get(`${API_URL}/companies/addresses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (response.status === 204 || response.data.length === 0) {
      address.value = [
        {
          selectedCity: '',
          selectedCityName: '',
          selectedDistrict: '',
          selectedDistrictName: '',
          street: '',
          districts: [],
          isCityDropdownOpen: false
        }
      ]
    } else {
      address.value = response.data.map((addr) => {
        const cityCode = getCityCode(addr.city)
        const districtCode = getDistrictCode(addr.city, addr.district)
        const district = setDistricts(cityCode)
        return {
          selectedCity: cityCode,
          selectedCityName: addr.city,
          selectedDistrict: districtCode,
          selectedDistrictName: addr.district,
          street: addr.street,
          districts: district
        }
      })
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    address.value = [
      {
        selectedCity: '',
        selectedCityName: '',
        selectedDistrict: '',
        selectedDistrictName: '',
        street: '',
        districts: [],
        isCityDropdownOpen: false
      }
    ]
  }
}

async function fetchCities() {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    cities.value = response.data

    if (cities.value.length > 0) {
      if (address.value.length > 0) {
        address.value[0].selectedCity = cities.value[0].code
        address.value[0].selectedCityName = cities.value[0].name
        address.value[0].districts = cities.value[0].districts
        if (address.value[0].districts.length > 0) {
          address.value[0].selectedDistrict = address.value[0].districts[0].code
          address.value[0].selectedDistrictName = address.value[0].districts[0].name
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

function getCityCode(cityName) {
  const city = cities.value.find((city) => city.name === cityName)
  return city ? city.code : ''
}

function getDistrictCode(cityName, districtName) {
  const city = cities.value.find((city) => city.name === cityName)
  if (city) {
    const district = city.districts.find((district) => district.name === districtName)
    return district ? district.code : ''
  }
  return ''
}

function setDistricts(cityCode) {
  const city = cities.value.find((city) => city.code === cityCode)
  if (city) {
    return city.districts
  } else {
    return []
  }
}

const isLoading = ref(false)
async function createJob(data) {
  isLoading.value = true
  try {
    const response = await axios.post(`${API_URL}/jobs`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    toastr.success(response.data, 'Success')
    setTimeout(() => {
      window.location.href = '/recruiter/jobs'
    }, 1000)
  } catch (error) {
    console.error()
    toastr.error(JSON.stringify(error.response.data), 'Error')
  } finally {
    isLoading.value = false
  }
}

const totalPostedJobsMonth = ref(0)
const fetchTotalPostedJobsMonth = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/total-posted-month`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    totalPostedJobsMonth.value = response.data
    console.log('Total posted jobs for the month:', totalPostedJobsMonth.value)
  } catch (error) {
    console.error('Error fetching total posted jobs for the month:', error)
    totalPostedJobsMonth.value = 0 // Set to 0 or handle error appropriately
    toastr.error('Failed to load total posted jobs for the month.', 'Error')
  }
}

const totalAllowedJobs = ref(3)
const fetchUpgradedSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/subscription/upgraded`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    totalAllowedJobs.value = response.data?.[0]?.amount || 3
    console.log('Total allowed jobs for the month:', totalAllowedJobs.value)
  } catch (error) {
    console.error('Error fetching upgraded subscriptions:', error)
    totalAllowedJobs.value = 3
  }
}

const canPostJob = computed(() => {
  return totalPostedJobsMonth.value < totalAllowedJobs.value
})

// Trigger the fetch methods on mount
onMounted(async () => {
  await fetchCities()
  await fetchSkills()
  await fetchAddresses()
  await fetchTotalPostedJobsMonth()
  await fetchUpgradedSubscriptions()
  if (!canPostJob.value) {
    toastr.info(
      `You have reached the limit of ${totalAllowedJobs.value} jobs for this month. Please upgrade your subscription to post more jobs.`,
      'Limit Reached'
    )
  }
})
</script>

<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10 text-center">
      Create a New Job
    </h1>
  </header>
  <div class="text-left">
    <!-- Pass the data as props to PostForm -->
    <PostForm
      :skills="skills"
      :address="address"
      :isEdit="false"
      :isPostJob="canPostJob"
      @submit="createJob"
    />
  </div>
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-[9999]"
  >
    <div
      class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"
    ></div>
    <p class="text-white text-lg">Please waiting ...</p>
  </div>
</template>
