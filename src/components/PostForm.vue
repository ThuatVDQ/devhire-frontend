<script setup>
import { reactive, onMounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import axios from 'axios'

// Reactive state
const state = reactive({
  selectedDate: '',
  categories: [],
  countries: [],
  cities: [],
  selectedCountry: ''
})

// On component mounted
onMounted(() => {
  // Khởi tạo Flatpickr
  flatpickr(document.querySelector('#deadline'), {
    dateFormat: 'd-m-Y', // Định dạng ngày
    onChange: (selectedDates, dateStr) => {
      state.selectedDate = dateStr // Cập nhật dữ liệu khi ngày được chọn
    }
  })

  fetchCategories()
  fetchCountries()
})

async function fetchCategories() {
  try {
    console.log('Fetching categories...')
    const response = await axios.get('http://localhost:8000/categories')
    state.categories = response.data
    console.log(state.categories)
  } catch (e) {
    console.error(e)
  }
}

async function fetchCountries() {
  try {
    console.log('Fetching countries...')
    const response = await axios.get('https://restcountries.com/v3.1/all') // API để lấy danh sách quốc gia
    // Sắp xếp danh sách quốc gia theo thứ tự chữ cái
    state.countries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (e) {
    console.error(e)
  }
}
async function fetchCities(countryCode) {
  try {
    console.log(`Fetching cities for country code: ${countryCode}...`)
    // Thay thế bằng URL thực tế hoặc dữ liệu tĩnh của bạn
    const response = await axios.get(`https://example.com/api/cities?country=${countryCode}`)
    state.cities = response.data.sort((a, b) => a.name.localeCompare(b.name))
    console.log(state.cities)
  } catch (e) {
    console.error(e)
  }
}

// Watch for changes in selected country and fetch corresponding cities
watch(
  () => state.selectedCountry,
  (newCountryCode) => {
    if (newCountryCode) {
      fetchCities(newCountryCode)
    } else {
      state.cities = []
    }
  }
)
</script>
<template>
  <section class="relative bg-slate-50 dark:bg-slate-800 lg:py-24 py-16">
    <div class="container">
      <div class="lg:flex justify-center">
        <div class="lg:w-2/3">
          <div class="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
            <div class="text-left">
              <div class="grid grid-cols-1">
                <h5 class="text-lg font-semibold">Job Details:</h5>
              </div>
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Title</label>
                  <input type="text" class="form-input" />
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Categories</label>
                  <select class="custom-select">
                    <option
                      v-for="category in state.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Type</label>
                  <select class="custom-select">
                    <option value="part-time">Part-Time</option>
                    <option value="full-time">Full-Time</option>
                  </select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Salary:</label>
                  <div class="relative mt-1">
                    <input type="number" class="form-input h-[38.56px]" placeholder="Min:" />
                  </div>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold md:invisible md:block hidden">Max:</label>
                  <div class="relative mt-1">
                    <input type="number" class="form-input h-[38.56px]" placeholder="Max: " />
                  </div>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Currency</label>
                  <select class="custom-select block w-full p-2.5 mt-1">
                    <option value="$">$</option>
                    <option value="VND">VND</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 mt-8">
                <h5 class="text-lg font-semibold">Job Information:</h5>
              </div>
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Description</label>
                  <textarea
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[100px]"
                  ></textarea>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Requirements</label>
                  <textarea
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-[100px]"
                  ></textarea>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Benefit</label>
                  <textarea
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-[100px]"
                  ></textarea>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Experience</label>
                  <input type="text" class="form-input" placeholder="Experience" />
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Position</label>
                  <input type="text" class="form-input" placeholder="Position" />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Slots</label>
                  <input type="number" class="form-input" />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Application Deadline</label>
                  <div class="relative mt-1">
                    <input
                      type="text"
                      id="deadline"
                      v-model="state.selectedDate"
                      ref="datepicker"
                      class="form-input pl-10"
                      placeholder="Select date"
                    />
                    <span
                      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                    >
                      <i class="pi pi-calendar-minus text-gray-500"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 mt-8">
                <h5 class="text-lg font-semibold">Address</h5>
              </div>
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Country</label>
                  <select class="custom-select" v-model="state.selectedCountry">
                    <option
                      v-for="country in state.countries"
                      :key="country.cca3"
                      :value="country.cca3"
                    >
                      {{ country.name.common }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">City</label>
                  <select class="custom-select">
                    <option v-for="city in state.cities" :key="city.id" :value="city.id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">District</label>
                  <select class="custom-select"></select>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Address</label>
                  <input type="text" class="form-input" placeholder="Address" />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <button
                    class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
                    type="submit"
                  >
                    Post Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
