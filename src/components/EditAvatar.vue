<template>
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
              <span v-if="!selectedImage" class="text-lg">Click to select an image to upload!</span>
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
              v-if="cropAvatarLocal"
              :src="cropAvatarLocal"
              @error="cropAvatarLocal = defaultAvatar"
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
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import defaultAvatar from '../assets/avatar-default.svg'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const API_URL = import.meta.env.VITE_APP_API_URL

const selectedImage = ref(null)
const cropper = ref(null)
const fileInput = ref(null)
const showPopup = ref(true)
let cropTimeout

// Nhận prop từ component cha
const props = defineProps({
  cropAvatar: {
    type: String,
    required: true
  },
  isLogoCompany: {
    type: Boolean,
    default: false
  }
})

const cropAvatarLocal = ref(props.cropAvatar)

const emit = defineEmits(['close', 'notification'])

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  //check file exists and is image
  if (!file || !file.type.includes('image')) {
    toastr.error('Please select an image file!')
    return
  }
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target.result
      if (cropper.value) {
        cropper.value.destroy()
      }

      const imageElement = document.createElement('img')
      imageElement.src = selectedImage.value

      const cropperContainer = document.querySelector('#cropper-container')
      cropperContainer.innerHTML = ''
      cropperContainer.appendChild(imageElement)

      cropper.value = new Cropper(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        crop: () => {
          clearTimeout(cropTimeout)
          cropTimeout = setTimeout(() => {
            cropper.value.getCroppedCanvas().toBlob((blob) => {
              if (blob) {
                cropAvatarLocal.value = URL.createObjectURL(blob)
              }
            })
          }, 200)
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
      if (!props.isLogoCompany)
        axios
          .post(`${API_URL}/users/uploadAvatar`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then((response) => {
            sessionStorage.setItem('message', response.data)
            window.location.reload()
          })
          .catch((error) => {
            toastr.error('Error uploading avatar:', error)
          })
      else {
        axios
          .put(`${API_URL}/companies/upload-logo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then((response) => {
            sessionStorage.setItem('message', response.data)
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            toastr.error('Error uploading logo:', error)
          })
      }
    })
  } else {
    axios
      .put(
        `${API_URL}/users/deleteAvatar`,
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then((response) => {
        cropAvatarLocal.value = defaultAvatar
        sessionStorage.setItem('message', response.data)
        sessionStorage.setItem('newAvatarUrl', defaultAvatar)

        // Tải lại trang
        window.location.reload()
      })
      .catch((error) => {
        toastr.error('Error deleting avatar:', error.response.data || error.message)
      })
  }
}

const closePopup = () => {
  emit('close')
  showPopup.value = false
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
}

const changeImage = () => {
  selectedImage.value = null
  fileInput.value.click()
}

const removeImage = () => {
  selectedImage.value = null
  cropAvatarLocal.value = defaultAvatar
  const cropperContainer = document.querySelector('#cropper-container')
  cropperContainer.innerHTML = 'Click to select an image to upload!'
}
</script>
