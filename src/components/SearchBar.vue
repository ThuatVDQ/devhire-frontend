<template>
  <section>
    <div class="container mx-auto py-12">
      <div class="text-center mb-10">
        <h3 class="text-4xl md:text-5xl font-bold tracking-wide text-gray-900">Job Vacancies</h3>
      </div>

      <div class="bg-white dark:bg-slate-900 shadow-md rounded-lg p-6 max-w-5xl mx-auto">
        <form @submit.prevent="onSearch" class="flex items-center space-x-6">
          <!-- Search Input -->
          <div class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3 w-full max-w-sm">
            <i class="pi pi-briefcase text-green-700 mr-4 text-lg"></i>
            <input
              v-model="keyword"
              type="text"
              placeholder="Search..."
              class="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg"
            />
          </div>

          <!-- Custom Location Dropdown -->
          <div ref="locationDropdown" class="relative w-full max-w-sm">
            <div
              @click="toggleLocationDropdown"
              class="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer"
            >
              <i class="pi pi-map-marker text-green-700 mr-4 text-lg"></i>
              <span class="text-gray-900 dark:text-white text-lg flex-1">
                {{ selectedCity || 'Select location' }}
              </span>
              <button
                v-if="selectedCity"
                @click.stop="clearLocation"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Location Dropdown List -->
            <div
              v-if="isLocationDropdownOpen"
              class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search location..."
                class="w-full px-5 py-3 border-b border-gray-200 outline-none focus:border-green-500 text-lg"
              />
              <ul class="max-h-48 overflow-y-auto">
                <li
                  v-for="city in filteredCities"
                  :key="city.code"
                  @click="selectCity(city.name)"
                  class="px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-lg"
                >
                  {{ city.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Job Type Dropdown -->
          <div ref="jobTypeDropdown" class="relative w-full max-w-sm">
            <div
              @click="toggleJobTypeDropdown"
              class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer"
            >
              <i class="pi pi-briefcase text-green-700 mr-4 text-lg"></i>
              <span class="text-gray-900 dark:text-white text-lg flex-1">
                {{ selectedJobType || 'Select job type' }}
              </span>
              <button
                v-if="selectedJobType"
                @click.stop="clearJobType"
                class="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <!-- Job Type Dropdown List -->
            <div
              v-if="isJobTypeDropdownOpen"
              class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10"
            >
              <ul class="max-h-48 overflow-y-auto">
                <li
                  v-for="type in jobTypes"
                  :key="type"
                  @click="selectJobType(type)"
                  class="px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-lg"
                >
                  {{ type }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="bg-emerald-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-emerald-600 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, defineEmits, watch } from 'vue'
import axios from 'axios'

// State for cities, job types, and selected values
const cities = ref([])
const jobTypes = ref(['Full_Time', 'Part_Time', 'Internship'])
const keyword = ref('')
const selectedCity = ref('')
const selectedJobType = ref('')

// Separate states for dropdown visibility
const isLocationDropdownOpen = ref(false)
const isJobTypeDropdownOpen = ref(false)
const searchQuery = ref('')

// Refs for dropdown elements
const locationDropdown = ref(null)
const jobTypeDropdown = ref(null)

const emit = defineEmits(['search'])

// Fetch cities data on component mount
onMounted(async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    cities.value = response.data.map((city) => ({ name: city.name, code: city.code }))
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
})

// Toggle location dropdown visibility
const toggleLocationDropdown = () => {
  isLocationDropdownOpen.value = !isLocationDropdownOpen.value
  isJobTypeDropdownOpen.value = false // close job type dropdown if open
}

// Toggle job type dropdown visibility
const toggleJobTypeDropdown = () => {
  isJobTypeDropdownOpen.value = !isJobTypeDropdownOpen.value
  isLocationDropdownOpen.value = false // close location dropdown if open
}

// Close dropdowns if clicked outside
const handleClickOutside = (event) => {
  if (locationDropdown.value && !locationDropdown.value.contains(event.target)) {
    isLocationDropdownOpen.value = false
  }
  if (jobTypeDropdown.value && !jobTypeDropdown.value.contains(event.target)) {
    isJobTypeDropdownOpen.value = false
  }
}

// Attach and detach the click event listener
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

// Filter cities based on search query
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

const filteredCities = computed(() => {
  if (!searchQuery.value) return cities.value

  const search = removeVietnameseTones(searchQuery.value.trim().toLowerCase())
  return cities.value.filter((city) =>
    removeVietnameseTones(city.name.toLowerCase()).includes(search)
  )
})

// Select city and close location dropdown
const selectCity = (cityName) => {
  selectedCity.value = cityName
  isLocationDropdownOpen.value = false
}

// Select job type and close job type dropdown
const selectJobType = (type) => {
  selectedJobType.value = type
  isJobTypeDropdownOpen.value = false
}

// Clear selected location
const clearLocation = () => {
  selectedCity.value = ''
}

// Clear selected job type
const clearJobType = () => {
  selectedJobType.value = ''
}

const onSearch = () => {
  emit('search', {
    keyword: keyword.value,
    location: selectedCity.value,
    type: selectedJobType.value
  })
}

// watch([keyword, selectedCity, selectedJobType], () => {
//   emit('search', {
//     keyword: keyword.value,
//     location: selectedCity.value,
//     type: selectedJobType.value
//   })
// })
</script>

<style scoped>
.max-h-48::-webkit-scrollbar {
  width: 8px;
}
.max-h-48::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
</style>
