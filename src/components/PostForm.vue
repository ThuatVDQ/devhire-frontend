<script setup>
import { reactive, onMounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import axios from 'axios'

const address = reactive({
  countries: [],
  addresses: [{ selectedCountry: '', selectedCity: '', selectedDistrict: '', street: '' }], // Danh sách các địa chỉ
  cities: []
})

// Hàm để thêm một địa chỉ mới
function addAddress() {
  address.addresses.push({
    selectedCountry: '',
    selectedCity: '',
    selectedDistrict: '',
    street: ''
  })
}

// Hàm để xóa một địa chỉ
function removeAddress(index) {
  if (address.addresses.length > 1) {
    // Đảm bảo có ít nhất 1 địa chỉ
    address.addresses.splice(index, 1)
  }
}

const inf = reactive({
  selectedDate: '',
  description:
    'We are looking for a motivated Intern to join our team. You will assist with various tasks, gain hands-on experience, and contribute to ongoing projects. The ideal candidate should be eager to learn, enthusiastic about technology, and ready to take on new challenges.',
  requirements: `- Currently pursuing a degree in Computer Science or a related field.
- Basic understanding of programming concepts and languages such as JavaScript or Python.
- Familiarity with development tools and frameworks is a plus.
- Strong willingness to learn and adapt to new technologies.
- Good communication skills and ability to work in a team.`,
  benefits: `- Opportunity to gain practical experience in a professional environment.
- Mentorship and guidance from experienced professionals.
- Flexible working hours and potential for remote work.
- Exposure to various technologies and development practices.
- Possibility of full-time employment upon successful completion of the internship.`,
  experience: '',
  position: 'Intern',
  slots: 10,
  skills: [] // Array to store multiple skills
})

const details = reactive({
  categories: [],
  title: 'Intern Software Engineer'
})

// Function to add a new skill
function addSkill() {
  inf.skills.push({ name: '' }) // Add an empty skill object to the array
}

// Function to remove a skill
function removeSkill(index) {
  inf.skills.splice(index, 1) // Remove the skill at the specified index
}

// On component mounted
onMounted(() => {
  flatpickr(document.querySelector('#deadline'), {
    dateFormat: 'd-m-Y',
    onChange: (selectedDates, dateStr) => {
      inf.selectedDate = dateStr
    }
  })

  fetchCategories()
  fetchCountries()
})

async function fetchCategories() {
  try {
    const response = await axios.get('http://localhost:8000/categories')
    details.categories = response.data
  } catch (e) {
    console.error(e)
  }
}

async function fetchCountries() {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all')
    address.countries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (e) {
    console.error(e)
  }
}

async function fetchCities(countryCode) {
  try {
    const response = await axios.get(`https://example.com/api/cities?country=${countryCode}`)
    address.cities = response.data.sort((a, b) => a.name.localeCompare(b.name))
  } catch (e) {
    console.error(e)
  }
}

// Watch for changes in selected country
watch(
  () => address.selectedCountry,
  (newCountryCode) => {
    if (newCountryCode) {
      fetchCities(newCountryCode)
    } else {
      address.cities = []
    }
  }
)
</script>
<template>
  <section class="relative bg-slate-50 dark:bg-slate-800 lg:py-16 py-16">
    <div class="container">
      <h1>Post a job</h1>
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
                  <select class="custom-select">
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
                  <label class="font-semibold mr-3">Skills</label>
                  <div
                    v-for="(skill, index) in inf.skills"
                    :key="index"
                    class="flex items-center gap-4 mb-4"
                  >
                    <input
                      v-model="skill.name"
                      type="text"
                      class="form-input flex-grow"
                      placeholder="Skill name"
                    />
                    <button
                      @click="removeSkill(index)"
                      class="px-3 py-2 bg-red-400 hover:bg-red-600 text-white rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    @click="addSkill"
                    class="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
                  >
                    Add Skill
                  </button>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Experience</label>
                  <input
                    v-model="inf.experience"
                    type="text"
                    class="form-input"
                    placeholder="Experience"
                  />
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Position</label>
                  <input
                    v-model="inf.position"
                    type="text"
                    class="form-input"
                    placeholder="Position"
                  />
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Slots</label>
                  <input v-model="inf.slots" type="number" class="form-input h-[44px]" />
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
                  <label class="font-semibold">Country</label>
                  <select
                    class="custom-select"
                    v-model="addr.selectedCountry"
                    @change="fetchCities(addr.selectedCountry)"
                  >
                    <option
                      v-for="country in address.countries"
                      :key="country.cca3"
                      :value="country.cca3"
                    >
                      {{ country.name.common }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">City</label>
                  <select class="custom-select" v-model="addr.selectedCity">
                    <option v-for="city in address.cities" :key="city.id" :value="city.id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">District</label>
                  <select class="custom-select" v-model="addr.selectedDistrict">
                    <!-- Danh sách quận, có thể cập nhật dữ liệu từ API -->
                  </select>
                </div>

                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Street</label>
                  <input
                    v-model="addr.street"
                    type="text"
                    class="form-input"
                    placeholder="Street address"
                  />
                </div>

                <div class="col-span-12 flex justify-end gap-4">
                  <button
                    @click="removeAddress(index)"
                    class="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                  <button
                    v-if="index === address.addresses.length - 1"
                    @click="addAddress"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-md"
                  >
                    Add Address
                  </button>
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
<style scoped>
h1 {
  font-size: 35px; /* Kích thước chữ của h1 */
  font-weight: bold; /* Chữ đậm */
  margin-bottom: 20px;
  color: #333;
}
</style>
