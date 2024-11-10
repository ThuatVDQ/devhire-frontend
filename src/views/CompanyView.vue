<script setup>
import CompanyList from '@/components/CompanyList.vue'
import CardExploreJob from '@/components/CardExploreJob.vue'
import Accordion from '@/components/Accordion.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

const openAccordion = ref(null)

const handleToggleAccordion = (index) => {
  openAccordion.value = openAccordion.value === index ? null : index
}

const keyword = ref('')
const selectedCity = ref('')
const searchQuery = ref('')
const isLocationDropdownOpen = ref(false)
const cities = ref([])

const locationDropdown = ref(null)

const toggleLocationDropdown = () => {
  isLocationDropdownOpen.value = !isLocationDropdownOpen.value
}

const clearLocation = () => {
  selectedCity.value = ''
}

// Load list of cities
onMounted(async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    cities.value = response.data.map((city) => ({ name: city.name, code: city.code }))
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
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

const selectCity = (cityName) => {
  selectedCity.value = cityName
  isLocationDropdownOpen.value = false
}
const handleClickOutside = (event) => {
  if (locationDropdown.value && !locationDropdown.value.contains(event.target)) {
    isLocationDropdownOpen.value = false
  }
}

// Attach and detach the click event listener
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- Phần header của CompanyView -->
  <section
    class="relative table w-full py-36 bg-[url('../assets/banner.png')] bg-top bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0 bg-emerald-400/50"></div>
    <div class="container relative z-10">
      <div class="grid grid-cols-1 text-center">
        <h3
          class="md:text-4xl text-2xl md:leading-snug tracking-wide leading-snug font-bold text-white"
        >
          Companies
        </h3>
      </div>
    </div>
  </section>

  <section>
    <div class="container mx-auto pt-4">
      <div class="bg-white dark:bg-slate-900 shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <form class="flex items-center space-x-6">
          <!-- Search Input -->
          <div class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3 w-full">
            <i class="pi pi-briefcase text-green-700 mr-4 text-lg"></i>
            <input
              v-model="keyword"
              type="text"
              placeholder="Search..."
              class="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg"
            />
          </div>

          <!-- Custom Location Dropdown -->
          <div ref="locationDropdown" class="relative w-full">
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
        </form>
      </div>
    </div>
  </section>

  <!-- Phần CompanyList -->
  <section class="relative md:py-24 py-16">
    <div class="container">
      <div class="grid grid-cols-1 pb-8">
        <CompanyList />
      </div>
    </div>

    <!-- Các phần nội dung khác của CompanyView -->
    <div class="container md:mt-24 md:pb-16 mt-16">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-5 md:col-span-6">
          <div class="relative">
            <div class="relative">
              <img
                src="https://jobstack-shreethemes.vercel.app/static/media/ab01.016884c7bf778010e79c.jpg"
                alt=""
                class="lg:w-[400px] w-[280px] rounded-md shadow dark:shadow-gray-700"
              />
              <div class="absolute top-0 translate-y-2/4 end-0 text-center">
                <a
                  href=""
                  class="lightbox size-20 rounded-full shadow-lg dark:shadow-gray-700 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-emerald-600 dark:text-white"
                >
                  <i
                    class="pi pi-caret-right text-emerald-500 inline-flex items-center justify-center text-2xl"
                  ></i>
                </a>
              </div>
            </div>
            <div class="absolute md:-end-5 end-0 -bottom-16">
              <img
                src="https://jobstack-shreethemes.vercel.app/static/media/ab02.f851a3dde08585493f97.jpg"
                alt=""
                class="lg:w-[280px] w-[200px] border-8 border-white dark:border-slate-900 rounded-md shadow dark:shadow-gray-700"
              />
            </div>
          </div>
        </div>
        <div class="lg:col-span-7 md:col-span-6 mt-14 md:mt-0">
          <div class="lg:ms-5">
            <h3 class="mb-6 md:text-[26px] text-2xl md:leading-normal leading-normal font-semibold">
              Frequently Asked Questions
            </h3>
            <p class="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own personalized salary estimate.
              Read reviews on over 30000+ companies worldwide.
            </p>
            <div class="mt-8">
              <Accordion
                title="How does it work?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 0"
                @toggle="handleToggleAccordion(0)"
              />
              <Accordion
                title="Do I need a designer to use DevHire?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 1"
                @toggle="handleToggleAccordion(1)"
              />
              <Accordion
                title="What do I need to do to start selling?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 2"
                @toggle="handleToggleAccordion(2)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Hiển thị CardExploreJob -->
    <CardExploreJob />
  </section>
</template>
