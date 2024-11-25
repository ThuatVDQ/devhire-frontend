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
        <label for="description" class="mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="company.description"
          id="description"
          class="border border-gray-300 rounded-md p-2 w-full"
          rows="10"
        ></textarea>
      </div>
      <div class="mt-4">
        <label for="images" class="block mb-2 text-sm font-medium text-gray-700">Images</label>
        <div class="relative">
          <!-- Input thực tế nhưng bị ẩn -->
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            @change="handleImageSelection"
            class="hidden"
            ref="fileInput"
          />
          <!-- Nút giả lập -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-100"
            @click="triggerFileInput"
            @dragover.prevent
            @dragenter.prevent
            @dragleave.prevent
            @drop.prevent="handleFileDrop"
          >
            Drag and drop your file here or click to browse
          </div>
        </div>
        <div v-if="selectedImages.length" class="grid grid-cols-3 gap-4 mt-4">
          <div
            v-for="(image, index) in selectedImages"
            :key="index"
            class="relative group border border-gray-300 rounded-md overflow-hidden"
          >
            <img
              :src="image"
              alt="Selected Image"
              class="w-full h-full object-contain border border-gray-300"
            />
            <button
              @click.prevent="removeImage(index)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        </div>
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

const selectedImages = ref([])
const selectedFileCount = ref(0) // Lưu số lượng tệp đã chọn
const fileInput = ref(null) // Lưu trữ các ảnh đã chọn

const triggerFileInput = () => {
  // Kích hoạt input file khi nhấn nút giả lập
  fileInput.value.click()
}

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)

  files.forEach((file) => {
    // Kiểm tra loại file có phải là image không
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push(e.target.result) // Thêm ảnh vào danh sách hiển thị
      }
      reader.readAsDataURL(file)
    } else {
      toastr.error(`${file.name} is not a valid image file.`, 'Invalid File')
    }
  })
}

const handleImageSelection = (event) => {
  const files = Array.from(event.target.files)
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImages.value.push(e.target.result)
      selectedFileCount.value = selectedImages.value.length // Thêm ảnh vào danh sách hiển thị
    }
    reader.readAsDataURL(file)
  }

  // Cập nhật số lượng tệp
  selectedFileCount.value = selectedImages.value.length

  // Reset input file để cho phép chọn lại cùng file
  event.target.value = null
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1) // Xóa ảnh khỏi danh sách hiển thị
  selectedFileCount.value = selectedImages.value.length // Cập nhật số lượng tệp

  // Nếu không còn ảnh nào, reset input file
  if (selectedImages.value.length === 0) {
    const fileInputEl = document.getElementById('images')
    if (fileInputEl) {
      fileInputEl.value = null
    }
  }
}

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

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1] // Lấy MIME type từ metadata (vd: "image/png")
  const bstr = atob(arr[1]) // Giải mã base64 thành chuỗi binary
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n) // Chuyển đổi từng ký tự binary
  }
  // Sử dụng MIME type để tự động đặt phần mở rộng cho file
  const extension = mime.split('/')[1] // Lấy phần mở rộng từ MIME (vd: "png", "jpeg")
  return new File([u8arr], `${filename}.${extension}`, { type: mime })
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const formData = new FormData()

    formData.append('name', company.value.name)
    formData.append('tax_code', company.value.tax_code)
    formData.append('scale', company.value.scale)
    formData.append('email', company.value.email)
    formData.append('phone', company.value.phone)
    formData.append('address', company.value.address)
    formData.append('web_url', company.value.web_url)
    formData.append('description', company.value.description)

    // Thêm các tệp ảnh vào FormData
    selectedImages.value.forEach((image, index) => {
      const file = dataURLtoFile(image, `image_${index}`)
      formData.append('images', file)
      console.log('File added:', file)
    })
    // In ra nội dung của FormData trước khi gửi
    formData.forEach((value, key) => {
      console.log(key, value)
    })
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
