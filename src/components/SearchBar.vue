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
              placeholder="Enter keyword skill, job title, company name..."
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
    <div class="bg-white dark:bg-slate-900 shadow-md rounded-lg mx-48">
      <div class="flex items-center flex-wrap gap-y-4">
        <div ref="salaryDropdown" class="relative max-w-sm">
          <div
            @click="toggleSalaryDropdown"
            class="flex items-center justify-between dark:bg-gray-700 py-3 px-6 rounded-lg cursor-pointer"
          >
            <i class="pi pi-money-bill text-green-700 mr-4 text-lg"></i>
            <span class="text-gray-900 dark:text-white text-lg flex-1">
              {{ selectedSalaryRangeDisplay || 'Select salary range' }}
            </span>
            <button
              v-if="selectedSalaryRange"
              @click.stop="clearSalary"
              class="text-gray-500 hover:text-red-500 ml-3"
            >
              ✕
            </button>
          </div>

          <div
            v-if="isSalaryDropdownOpen"
            class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 p-4"
          >
            <div class="mb-4">
              <label
                for="salaryRangeDisplay"
                class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                >Salary Range:</label
              >
              <p
                id="salaryRangeDisplay"
                class="text-gray-900 dark:text-white text-xl font-semibold mb-4"
              >
                {{ formattedSalaryRange }}
              </p>

              <div class="flex justify-center mb-4">
                <button
                  @click="setCurrency('USD')"
                  :class="{
                    'bg-emerald-500 text-white': currentCurrency === 'USD',
                    'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white':
                      currentCurrency !== 'USD'
                  }"
                  class="px-4 py-2 rounded-l-lg hover:bg-emerald-600 focus:outline-none"
                >
                  USD
                </button>
                <button
                  @click="setCurrency('VND')"
                  :class="{
                    'bg-emerald-500 text-white': currentCurrency === 'VND',
                    'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white':
                      currentCurrency !== 'VND'
                  }"
                  class="px-4 py-2 rounded-r-lg hover:bg-emerald-600 focus:outline-none"
                >
                  VND
                </button>
              </div>

              <VueSlider
                v-model="salaryValues"
                :min="minBound"
                :max="maxBound"
                :interval="currentCurrency === 'USD' ? 50 : 1000000"
                :enable-cross="false"
                :tooltip="'none'"
                :process-style="{ backgroundColor: '#10B981' }"
                :dot-style="{ backgroundColor: '#10B981', borderColor: '#10B981' }"
                :rail-style="{ backgroundColor: '#E5E7EB' }"
              ></VueSlider>
            </div>
            <button
              @click="applySalaryFilter"
              class="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 w-full"
            >
              Apply
            </button>
          </div>
        </div>

        <div ref="levelDropdown" class="relative max-w-sm">
          <div
            @click="toggleLevelDropdown"
            class="flex items-center justify-between dark:bg-gray-700 py-3 px-6 rounded-lg cursor-pointer"
          >
            <i class="pi pi-chart-line text-green-700 mr-4 text-lg"></i>
            <span class="text-gray-900 dark:text-white text-lg flex-1">
              {{ 'Select level' }}
            </span>
          </div>

          <div
            v-if="isLevelDropdownOpen"
            class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 p-4"
          >
            <div
              v-for="levelOption in levels"
              :key="levelOption"
              class="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                :id="`level-${levelOption}`"
                :value="levelOption"
                v-model="selectedLevels"
                class="form-checkbox h-4 w-4 text-green-600 rounded-md focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                :for="`level-${levelOption}`"
                class="ml-3 text-gray-900 dark:text-white text-sm flex-1 cursor-pointer"
              >
                {{ levelOption }}
              </label>
            </div>
          </div>
        </div>

        <div ref="experienceDropdown" class="relative max-w-sm">
          <div
            @click="toggleExperienceDropdown"
            class="flex items-center justify-between dark:bg-gray-700 py-3 px-6 rounded-lg cursor-pointer"
          >
            <i class="pi pi-history text-green-700 mr-4 text-lg"></i>
            <span class="text-gray-900 dark:text-white text-lg flex-1">
              {{ selectedExperience || 'Select experience' }}
            </span>
            <button
              v-if="selectedExperience"
              @click.stop="clearExperience"
              class="text-gray-500 hover:text-red-500 ml-3"
            >
              ✕
            </button>
          </div>

          <div
            v-if="isExperienceDropdownOpen"
            class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10"
          >
            <ul class="max-h-48 overflow-y-auto">
              <li
                v-for="exp in experiences"
                :key="exp.value"
                @click="selectExperience(exp.display)"
                class="px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-ln"
              >
                {{ exp.display }}
              </li>
            </ul>
          </div>
        </div>
        <button
          v-if="areFiltersActive"
          @click="clearAllFilters"
          class="hover:text-red-500 px-3 py-1 rounded-md text-sm"
        >
          Clear
        </button>
        <div class="flex items-center space-x-4 ml-auto mr-8">
          <i class="pi pi-filter"></i>
          <h4 class="text-xl font-bold text-gray-800 dark:text-gray-200">Filters</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, defineEmits, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

const route = useRoute()

// State for cities, job types, and main search values
const cities = ref([])
const jobTypes = ref(['Full_Time', 'Part_Time', 'Internship'])
const keyword = ref('')
const selectedCity = ref('')
const selectedJobType = ref('')

// State for Additional Filters
const selectedSalaryRange = ref('') // This will hold the display string like "USD 100 - 1000"
const salaryValues = ref([0, 0]) // Initialize with some default, will be set by currency
const currentCurrency = ref('') // Default currency
const hasInteractedWithSalaryFilter = ref(false)

const setKeywordFromUrl = () => {
  if (route.query.skill) {
    keyword.value = route.query.skill
  } else if (route.query.title) {
    keyword.value = route.query.title
  } else {
    keyword.value = ''
  }
}
watch(
  () => route.query,
  () => {
    setKeywordFromUrl()
  },
  { deep: true, immediate: true }
)

// --- Computed Properties ---
const minBound = computed(() => {
  return currentCurrency.value === 'USD' ? 100 : 5000000
})

const maxBound = computed(() => {
  return currentCurrency.value === 'USD' ? 10000 : 100000000
})

const formattedSalaryRange = computed(() => {
  if (hasInteractedWithSalaryFilter.value == true) {
    const [min, max] = salaryValues.value
    if (currentCurrency.value === 'USD') {
      return `$${min} - $${max}`
    } else {
      // Format VND as "X M" for millions
      const formatVND = (value) => {
        if (value >= 1000000) {
          return `${value / 1000000}M`
        }
        // For values less than a million, format traditionally with Vietnamese locale
        return value.toLocaleString('vi-VN')
      }
      return `${formatVND(min)} - ${formatVND(max)}`
    }
  }
})

const selectedSalaryRangeDisplay = computed(() => {
  if (selectedSalaryRange.value) {
    return `${currentCurrency.value} ${selectedSalaryRange.value}`
  }
  return 'Select salary range' // Default display when nothing is selected
})

// --- Watchers ---
watch(
  currentCurrency,
  (newCurrency) => {
    salaryValues.value = [minBound.value, maxBound.value]
  },
  { immediate: true }
) // Run this on component mount

const setCurrency = (currency) => {
  currentCurrency.value = currency
  hasInteractedWithSalaryFilter.value = true
}

const clearSalary = () => {
  selectedSalaryRange.value = ''
  salaryValues.value = [0, 1000000000]
  currentCurrency.value = ''
  onSearch()
}

const levels = ref(['Fresher', 'Junior', 'Senior', 'Manager'])
const selectedLevels = ref([]) // CHANGED: Changed from ref('') to ref([]) for multiple selections
// Store a temporary copy of selected levels when dropdown opens
const tempSelectedLevels = ref([])

const experiences = ref([
  { display: '1+ years', value: '1+ years' },
  { display: '2+ years', value: '2+ years' },
  { display: '3+ years', value: '3+ years' },
  { display: '4+ years', value: '4+ years' },
  { display: '5+ years', value: '5+ years' }
])
const selectedExperience = ref('')

const isLocationDropdownOpen = ref(false)
const isJobTypeDropdownOpen = ref(false)
const isSalaryDropdownOpen = ref(false)
const isLevelDropdownOpen = ref(false)
const isExperienceDropdownOpen = ref(false)

const searchQuery = ref('')

// Refs for dropdown elements
const locationDropdown = ref(null)
const jobTypeDropdown = ref(null)
const salaryDropdown = ref(null)
const levelDropdown = ref(null)
const experienceDropdown = ref(null)

const emit = defineEmits(['search'])

// Fetch cities data on component mount
onMounted(async () => {
  setKeywordFromUrl()
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    cities.value = response.data.map((city) => ({ name: city.name, code: city.code }))
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
})

// Function to close all other dropdowns
const closeAllDropdowns = () => {
  isLocationDropdownOpen.value = false
  isJobTypeDropdownOpen.value = false
  isSalaryDropdownOpen.value = false
  isLevelDropdownOpen.value = false
  isExperienceDropdownOpen.value = false
}

// Toggle dropdown visibility
const toggleLocationDropdown = () => {
  closeAllDropdowns()
  isLocationDropdownOpen.value = true
}

const toggleJobTypeDropdown = () => {
  closeAllDropdowns()
  isJobTypeDropdownOpen.value = true
}

const toggleSalaryDropdown = () => {
  closeAllDropdowns()
  isSalaryDropdownOpen.value = true
}

const toggleLevelDropdown = () => {
  closeAllDropdowns()
  // When opening, copy current selected levels to temp for cancel/apply logic
  tempSelectedLevels.value = [...selectedLevels.value]
  isLevelDropdownOpen.value = true
}

const toggleExperienceDropdown = () => {
  closeAllDropdowns()
  isExperienceDropdownOpen.value = true
}

// Close dropdowns if clicked outside
const handleClickOutside = (event) => {
  if (locationDropdown.value && !locationDropdown.value.contains(event.target)) {
    isLocationDropdownOpen.value = false
  }
  if (jobTypeDropdown.value && !jobTypeDropdown.value.contains(event.target)) {
    isJobTypeDropdownOpen.value = false
  }
  if (salaryDropdown.value && !salaryDropdown.value.contains(event.target)) {
    isSalaryDropdownOpen.value = false
  }
  if (levelDropdown.value && !levelDropdown.value.contains(event.target)) {
    isLevelDropdownOpen.value = false
  }
  if (experienceDropdown.value && !experienceDropdown.value.contains(event.target)) {
    isExperienceDropdownOpen.value = false
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

// Select and Clear methods for each filter
const selectCity = (cityName) => {
  selectedCity.value = cityName
  isLocationDropdownOpen.value = false
}

const selectJobType = (type) => {
  selectedJobType.value = type
  isJobTypeDropdownOpen.value = false
}

// Salary Filter methods
const applySalaryFilter = () => {
  selectedSalaryRange.value = `$${salaryValues.value[0]} - $${salaryValues.value[1]}`
  isSalaryDropdownOpen.value = false
  onSearch()
}

const areFiltersActive = computed(() => {
  return (
    hasInteractedWithSalaryFilter.value == true ||
    selectedLevels.value.length > 0 ||
    selectedExperience.value !== ''
  )
})

const clearLevel = () => {
  selectedLevels.value = [] // Clear the array
  // Trigger search after clearing to reflect changes
  onSearch() // Call onSearch instead of direct emit for consistency
}

// Experience Filter methods
const selectExperience = (display) => {
  const exp = experiences.value.find((e) => e.display === display)
  selectedExperience.value = exp ? exp.display : ''
  isExperienceDropdownOpen.value = false
  onSearch()
}

const clearExperience = () => {
  selectedExperience.value = ''
  onSearch() // Call onSearch instead of direct emit for consistency
}

const clearAllFilters = () => {
  clearSalary()
  clearLevel()
  clearExperience()
  // Đảm bảo đóng tất cả dropdown nếu đang mở
  isSalaryDropdownOpen.value = false
  isLevelDropdownOpen.value = false
  isExperienceDropdownOpen.value = false
  hasInteractedWithSalaryFilter.value = false
}

// Clear main search filters (updated to include new filters)
const clearLocation = () => {
  selectedCity.value = ''
  onSearch() // Call onSearch instead of direct emit for consistency
}

const clearJobType = () => {
  selectedJobType.value = ''
  onSearch() // Call onSearch instead of direct emit for consistency
}

// Update onSearch to include all filters
const onSearch = () => {
  if (salaryValues.value[0] === minBound.value && salaryValues.value[1] === maxBound.value) {
    selectedSalaryRange.value = ''
  } else {
    selectedSalaryRange.value = formattedSalaryRange.value
  }
  if (hasInteractedWithSalaryFilter.value == false) {
    salaryValues.value = [null, null]
  }

  emit('search', {
    keyword: keyword.value,
    location: selectedCity.value,
    type: selectedJobType.value,
    salary: { min: salaryValues.value[0], max: salaryValues.value[1] },
    currency: currentCurrency.value,
    level: selectedLevels.value, // Now an array
    experience: selectedExperience.value
      ? experiences.value.find((e) => e.display === selectedExperience.value)?.value
      : ''
  })
}

watch(keyword, (newValue, oldValue) => {
  if (newValue === '') {
    onSearch()
  }
})

watch([selectedLevels, selectedExperience], () => {
  onSearch()
})
</script>

<style scoped>
/* Existing styles */
.max-h-48::-webkit-scrollbar {
  width: 8px;
}
.max-h-48::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
/* Basic styling for potential slider (you'd replace this with actual slider library styles) */
</style>
