<template>
  <div class="container mx-auto p-4">
    <div v-if="!isCompanyExist && !isSigningUp" class="text-center bg-gray-100 p-4 rounded-lg">
      <p class="text-red-700 text-lg">There is currently no registered company in the system.</p>
      <button
        @click="isSigningUp = true"
        class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign Up
      </button>
    </div>

    <!-- Form Đăng Ký hoặc Chỉnh Sửa Công Ty -->
    <form v-else @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-4">
      <div class="flex items-center">
        <div class="relative inline-block">
          <img
            :src="currentAvatar"
            @error="currentAvatar = defaultAvatar"
            alt="avatar"
            class="w-20 h-20 rounded-full object-cover"
          />
          <i
            class="pi pi-camera absolute bottom-0 right-0 p-1 bg-gray-300 rounded-full text-xl cursor-pointer"
            style="transform: translate(25%, 25%)"
            @click="openPopup"
          ></i>
        </div>
        <div class="relative ml-4 w-1/2 items-center">
          <input
            v-model="company.name"
            type="text"
            id="name"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
          <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label for="tax_code" class="block mb-2 text-sm font-medium text-gray-700"
            >Tax Code</label
          >
          <input
            v-model="company.tax_code"
            type="text"
            id="tax_code"
            :readonly="isCompanyExist"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
          <span v-if="errors.tax_code" class="text-red-500 text-sm">{{ errors.tax_code }}</span>
        </div>

        <div>
          <label for="scale" class="block mb-2 text-sm font-medium text-gray-700">Scale</label>
          <input
            v-model="company.scale"
            type="number"
            id="scale"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="company.email"
            type="text"
            id="email"
            :readonly="isCompanyExist"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
          <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>
        <div>
          <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Phone</label>
          <input
            v-model="company.phone"
            type="text"
            id="phone"
            :readonly="isCompanyExist"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
          <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>
        </div>
        <div>
          <label for="address" class="block mb-2 text-sm font-medium text-gray-700">Address</label>
          <input
            v-model="company.address"
            type="text"
            id="address"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
          <span v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</span>
        </div>
        <div>
          <label for="web_url" class="block mb-2 text-sm font-medium text-gray-700"
            >Website URL</label
          >
          <input
            v-model="company.web_url"
            type="url"
            id="web_url"
            class="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
      </div>
      <div class="mt-4">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          v-model="company.description"
          id="description"
          class="border border-gray-300 rounded-md p-2 w-full"
          rows="4"
        ></textarea>
      </div>
      <button type="submit" class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded">
        {{ isCompanyExist ? 'Save' : 'Sign Up' }}
      </button>
    </form>
  </div>

  <EditAvatar
    v-if="showAvatarPopup"
    :cropAvatar="cropAvatar"
    @close="showAvatarPopup = false"
    :isLogoCompany="true"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import defaultAvatar from '../../assets/logo.svg'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import EditAvatar from '../../components/EditAvatar.vue'

const company = ref({})
const isCompanyExist = ref(false)
const isSigningUp = ref(false)
const errors = ref({})

const showAvatarPopup = ref(false)
const currentAvatar = ref(defaultAvatar)
const cropAvatar = ref(defaultAvatar)

const validateForm = () => {
  errors.value = {}

  if (!company.value.name) errors.value.name = 'Name is required.'

  if (!company.value.tax_code) errors.value.tax_code = 'Tax Code is required.'

  if (!company.value.email) {
    errors.value.email = 'Email is required.'
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(company.value.email)) {
    errors.value.email = 'Please enter a valid email address.'
  }

  if (!company.value.phone) {
    errors.value.phone = 'Phone is required.'
  } else if (!/^\d{10}$/.test(company.value.phone)) {
    errors.value.phone = 'Please enter a valid 10-digit phone number.'
  }

  if (!company.value.address) errors.value.address = 'Address is required.'

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (isCompanyExist.value) {
      const response = await axios.put(
        'http://localhost:8090/api/companies/updateCompany',
        company.value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      toastr.success('Updated company successfully', 'Success')
      console.log('Company Info Updated:', response.data)
    } else {
      const response = await axios.post('http://localhost:8090/api/companies', company.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toastr.success('Created company successfully', 'Success')
    }
  } catch (error) {
    if (error.response && Array.isArray(error.response.data)) {
      error.response.data.forEach((err) => {
        toastr.error(err, 'Error')
      })
    } else {
      toastr.error('An unexpected error occurred')
      console.error('Error submitting company info:', error)
    }
  }
}

const fetchCompanyInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/companies/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    company.value = response.data
    isCompanyExist.value = true
    if (company.value.logo) {
      currentAvatar.value = `http://localhost:8090/uploads/${company.value.logo}`
      cropAvatar.value = currentAvatar.value
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      isCompanyExist.value = false
    } else {
      console.error('Error fetching company info:', error)
    }
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchCompanyInfo()
  const message = sessionStorage.getItem('message')

  if (message) {
    toastr.success(message)
    sessionStorage.removeItem('message')
  }
})

const openPopup = () => {
  showAvatarPopup.value = true
}
</script>
