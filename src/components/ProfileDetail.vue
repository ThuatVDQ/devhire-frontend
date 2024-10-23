<script setup>
import { reactive, onMounted, ref } from 'vue'
import axios from 'axios'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import defaultAvatar from '../assets/avatar-default.svg'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const data = reactive({
  user: {}
})

const showPopup = ref(false)
const selectedImage = ref(null)
const currentAvatar = ref('')
const cropAvatar = ref('')
const cropper = ref(null)

async function fetchDataUser() {
  try {
    const response = await axios.get('http://localhost:8090/api/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    data.user = response.data
    if (data.user.avatar_url) {
      currentAvatar.value = `http://localhost:8090/uploads/${data.user.avatar_url}`
      cropAvatar.value = currentAvatar.value
    }
  } catch (e) {
    console.error(e)
  }
}

const openPopup = () => {
  showPopup.value = true // Mở popup
}

const closePopup = () => {
  showPopup.value = false // Đóng popup
  if (cropper.value) {
    cropper.value.destroy() // Giải phóng cropper
    cropper.value = null // Đặt lại biến
  }
}

let cropTimeout // Biến để lưu trữ bộ đếm thời gian

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target.result // Lưu hình ảnh đã chọn

      // Nếu cropper đã tồn tại, giải phóng nó
      if (cropper.value) {
        cropper.value.destroy()
      }

      // Tạo một img element để hiển thị trong cropper
      const imageElement = document.createElement('img')
      imageElement.src = selectedImage.value

      const cropperContainer = document.querySelector('#cropper-container')
      cropperContainer.innerHTML = '' // Xóa nội dung cũ
      cropperContainer.appendChild(imageElement) // Thêm img vào container

      // Khởi tạo cropper
      cropper.value = new Cropper(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        crop: () => {
          // Hủy bộ đếm thời gian trước đó
          clearTimeout(cropTimeout)

          // Thiết lập bộ đếm thời gian để cập nhật avatar
          cropTimeout = setTimeout(() => {
            cropper.value.getCroppedCanvas().toBlob((blob) => {
              if (blob) {
                cropAvatar.value = URL.createObjectURL(blob) // Cập nhật avatar
              }
            })
          }, 200) // Cập nhật sau 300 mili giây
        }
      })
    }
    reader.readAsDataURL(file)
  }
}

const saveImage = () => {
  if (cropper.value) {
    cropper.value.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData()
      formData.append('file', blob)

      axios
        .post('http://localhost:8090/api/users/uploadAvatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          currentAvatar.value = URL.createObjectURL(blob)
          window.location.reload()
          toastr.success(response.data)
        })
        .catch((error) => {
          toastr.error('Error uploading image:', error)
        })

      closePopup()
    })
  } else {
    const formData = new FormData()
    formData.append('file', null)
    axios
      .put(
        'http://localhost:8090/api/users/deleteAvatar',
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then((response) => {
        currentAvatar.value = '@/assets/default-avatar.svg'
        toastr.success(response.data)
      })
      .catch((error) => {
        toastr.error('Error deleting avatar:', error.response.data || error.message)
      })
  }
}

const fileInput = ref(null) // Khai báo ref cho input file

const changeImage = () => {
  selectedImage.value = null // Đặt lại selectedImage
  fileInput.value.click() // Mở hộp thoại chọn file
}

const removeImage = () => {
  selectedImage.value = null
  cropAvatar.value = null
  const cropperContainer = document.querySelector('#cropper-container')
  cropperContainer.innerHTML = 'Click to select an image to upload!'
}

onMounted(() => {
  fetchDataUser()
})
</script>

<template>
  <section class="bg-gray-200 dark:bg-gray-800 py-8">
    <div class="container">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-4 md:col-span-6">
          <div
            class="relative md:flex items-center p-2 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <div class="relative">
              <img
                :src="currentAvatar"
                @error="currentAvatar = defaultAvatar"
                alt="User Avatar"
                class="rounded-full size-28 bg-white dark:bg-slate-900 dark:shadow-gray-700"
              />
              <i
                class="pi pi-camera absolute bottom-0 right-0 p-1 bg-gray-300 rounded-full text-xl cursor-pointer"
                style="transform: translate(25%, 25%)"
                @click="openPopup"
              ></i>
            </div>
            <div class="md:ms-4 md:mt-0 mt-6">
              <h3 class="text-xl font-semibold">Welcome, {{ data.user.full_name }}</h3>
              <div class="mt-2">
                <span
                  class="inline-block px-2 py-1 text-sm font-semibold rounded-md mt-2 bg-green-100 text-green-800"
                >
                  {{ data.user.status }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="mt-3 bg-slate-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-6"
          >
            <div class="flex justify-between mt-3">
              <span class="text-slate-600 font-medium">Social: </span>
              <ul class="list-none ltr:text-right rtl:text-left space-x-0.5">
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.facebook_url"
                  >
                    <i class="pi pi-facebook"></i>
                  </a>
                </li>
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.linkedin_url"
                  >
                    <i class="pi pi-linkedin"></i>
                  </a>
                </li>
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.github_url"
                  >
                    <i class="pi pi-github"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div
              class="mt-3 w-full bg-white dark:bg-slate-900 p-3 rounded-md shadow dark:shadow-gray-700"
            >
              <div class="flex items-center mb-3">
                <i class="pi pi-file"></i>
                <span class="font-medium ms-2">{{ data.user.resume }}</span>
              </div>
              <a
                class="p-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:border-emerald-600 text-white rounded-md w-full flex items-center justify-center"
                :href="data.user.resume"
                target="_blank"
              >
                <i class="pi pi-file"></i>Download CV
              </a>
            </div>
          </div>
        </div>
        <div class="lg:col-span-8 md:col-span-6">
          <div class="p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
            <h5 class="text-xl font-semibold mb-5">Personal Details</h5>
            <label class="font-semibold">Introduction</label>
            <textarea
              v-model="data.user.introduction"
              class="block mb-5 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[200px]"
            ></textarea>
            <label class="font-semibold">Name</label>
            <input type="text" v-model="data.user.full_name" class="form-input mb-5" />
            <label class="font-semibold">Phone</label>
            <input type="text" v-model="data.user.phone" class="form-input mb-5" />
            <label class="font-semibold">Email</label>
            <input type="text" v-model="data.user.email" class="form-input mb-5" />
            <button
              class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
          <div class="p-6 mt-3 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
            <h5 class="text-xl font-semibold mb-5">Social Url</h5>
            <label class="font-semibold">Facebook</label>
            <input type="text" v-model="data.user.facebook_url" class="form-input mb-5" />
            <label class="font-semibold">Linkedin</label>
            <input type="text" v-model="data.user.linkedin_url" class="form-input mb-5" />
            <label class="font-semibold">Github</label>
            <input type="text" v-model="data.user.github_url" class="form-input mb-5" />
            <button
              class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-md shadow-lg w-[900px] flex flex-col">
        <h2 class="text-xl font-semibold text-center mb-4 bg-emerald-600 text-white p-2 rounded">
          EDIT AVATAR
        </h2>
        <div class="flex">
          <div class="w-2/3 p-5 flex flex-col items-center">
            <h3 class="text-lg font-semibold text-center mb-5">Original Image</h3>
            <div
              id="cropper-container"
              class="border-dashed border-2 border-gray-300 rounded-md h-80 flex items-center justify-center relative w-full cursor-pointer"
              @click="!selectedImage ? $refs.fileInput.click() : null"
            >
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
                ref="fileInput"
              />
              <div class="flex items-center justify-center w-full h-full">
                <span v-if="!selectedImage" class="text-lg"
                  >Click to select an image to upload!</span
                >
                <img
                  v-if="selectedImage"
                  :src="selectedImage"
                  alt="Selected Image"
                  class="h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div class="w-1/3 p-5 flex flex-col items-center">
            <h3 class="text-lg font-semibold text-center mb-5">Display Avatar</h3>
            <div
              class="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center mb-4"
            >
              <img
                v-if="cropAvatar"
                :src="cropAvatar"
                @error="cropAvatar = defaultAvatar"
                alt="Current Avatar"
                class="h-full object-cover"
              />
              <div v-else class="h-full flex items-center justify-center">Avatar</div>
            </div>
            <div class="flex space-x-2">
              <button @click="changeImage" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                Change
              </button>
              <button @click="removeImage" class="bg-red-600 text-white px-4 py-2 rounded-md">
                Delete
              </button>
              <button @click="saveImage" class="bg-green-600 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>

            <button @click="closePopup" class="text-red-500 mt-2">Close (Do not save)</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
