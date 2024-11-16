<script setup>
import { ref, onMounted } from 'vue'
import PostForm from '@/components/PostForm.vue'
import axios from 'axios'

const categories = ref([])
const skills = ref([])
const address = ref([])
const cities = ref([])

// Fetch Categories, Skills, and Address data
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/category')
    categories.value = response.data
  } catch (e) {
    console.error('Error fetching categories:', e)
  }
}

const fetchSkills = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/companies/skills', {
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
    const response = await axios.get('http://localhost:8090/api/companies/addresses', {
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
        console.log('cityCode:', cityCode)
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

// Trigger the fetch methods on mount
onMounted(async () => {
  await fetchCities()
  await fetchCategories()
  await fetchSkills()
  await fetchAddresses()

  console.log('addresses:', address.value)
})
</script>

<template>
  <div class="text-left">
    <!-- Pass the data as props to PostForm -->
    <PostForm :categories="categories" :skills="skills" :address="address" />
  </div>
</template>
