<template>
  <div class="container mx-auto p-4">
    <div v-if="!isCompanyExist && !isSigningUp" class="text-center bg-white p-4 rounded-lg">
      <p class="text-red-700 text-lg">There is currently no registered company in the system.</p>
      <button
        @click="isSigningUp = true"
        class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign Up
      </button>
    </div>

    <!-- Form Đăng Ký hoặc Chỉnh Sửa Công Ty -->
    <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg p-4">
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
        <div
          class="relative group ml-4 flex items-center text-gray-700 text-lg font-semibold whitespace-nowrap cursor-pointer"
        >
          <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
          <span>Score: {{ company.score?.totalScore?.toFixed(1) }}/100</span>
          <i class="pi pi-info-circle text-blue-500 ml-2"></i>

          <!-- Tooltip: nằm bên trong .group -->
          <div
            class="absolute z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 bg-white border border-gray-300 rounded-md shadow-md p-3 text-sm w-max top-full left-0 mt-2"
          >
            <div class="grid grid-cols-2 gap-x-2 gap-y-1 items-center">
              <div class="flex items-center">
                <i class="pi pi-star text-yellow-500 mr-1"></i>
                <span>Star Rating:</span>
              </div>
              <div class="text-right font-semibold">
                {{ company.score?.starRating?.toFixed(1) }}
              </div>

              <div class="flex items-center">
                <i class="pi pi-briefcase mr-1"></i>
                <span>Jobs Score:</span>
              </div>
              <div class="text-right font-semibold">
                {{ company.score?.scoreDetails?.jobs?.toFixed(2) }}
              </div>

              <div class="flex items-center">
                <i class="pi pi-comments mr-1"></i>
                <span>Reviews Score:</span>
              </div>
              <div class="text-right font-semibold">
                {{ company.score?.scoreDetails?.reviews?.toFixed(2) }}
              </div>

              <div class="flex items-center">
                <i class="pi pi-money-bill mr-1"></i>
                <span>Salary Score:</span>
              </div>
              <div class="text-right font-semibold">
                {{ company.score?.scoreDetails?.salary?.toFixed(2) }}
              </div>

              <div class="flex items-center">
                <i class="pi pi-building mr-1"></i>
                <span>Scale Score:</span>
              </div>
              <div class="text-right font-semibold">
                {{ company.score?.scoreDetails?.scale?.toFixed(2) }}
              </div>
            </div>
          </div>
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

      <button type="submit" class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded">
        {{ isCompanyExist ? 'Save' : 'Sign Up' }}
      </button>
    </form>

    <div v-if="isCompanyExist" class="p-4">
      <div class="mb-4">
        <label for="license" class="block mb-2 text-sm font-medium text-gray-700"
          >Company License</label
        >
        <div class="relative">
          <input
            type="file"
            id="license"
            accept="application/pdf, image/*"
            @change="handleLicenseSelection"
            class="hidden"
            ref="licenseInput"
          />
          <div
            class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-100"
            @click="triggerLicenseInput"
          >
            Drag and drop your license file here or click to browse
          </div>
        </div>
        <div v-if="selectedLicense" class="mt-4 flex items-center gap-4">
          <img
            :src="
              typeof selectedLicense === 'string'
                ? selectedLicense
                : URL.createObjectURL(selectedLicense)
            "
            alt="Company Image"
            class="h-[150px] object-contain object-center border border-gray-300"
          />
        </div>
        <button
          @click="uploadLicense"
          class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload License
        </button>
      </div>
      <div>
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
              :src="typeof image === 'string' ? image : URL.createObjectURL(image)"
              alt="Company Image"
              class="w-full h-[150px] object-contain object-center border border-gray-300"
            />
            <button
              @click.prevent="removeImage(index)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        </div>
        <button
          @click="uploadImages"
          class="mt-4 bg-emerald-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload Images
        </button>
      </div>
    </div>
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
const oldImages = ref([]) // Danh sách ảnh cũ
const newImages = ref([])
const selectedFileCount = ref(0) // Lưu số lượng tệp đã chọn
const fileInput = ref(null) // Lưu trữ các ảnh đã chọn

const selectedLicense = ref(null)
const licenseInput = ref(null)
const newLicense = ref(null)

const triggerFileInput = () => {
  // Kích hoạt input file khi nhấn nút giả lập
  fileInput.value.click()
}

const handleFileDrop = (event) => {
  event.preventDefault() // Ngăn chặn hành vi mặc định của trình duyệt
  const files = Array.from(event.dataTransfer.files) // Lấy danh sách file từ sự kiện kéo-thả

  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.value.push({ file, base64: e.target.result })
        selectedImages.value.push(e.target.result) // Hiển thị Base64 cho giao diện
      }
      reader.readAsDataURL(file)
    } else {
      toastr.error(`${file.name} is not a valid image file.`, 'Invalid File') // Thông báo lỗi
    }
  })
}

const handleImageSelection = (event) => {
  const files = Array.from(event.target.files) // Lấy danh sách file được chọn

  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.value.push({ file, base64: e.target.result })
        selectedImages.value.push(e.target.result) // Hiển thị Base64 cho giao diện
      }
      reader.readAsDataURL(file)
    } else {
      toastr.error(`${file.name} is not a valid image file.`, 'Invalid File') // Thông báo lỗi
    }
  })

  selectedFileCount.value = selectedImages.value.length // Cập nhật số lượng ảnh được chọn

  // Reset giá trị input để cho phép chọn lại cùng file
  event.target.value = null
}

const removeImage = (index) => {
  const image = selectedImages.value[index]

  if (typeof image === 'string' && image.startsWith('http://localhost:8090/uploads/')) {
    // Loại ảnh cũ khỏi danh sách oldImages
    oldImages.value = oldImages.value.filter(
      (img) => `http://localhost:8090/uploads/${img}` !== image
    )
  } else {
    // Tìm ảnh trong newImages bằng Base64
    const imgIndex = newImages.value.findIndex((img) => img.base64 === image)

    if (imgIndex !== -1) {
      newImages.value.splice(imgIndex, 1) // Loại ảnh khỏi danh sách newImages
    }
  }

  // Xóa ảnh khỏi danh sách hiển thị
  selectedImages.value.splice(index, 1)
  selectedFileCount.value = selectedImages.value.length // Cập nhật số lượng ảnh

  // Nếu không còn ảnh nào, reset input file
  if (selectedImages.value.length === 0) {
    const fileInputEl = document.getElementById('images')
    if (fileInputEl) {
      fileInputEl.value = null
    }
  }
}

const uploadImages = async () => {
  if (!selectedImages.value.length) {
    toastr.error('Please select at least one image to upload', 'Error')
    return
  }

  const formData = new FormData()

  // Thêm danh sách ảnh cũ
  formData.append('oldImages', JSON.stringify(oldImages.value))
  console.log(oldImages.value)

  // Thêm các file ảnh mới
  newImages.value.forEach((imageObj) => {
    formData.append('newImages', imageObj.file)
  })

  try {
    const response = await axios.put('http://localhost:8090/api/companies/updateImages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    toastr.success('Images uploaded successfully', 'Success')
    fetchCompanyInfo()
    newImages.value = []
  } catch (error) {
    toastr.error('Failed to upload images', 'Error')
    console.error('Error uploading images:', error)
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
    } else {
      const response = await axios.post('http://localhost:8090/api/companies', company.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toastr.success('Created company successfully', 'Success')
      isCompanyExist.value = true
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
    if (company.value.images && Array.isArray(company.value.images)) {
      oldImages.value = company.value.images
      selectedImages.value = company.value.images.map(
        (image) => `http://localhost:8090/uploads/${image}`
      ) // Hiển thị ảnh cũ trong giao diện
    }
    if (company.value.business_license) {
      selectedLicense.value = `http://localhost:8090/uploads/${company.value.business_license}`
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      isCompanyExist.value = false
    } else {
      console.error('Error fetching company info:', error)
    }
  }
}

const fetchCompanyScore = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/scoring/company', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    company.value.score = response.data
  } catch (error) {
    console.error('Error fetching company score:', error)
  }
}
// Fetch data on component mount
onMounted(() => {
  fetchCompanyInfo()
  fetchCompanyScore()
  const message = sessionStorage.getItem('message')

  if (message) {
    toastr.success(message)
    sessionStorage.removeItem('message')
  }
})

const openPopup = () => {
  showAvatarPopup.value = true
}

const triggerLicenseInput = () => {
  licenseInput.value.click()
}

const handleLicenseSelection = (event) => {
  const file = event.target.files[0]

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = (e) => {
      newLicense.value = { file, base64: e.target.result }
      selectedLicense.value = e.target.result // Gán Base64 vào selectedLicense
    }

    reader.readAsDataURL(file) // Đọc ảnh dưới dạng Base64
  } else {
    toastr.error('Only image files are allowed.', 'Invalid File')
  }

  // Reset giá trị input để có thể chọn lại cùng file
  event.target.value = null
}

const removeLicense = () => {
  selectedLicense.value = null
  licenseInput.value.value = null
}

const uploadLicense = async () => {
  if (!selectedLicense.value) {
    toastr.error('Please select a company license to upload', 'Error')
    return
  }
  const formData = new FormData()
  formData.append('license', newLicense.value.file)

  try {
    const response = await axios.post(
      'http://localhost:8090/api/companies/verify-license',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    toastr.success('License uploaded successfully', 'Success')
    selectedLicense.value = null
  } catch (error) {
    toastr.error('Failed to upload license', 'Error')
    console.error('Error uploading license:', error)
  }
}
</script>
