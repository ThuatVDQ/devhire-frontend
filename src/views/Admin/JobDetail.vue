<template>
  <header v-if="job" class="mb-6 bg-emerald-600">
    <div class="flex justify-between items-center p-10 pb-4 bg-emerald-600">
      <h1 class="text-3xl font-semibold text-white">{{ job.title }}</h1>
      <div class="relative">
        <i class="pi pi-ellipsis-v text-white cursor-pointer" @click="toggleDropdown"></i>

        <!-- Dropdown menu -->
        <div
          v-show="isDropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10"
        >
          <ul class="py-1">
            <li
              @click="job.status === 'PENDING' && showDialog('approve')"
              :class="[
                'flex items-center px-4 py-2',
                job.status === 'PENDING'
                  ? 'text-gray-700 hover:bg-emerald-100 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="pi pi-check mr-2"></i>
              Approve
            </li>
            <li
              @click="job.status === 'PENDING' && showDialog('reject')"
              :class="[
                'flex items-center px-4 py-2',
                job.status === 'PENDING'
                  ? 'text-gray-700 hover:bg-emerald-100 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="pi pi-times-circle mr-2"></i>
              Reject
            </li>
            <li
              @click="showDialog('close')"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-100 cursor-pointer"
            >
              <i class="pi pi-lock mr-2"></i>
              Close
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="job.company" class="flex px-10 pb-6">
      <h3 class="text-xl font-semibold text-gray-600 mr-4">{{ job.company.name }}</h3>
      <a
        v-if="job.company.web_url"
        :href="job.company.web_url"
        class="text-base text-gray-600 hover:text-blue-800 flex items-center underline font-semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="pi pi-globe pr-1"></i>
        {{ job.company.web_url }}
      </a>
      <span v-else class="text-base text-gray-500">Website not available</span>
    </div>
  </header>

  <div v-if="job" class="lg:grid lg:grid-cols-12 gap-8 p-10">
    <!-- Main Job Description Section -->
    <div class="lg:col-span-8">
      <h5 class="text-lg font-semibold mt-6">Job Description:</h5>
      <p class="mt-4" style="white-space: pre-line; word-break: break-word; text-align: justify">
        {{ job.description }}
      </p>

      <h5 class="text-lg font-semibold mt-16">Requirements:</h5>
      <p class="mt-4" style="white-space: pre-line; word-break: break-word; text-align: justify">
        {{ job.requirement }}
      </p>

      <h5 class="text-lg font-semibold mt-16">Benefits:</h5>
      <p class="mt-4" style="white-space: pre-line; word-break: break-word; text-align: justify">
        {{ job.benefit }}
      </p>
    </div>

    <!-- Job Information Sidebar Section -->
    <div class="lg:col-span-4 md:col-span-6">
      <div class="shadow rounded-md bg-white sticky top-20">
        <div class="p-6">
          <h5 class="text-lg font-semibold">Job Information</h5>
        </div>
        <div class="p-6 border-t border-slate-100">
          <ul class="list-none">
            <li class="flex items-center">
              <i class="pi pi-verified"></i>
              <div class="ms-4">
                <p class="font-medium">Position</p>
                <span class="text-emerald-600 font-medium text-sm">
                  {{ job.position }} - {{ job.level }}
                </span>
              </div>
            </li>
            <li class="flex items-center mt-3">
              <i class="pi pi-map-marker"></i>
              <div class="ms-4">
                <p class="font-medium">Location:</p>
                <span
                  v-for="(address, index) in job.addresses"
                  :key="index"
                  class="text-emerald-600 font-medium text-sm"
                >
                  {{
                    [address.street, address.district, address.city, address.country]
                      .filter(Boolean)
                      .join(', ')
                  }}
                  <br v-if="index < job.addresses.length - 1" />
                </span>
              </div>
            </li>
            <li class="flex items-center mt-3">
              <i class="pi pi-desktop"></i>
              <div class="ms-4">
                <p class="font-medium">Job Type:</p>
                <span class="text-emerald-600 font-medium text-sm">
                  {{ [job.category?.name, job.type].filter(Boolean).join(' - ') }}
                </span>
              </div>
            </li>
            <li class="flex items-center mt-3">
              <i class="pi pi-briefcase"></i>
              <div class="ms-4">
                <p class="font-medium">Experience:</p>
                <span class="text-emerald-600 font-medium text-sm">{{ job.experience }}</span>
              </div>
            </li>
            <li class="flex items-center mt-3">
              <i class="pi pi-dollar"></i>
              <div class="ms-4">
                <p class="font-medium">Salary:</p>
                <span class="text-emerald-600 font-medium text-sm">
                  {{
                    job.salary_start && job.salary_end
                      ? `${job.salary_start} - ${job.salary_end} ${job.currency}`
                      : 'Negotiable'
                  }}
                </span>
              </div>
            </li>
            <li class="flex items-center mt-3">
              <i class="pi pi-clock"></i>
              <div class="ms-4">
                <p class="font-medium">Date posted:</p>
                <span class="text-emerald-600 font-medium text-sm">{{
                  formatDate(job.deadline)
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationDialog
    :isVisible="isDialogVisible"
    :message="dialogMessage"
    @confirm="onConfirm"
    @cancel="closeDialog"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import toastr from 'toastr'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import 'toastr/build/toastr.min.css'

const route = useRoute()
const jobId = route.params.id
const job = ref(null)
const isDropdownOpen = ref(false)

const isDialogVisible = ref(false)
const dialogMessage = ref('')
const currentAction = ref('')

function showDialog(action) {
  currentAction.value = action
  isDialogVisible.value = true
  dialogMessage.value =
    action === 'approve'
      ? 'Are you sure you want to approve this job?'
      : action === 'reject'
        ? 'Are you sure you want to reject this job?'
        : 'Are you sure you want to close this job?'
  isDropdownOpen.value = false
}

async function onConfirm() {
  if (currentAction.value === 'approve') {
    await approveJob()
  } else if (currentAction.value === 'reject') {
    await rejectJob()
  } else if (currentAction.value === 'close') {
    await closeJob()
  }
  closeDialog()
}

function closeDialog() {
  isDialogVisible.value = false
  currentAction.value = ''
}

async function approveJob() {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/approve`)
    if (response.status === 200) {
      job.value.status = 'APPROVED'
      toastr.success('Job approved successfully.')
    }
  } catch (error) {
    console.error(error)
    toastr.error('Failed to approve job.')
  }
}

async function rejectJob() {
  try {
    const response = await axios.post(`http://localhost:8090/api/jobs/${jobId}/reject`)
    if (response.status === 200) {
      job.value.status = 'REJECTED'
      toastr.success('Job rejected successfully.')
    }
  } catch (error) {
    console.error(error)
    toastr.error('Failed to reject job.', error.response.data)
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

const fetchJobDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:8090/api/jobs/${jobId}`)
    job.value = response.data
  } catch (error) {
    console.error('Error fetching job details:', error)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchJobDetail()
})
</script>
