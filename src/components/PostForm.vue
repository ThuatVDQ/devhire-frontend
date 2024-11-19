<script setup>
import { reactive, onMounted, computed, ref, onUnmounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['submit'])

const props = defineProps({
  job: Object,
  skills: Array,
  address: Array
})

const errors = reactive({
  salary: '',
  slots: ''
})

const address = reactive({
  addresses: [
    {
      selectedCity: '',
      selectedCityName: '',
      selectedDistrict: '',
      selectedDistrictName: '',
      street: '',
      districts: [],
      isCityDropdownOpen: false
    }
  ],
  cities: []
})

const isCityDropdownOpen = ref(false)
const searchQuery = ref('')

function toggleCityDropdown(index) {
  address.addresses[index].isCityDropdownOpen = !address.addresses[index].isCityDropdownOpen
}

function handleClickOutside(event) {
  address.addresses.forEach((addr, index) => {
    const dropdown = document.querySelector(`.city-dropdown-${index}`)
    if (dropdown && !dropdown.contains(event.target)) {
      addr.isCityDropdownOpen = false
    }
  })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Hàm xóa dấu tiếng Việt để tìm kiếm dễ hơn
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

// Lọc danh sách thành phố dựa trên chuỗi tìm kiếm `searchQuery`
const filteredCities = computed(() => {
  if (!searchQuery.value) return address.cities
  const search = removeVietnameseTones(searchQuery.value.trim().toLowerCase())
  return address.cities.filter((city) =>
    removeVietnameseTones(city.name.toLowerCase()).includes(search)
  )
})

// Chọn thành phố và đóng dropdown
function selectCity(city, index) {
  address.addresses[index].selectedCity = city.code
  address.addresses[index].selectedCityName = city.name
  isCityDropdownOpen.value = false
  setDistricts(index)
}

function addAddress() {
  address.addresses.push({
    selectedCity: '',
    selectedCityName: '',
    selectedDistrict: '',
    selectedDistrictName: '',
    street: '',
    districts: [],
    isCityDropdownOpen: false // Biến riêng để mở dropdown cho từng địa chỉ
  })
}

function removeAddress(index) {
  if (address.addresses.length > 1) {
    address.addresses.splice(index, 1)
  }
}

const inf = reactive({
  selectedDate: '',
  description: '',
  requirements: '',
  benefits: '',
  experience: '',
  position: '',
  level: '',
  salaryStart: 0,
  salaryEnd: 0,
  type: '',
  currency: '',
  slots: 0,
  skills: []
})

const details = reactive({
  categories: [],
  title: '',
  selectedCategoryId: ''
})

watch(
  () => props.job,
  (newJob) => {
    if (newJob) {
      details.title = newJob.title || ''
      details.selectedCategoryId = newJob.category?.id || ''
      inf.description = newJob.description || ''
      inf.requirements = newJob.requirement || ''
      inf.benefits = newJob.benefit || ''
      inf.experience = newJob.experience || ''
      inf.position = newJob.position || ''
      inf.level = newJob.level || ''
      inf.salaryStart = newJob.salary_start || 0
      inf.salaryEnd = newJob.salary_end || 0
      inf.type = newJob.type || 'FULL_TIME'
      inf.currency = newJob.currency || 'VND'
      inf.slots = newJob.slots || 1
      inf.selectedDate = new Date(newJob.deadline).toISOString().split('T')[0] || ''
    }
  },
  { immediate: true }
)

watch(
  () => props.skills,
  (newSkills) => {
    inf.skills = newSkills.map((skill) => ({ name: skill.name }))
  },
  { immediate: true } // Chạy ngay khi component khởi tạo
)

watch(
  () => props.address,
  (newAddress) => {
    address.addresses = newAddress.length
      ? newAddress.map((addr) => ({
          selectedCity: addr.selectedCity || '',
          selectedCityName: addr.selectedCityName || '',
          selectedDistrict: addr.selectedDistrict || '',
          selectedDistrictName: addr.selectedDistrictName || '',
          street: addr.street || '',
          districts: addr.districts || [],
          isCityDropdownOpen: false
        }))
      : [
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
  },
  { immediate: true }
)

function addSkill() {
  inf.skills.push({ name: '' })
}

function removeSkill(index) {
  inf.skills.splice(index, 1)
}

async function fetchCities() {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')
    address.cities = response.data

    // Kiểm tra và đảm bảo `addresses` có ít nhất một phần tử
    if (address.addresses.length === 0) {
      address.addresses.push({
        selectedCity: '',
        selectedCityName: '',
        selectedDistrict: '',
        selectedDistrictName: '',
        street: '',
        districts: [],
        isCityDropdownOpen: false
      })
    }

    // Gán giá trị cho địa chỉ đầu tiên
    if (address.cities.length > 0 && address.addresses[0]) {
      address.addresses[0].selectedCity = address.cities[0].code
      address.addresses[0].selectedCityName = address.cities[0].name
      address.addresses[0].districts = address.cities[0].districts

      if (address.addresses[0].districts.length > 0) {
        address.addresses[0].selectedDistrict = address.addresses[0].districts[0].code
        address.addresses[0].selectedDistrictName = address.addresses[0].districts[0].name
      }
    }
  } catch (e) {
    console.error('Error fetching cities:', e)
  }
}

function setDistricts(index) {
  const selectedCityCode = address.addresses[index].selectedCity
  const city = address.cities.find((city) => city.code === selectedCityCode)
  if (city) {
    address.addresses[index].districts = city.districts
    address.addresses[index].selectedCityName = city.name
  } else {
    address.addresses[index].districts = []
    address.addresses[index].selectedCityName = ''
  }
}

function setDistrictName(index) {
  const selectedDistrictCode = address.addresses[index].selectedDistrict
  const district = address.addresses[index].districts.find(
    (district) => district.code === selectedDistrictCode
  )
  address.addresses[index].selectedDistrictName = district ? district.name : ''
}

function validateSalary() {
  if (inf.salaryEnd <= inf.salaryStart) {
    errors.salary = 'End salary must be greater than start salary.'
  } else {
    errors.salary = ''
  }
}

function validateSlots() {
  if (inf.slots <= 0) {
    errors.slots = 'Slots must be greater than 0.'
  } else {
    errors.slots = ''
  }
}

function validateForm() {
  // Khởi tạo một biến để theo dõi xem form có hợp lệ hay không
  let isValid = true

  // Kiểm tra các trường bắt buộc trong details và inf
  if (!details.title) {
    toastr.error('Job title is required.')
    isValid = false
  }
  if (!details.selectedCategoryId) {
    toastr.error('Category is required.')
    isValid = false
  }
  if (!inf.type) {
    toastr.error('Job type is required.')
    isValid = false
  }
  if (!inf.currency) {
    toastr.error('Currency is required.')
    isValid = false
  }
  if (!inf.description) {
    toastr.error('Description is required.')
    isValid = false
  }
  if (!inf.requirements) {
    toastr.error('Requirements are required.')
    isValid = false
  }
  if (!inf.benefits) {
    toastr.error('Benefits are required.')
    isValid = false
  }
  if (!inf.experience) {
    toastr.error('Experience is required.')
    isValid = false
  }
  if (!inf.position) {
    toastr.error('Position is required.')
    isValid = false
  }
  if (!inf.level) {
    toastr.error('Level is required.')
    isValid = false
  }
  if (inf.salaryEnd < inf.salaryStart) {
    toastr.error('End salary must be greater than start salary.')
    isValid = false
  }
  if (inf.salaryStart < 0 || inf.salaryEnd < 0) {
    toastr.error('Salary cannot be a negative number.')
    isValid = false
  }
  if (!inf.selectedDate) {
    toastr.error('Application deadline is required.')
    isValid = false
  }
  if (inf.slots <= 0) {
    toastr.error('Number of slots must be greater than 0.')
    isValid = false
  }

  // Kiểm tra các địa chỉ trong mảng addresses
  address.addresses.forEach((addr, index) => {
    if (!addr.selectedCity || !addr.selectedDistrict || !addr.street) {
      toastr.error(`Address ${index + 1} is incomplete.`)
      isValid = false
    }
  })

  return isValid
}

async function submitForm() {
  if (!validateForm()) {
    return
  }

  try {
    const data = {
      title: details.title,
      description: inf.description,
      salary_start: inf.salaryStart,
      salary_end: inf.salaryEnd,
      type: inf.type,
      currency: inf.currency,
      experience: inf.experience,
      position: inf.position,
      level: inf.level,
      requirement: inf.requirements,
      benefit: inf.benefits,
      deadline: inf.selectedDate,
      slots: inf.slots,
      category: {
        id: details.selectedCategoryId
      },
      addresses: address.addresses.map((addr) => ({
        country: 'Việt Nam',
        street: addr.street,
        city: addr.selectedCityName,
        district: addr.selectedDistrictName
      })),
      skills: inf.skills.map((skill) => ({
        name: skill.name
      }))
    }
    console.log(data)

    const response = await axios.post('http://localhost:8090/api/jobs', data, {
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
  }
}

function handleSubmit() {
  if (!validateForm()) {
    return
  }

  const data = {
    title: details.title,
    description: inf.description,
    salary_start: inf.salaryStart,
    salary_end: inf.salaryEnd,
    type: inf.type,
    currency: inf.currency,
    experience: inf.experience,
    position: inf.position,
    level: inf.level,
    requirement: inf.requirements,
    benefit: inf.benefits,
    deadline: inf.selectedDate,
    slots: inf.slots,
    category: {
      id: details.selectedCategoryId
    },
    addresses: address.addresses.map((addr) => ({
      country: 'Việt Nam',
      street: addr.street,
      city: addr.selectedCityName,
      district: addr.selectedDistrictName
    })),
    skills: inf.skills.map((skill) => ({
      name: skill.name
    }))
  }
  emit('submit', data)
}

onMounted(async () => {
  flatpickr(document.querySelector('#deadline'), {
    dateFormat: 'Y-m-d',
    minDate: 'today',
    onChange: (selectedDates, dateStr) => {
      inf.selectedDate = dateStr
    }
  })

  await fetchCategories()
  await fetchCities()

  if (details.selectedCategoryId === '') details.selectedCategoryId = details.categories[0].id
  if (inf.type === '') inf.type = 'FULL_TIME'
  if (inf.currency === '') inf.currency = 'USD'
})

async function fetchCategories() {
  try {
    const response = await axios.get('http://localhost:8090/api/category')
    details.categories = response.data
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="relative bg-slate-50 dark:bg-slate-800 lg:py-16 py-10">
    <div class="container">
      <div class="lg:flex justify-center">
        <div>
          <div class="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
            <div class="text-left">
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Title</label>
                  <input v-model="details.title" type="text" class="form-input" />
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Categories</label>
                  <select v-model="details.selectedCategoryId" class="custom-select">
                    <option
                      v-for="category in details.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Type</label>
                  <select v-model="inf.type" class="custom-select">
                    <option value="PART_TIME">Part-Time</option>
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Salary:</label>
                  <div class="relative mt-1">
                    <input
                      v-model="inf.salaryStart"
                      type="number"
                      class="form-input h-[38.56px]"
                      placeholder="Min:"
                      @input="validateSalary"
                    />
                  </div>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold md:invisible md:block hidden">Max:</label>
                  <div class="relative mt-1">
                    <input
                      v-model="inf.salaryEnd"
                      type="number"
                      class="form-input h-[38.56px]"
                      placeholder="Max: "
                      @input="validateSalary"
                    />
                    <p v-if="errors.salary" class="text-red-500 text-sm mt-1">
                      {{ errors.salary }}
                    </p>
                  </div>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Currency</label>
                  <select v-model="inf.currency" class="custom-select block w-full p-2.5 mt-1">
                    <option value="USD">USD</option>
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
                    v-model="inf.description"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[200px]"
                  ></textarea>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Requirements</label>
                  <textarea
                    v-model="inf.requirements"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-[200px]"
                  ></textarea>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Benefit</label>
                  <textarea
                    v-model="inf.benefits"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-[200px]"
                  ></textarea>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <div class="flex items-center gap-4">
                    <label class="font-semibold">Skills</label>
                    <i
                      class="pi pi-plus-circle text-green-600 text-3xl font-bold cursor-pointer"
                      @click="addSkill"
                      title="Add skill"
                    ></i>
                  </div>
                  <div
                    v-for="(skill, index) in inf.skills"
                    :key="index"
                    class="flex items-center gap-4 mb-4 mt-2"
                  >
                    <input
                      v-model="skill.name"
                      type="text"
                      class="form-input flex-grow"
                      placeholder="Skill name"
                    />
                    <i
                      class="pi pi-minus-circle text-red-600 text-3xl font-bold cursor-pointer"
                      @click="removeSkill(index)"
                      title="Remove skill"
                    ></i>
                  </div>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Experience</label>
                  <input
                    v-model="inf.experience"
                    type="text"
                    class="form-input"
                    placeholder="Experience"
                  />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Position</label>
                  <input
                    v-model="inf.position"
                    type="text"
                    class="form-input"
                    placeholder="Position"
                  />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Level</label>
                  <input v-model="inf.level" type="text" class="form-input" placeholder="Level" />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Slots</label>
                  <input
                    v-model="inf.slots"
                    type="number"
                    class="form-input h-[44px]"
                    @input="validateSlots"
                  />
                  <p v-if="errors.slots" class="text-red-500 text-sm mt-1">{{ errors.slots }}</p>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Application Deadline</label>
                  <div class="relative flex items-center h-[44px]">
                    <input
                      type="text"
                      id="deadline"
                      v-model="inf.selectedDate"
                      ref="datepicker"
                      class="form-input h-[44px] pl-10 w-full"
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
              <div
                v-for="(addr, index) in address.addresses"
                :key="index"
                class="grid grid-cols-12 gap-4 mt-4"
              >
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">City</label>
                  <div class="relative w-full" :class="`city-dropdown-${index}`">
                    <div
                      @click="toggleCityDropdown(index)"
                      class="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 h-10"
                    >
                      <span class="text-gray-900 dark:text-white">
                        {{ addr.selectedCityName || 'Select city' }}
                      </span>
                    </div>

                    <div
                      v-if="addr.isCityDropdownOpen"
                      class="absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10"
                    >
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search city..."
                        class="w-full px-5 py-3 border-b border-gray-200 outline-none focus:border-green-500"
                      />

                      <ul class="max-h-48 overflow-y-auto">
                        <li
                          v-for="city in filteredCities"
                          :key="city.code"
                          @click="selectCity(city, index)"
                          class="px-5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {{ city.name }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">District</label>
                  <select
                    class="custom-select h-10"
                    v-model="addr.selectedDistrict"
                    @change="setDistrictName(index)"
                  >
                    <option
                      v-for="district in addr.districts"
                      :key="district.code"
                      :value="district.code"
                    >
                      {{ district.name }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Street</label>
                  <input
                    v-model="addr.street"
                    type="text"
                    class="form-input h-10"
                    placeholder="Street address"
                  />
                </div>

                <div class="col-span-12 flex justify-end gap-4">
                  <i
                    class="pi pi-minus-circle text-red-600 text-3xl font-bold cursor-pointer"
                    @click="removeAddress(index)"
                    title="Remove address"
                  ></i>
                  <i
                    v-if="index === address.addresses.length - 1"
                    class="pi pi-plus-circle text-green-600 text-3xl font-bold cursor-pointer"
                    @click="addAddress"
                    title="Add address"
                  ></i>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <button
                    class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
                    type="submit"
                    @click="handleSubmit"
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
<style scoped>
h1 {
  font-size: 35px; /* Kích thước chữ của h1 */
  font-weight: bold; /* Chữ đậm */
  margin-bottom: 20px;
  color: #333;
}
</style>
