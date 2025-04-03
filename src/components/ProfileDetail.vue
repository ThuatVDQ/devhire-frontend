<script setup>
import { reactive, onMounted, ref } from 'vue'
import axios from 'axios'
import defaultAvatar from '../assets/avatar-default.svg'
import toastr, { error } from 'toastr'
import 'toastr/build/toastr.min.css'
import EditAvatar from '@/components/EditAvatar.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const data = reactive({
  user: {},
  cv: {}
})

const showAvatarPopup = ref(false)
const currentAvatar = ref(defaultAvatar)
const cropAvatar = ref(defaultAvatar)

async function fetchDataUser() {
  try {
    const response = await axios.get('http://localhost:8090/api/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    data.user = response.data
    if (data.user.avatar_url) {
      currentAvatar.value = `http://localhost:8090/uploads/${data.user.avatar_url}`
      cropAvatar.value = currentAvatar.value
    }
  } catch (e) {
    console.error(e)
  }
}

const updateUserInf = async () => {
  try {
    const response = await axios.put('http://localhost:8090/api/users/updateProfile', data.user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    toastr.success('User information updated successfully')
  } catch (e) {
    toastr.error('Failed to update user details', error.response.data)
    console.error('Error updating user details:', e)
  }
}

const fetchCV = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/cv/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    data.cv = response.data
  } catch (e) {
    console.error(e)
  }
}

async function downloadCV(cvId, job_title) {
  try {
    const response = await axios.get(`http://localhost:8090/api/cv/${cvId}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    const contentDisposition = response.headers['content-disposition']
    console.log('contentDisposition:', contentDisposition)

    let fileName = ``
    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '')
    }
    const fileExtension = fileName.split('.').pop()
    fileName = `${job_title}.${fileExtension}`
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // Xóa URL sau khi hoàn tất tải xuống để giải phóng bộ nhớ
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    toastr.error('Error downloading CV:', error)
  }
}

onMounted(() => {
  fetchDataUser()
  fetchCV()
  const message = sessionStorage.getItem('message')

  if (message) {
    toastr.success(message)
    sessionStorage.removeItem('message')
  }
})

const openPopup = () => {
  showAvatarPopup.value = true
}

const isSubscribed = ref(false)
const isDialogVisible = ref(false)
const dialogMessage = ref('')
const actionType = ref('')

const checkSubscriptionStatus = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8090/api/job-notification/check-subscribed',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    isSubscribed.value = response.data
  } catch (error) {
    console.error('Error checking subscription status:', error)
  }
}

// Mở dialog khi nhấn nút
const openDialog = () => {
  if (isSubscribed.value) {
    dialogMessage.value = 'Are you sure you want to unsubscribe from email notifications?'
    actionType.value = 'unsubscribe'
  } else {
    dialogMessage.value = 'Are you sure you want to subscribe to email notifications?'
    actionType.value = 'subscribe'
  }
  isDialogVisible.value = true
}

// Đóng dialog
const closeDialog = () => {
  isDialogVisible.value = false
}

// Xử lý xác nhận
const onConfirm = async () => {
  try {
    const url =
      actionType.value === 'subscribe'
        ? 'http://localhost:8090/api/job-notification/subscribe'
        : 'http://localhost:8090/api/job-notification/unsubscribe' // API hủy đăng ký

    await axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    isSubscribed.value = actionType.value === 'subscribe'
    toastr.success(
      actionType.value === 'subscribe'
        ? 'You have subscribed to job notifications!'
        : 'You have unsubscribed from job notifications.',
      'Success'
    )
  } catch (error) {
    console.error('Error toggling subscription:', error)
    toastr.error('An error occurred. Please try again.', 'Error')
  } finally {
    closeDialog()
  }
}

onMounted(checkSubscriptionStatus)
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
              <div class="mt-2 flex gap-2">
                <span
                  class="inline-block px-2 py-1 text-sm font-semibold rounded-md mt-2 bg-green-100 text-green-800"
                >
                  {{ data.user.status }}
                </span>
                <div class="relative group">
                  <button
                    @click="openDialog"
                    class="py-2 px-4 font-[600] rounded-md"
                    :class="
                      isSubscribed
                        ? 'bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700'
                        : 'bg-gray-600 hover:bg-gray-700 border-gray-600 hover:border-gray-700'
                    "
                    text-white
                  >
                    <i
                      :class="
                        isSubscribed ? 'pi pi-bell-slash text-white' : 'pi pi-bell text-white'
                      "
                    ></i>
                  </button>
                  <div
                    class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-black bg-white border border-gray-300 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 shadow-md"
                  >
                    {{
                      isSubscribed
                        ? 'Unsubscribe from notifications'
                        : 'Subscribe for notifications'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-3 bg-slate-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-3"
          >
            <div
              v-for="(cv, index) in data.cv"
              :key="index"
              class="cv-item p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md mb-4"
            >
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                {{ cv.name }}
              </h3>
              <button
                @click="downloadCV(cv.id, cv.name)"
                class="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Download CV
              </button>
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
            <div class="flex space-x-4 mb-5">
              <!-- Trường Name -->
              <div class="w-1/2">
                <label class="font-semibold">Name</label>
                <input type="text" v-model="data.user.full_name" class="form-input w-full h-10" />
              </div>

              <!-- Trường Gender -->
              <div class="w-1/2">
                <label class="font-semibold">Gender</label>
                <select v-model="data.user.gender" class="custom-select w-full h-10">
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <label class="font-semibold">Phone</label>
            <input type="text" readonly v-model="data.user.phone" class="form-input mb-5" />
            <label class="font-semibold">Email</label>
            <input type="text" readonly v-model="data.user.email" class="form-input mb-5" />
            <button
              class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
              @click="updateUserInf"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditAvatar v-if="showAvatarPopup" :cropAvatar="cropAvatar" @close="showAvatarPopup = false" />
  </section>

  <ConfirmationDialog
    :isVisible="isDialogVisible"
    :message="dialogMessage"
    @confirm="onConfirm"
    @cancel="closeDialog"
  />
</template>
