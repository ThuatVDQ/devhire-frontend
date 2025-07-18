<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import defaultLogo from '../assets/logo.svg'

const API_URL = import.meta.env.VITE_APP_API_URL

const router = useRouter()

function applyJob() {
  router.push(`/jobs/${state.job.id}`)
}

const state = defineProps({
  job: Object
})

const logoSource = computed(() => {
  const logo = state.job.company.logo

  if (logo) {
    return `http://localhost:8090/uploads/${logo}`
  } else {
    return defaultLogo
  }
})

const emit = defineEmits(['removeFavorite'])

const differenceInDays = computed(() => {
  const currentDate = new Date()
  const createdAtArray = state.job.created_at

  if (!Array.isArray(createdAtArray) || createdAtArray.length < 6) return null

  const [year, month, day, hour, minute, second] = createdAtArray
  const createdDate = new Date(year, month - 1, day, hour, minute, second)

  const differenceInTime = currentDate.getTime() - createdDate.getTime()
  return Math.floor(differenceInTime / (1000 * 3600 * 24))
})

async function favoriteJob() {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')

    // Exit function if no token is available
    if (!token) {
      toastr.error('You must login to favorite a job', 'Error')
      return
    }

    // Configure headers with token
    const headers = { Authorization: `Bearer ${token}` }

    if (!state.job.is_favorite) {
      await axios.post(
        `${API_URL}/jobs/${state.job.id}/like`,
        {},
        {
          headers
        }
      )
      state.job.is_favorite = true
    } else {
      await axios.delete(
        `${API_URL}/favorite-job/remove`,

        {
          params: { jobId: state.job.id },
          headers
        }
      )
      state.job.is_favorite = false
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error)
  }
}

const applyStatusMessage = computed(() => {
  switch (state.job.apply_status) {
    case 'IN_PROGRESS':
      return 'Application Processing'
    case 'SEEN':
      return 'Recruiter viewed application'
    case 'REJECTED':
      return 'Application not suitable'
    case 'ACCEPTED':
      return 'Application accepted'
  }
})

function openCV() {
  const baseUrl = 'http://localhost:8090/uploads/' // Change this base URL as needed
  const fullUrl = `${baseUrl}${state.job.cv_url}`
  window.open(fullUrl, '_blank')
}

function formatSalary(amount) {
  if (amount >= 1000000) {
    return `${amount / 1000000}M`
  }
  return amount
}

const formatDate = (dateArray) => {
  console.log('dateArray', dateArray)
  if (!Array.isArray(dateArray) || dateArray.length < 6) {
    return ''
  }

  // Mảng của bạn: [year, month, day, hour, minute, second, millisecond]
  const [year, month, day, hour, minute, second] = dateArray

  // Chuyển mảng thành đối tượng Date
  const date = new Date(year, month - 1, day, hour, minute, second)

  // Định dạng ngày tháng theo kiểu 'dd-MMM-yyyy'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div
    :class="[
      'flex flex-col relative overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl dark:shadow-gray-700 dark:hover:shadow-2xl hover:-mt-2 hover:scale-[1.015] rounded-md transition-all duration-500 border-2',
      state.job.is_highlight ? 'hover:border-rose-500' : 'hover:border-emerald-600',
      'border-transparent'
    ]"
  >
    <div class="px-6 pt-6 pb-2">
      <div class="flex items-center space-x-2">
        <!-- Logo -->
        <div
          class="flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-full overflow-hidden flex-shrink-0"
        >
          <img class="w-full h-full object-cover" :src="logoSource" alt="Company Logo" />
        </div>

        <!-- Content -->
        <div class="ms-3 ml-6">
          <!-- Job Title -->
          <RouterLink
            v-if="!state.job.is_close"
            class="inline-block text-[16px] font-semibold hover:text-emerald-600 transition-all duration-500 me-1"
            :to="`/jobs/${state.job.id}`"
            ><div>
              <span
                v-if="state.job.is_highlight"
                class="items-center bg-gradient-to-r from-pink-100 to-rose-200 text-rose-600 text-xs font-bold px-2 py-[2px] rounded-full shadow-sm animate-pulse mr-2"
              >
                <i class="pi pi-sparkles text-rose-500 mr-1"></i>HOT
              </span>
              {{ state.job.title }}
            </div>
          </RouterLink>

          <!-- Hiển thị span thay thế nếu job đã đóng -->
          <span v-else class="inline-block text-[16px] font-semibold">
            <span
              v-if="state.job.is_highlight"
              class="inline-flex items-center text-rose-500 text-sm font-semibold mr-1"
            >
              <i class="pi pi-diamond mr-1"></i>HOT
            </span>
            {{ state.job.title }}
          </span>

          <span
            class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >
            {{
              state.job.salary_start === 0 && state.job.salary_end === 0
                ? 'Negotiable'
                : `${formatSalary(state.job.salary_start)} - ${formatSalary(state.job.salary_end)} ${state.job.currency}`
            }}
          </span>

          <!-- Company Name with Ellipsis -->
          <div class="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            <span class="text-gray-600">{{ state.job.company.name }}</span>
          </div>

          <!-- Application Period -->
          <div>
            <span v-if="state.job.date_applied" class="text-gray-600">
              Application period:
              {{ formatDate(state.job.date_applied) }}
            </span>
          </div>

          <!-- Job Type and Salary -->
          <div class="mt-1">
            <span
              class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
            >
              {{ state.job.type }}
            </span>
            <span class="inline-block text-sm text-gray-400">
              {{
                differenceInDays >= 30
                  ? `Posted ${Math.floor(differenceInDays / 30)} month${Math.floor(differenceInDays / 30) > 1 ? 's' : ''} ago`
                  : differenceInDays > 0
                    ? `Posted ${differenceInDays} day${differenceInDays > 1 ? 's' : ''} ago`
                    : 'Just posted'
              }}
            </span>
          </div>

          <!-- Apply Status and CV -->
          <div class="mt-1">
            <span class="text-gray-400">{{ applyStatusMessage }}</span>
            <span
              v-if="state.job.cv_url"
              class="text-emerald-500 underline ml-2 cursor-pointer"
              @click="openCV"
            >
              CV Uploaded
            </span>
          </div>
        </div>
      </div>

      <div>
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ state.job.level }}</span
        >
        <span
          class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >{{ state.job.position }}</span
        >
        <template v-if="state.job.skills && state.job.skills.length">
          <span
            v-for="(skill, index) in state.job.skills"
            :key="index"
            class="bg-blue-100 dark:bg-blue-800 inline-block text-blue-600 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
          >
            {{ skill.name }}
          </span>
        </template>
      </div>
    </div>
    <div
      class="px-6 py-2 bg-slate-50 dark:bg-slate-800 lg:flex justify-between items-center mt-auto"
    >
      <div class="lg:inline-block flex justify-between">
        <span
          v-for="(address, index) in state.job.addresses"
          :key="index"
          class="inline-flex items-center me-1 text-slate-400"
        >
          <i class="pi pi-map-marker mr-2"></i>{{ address.city }}
        </span>
      </div>
      <span v-if="state.job.is_close" class="text-lg text-gray-400">Job Closed</span>
      <a
        v-else
        class="btn btn-sm rounded-md md:ms-2 w-full lg:w-auto lg:mt-0 mt-4 px-4 py-1 flex items-center justify-center"
        :class="{
          'bg-gray-400 text-white cursor-default': state.job.apply_status !== null,
          'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white':
            state.job.apply_status === null
        }"
        href="#"
        @click.prevent="applyJob"
      >
        <span v-if="state.job.apply_status === null">Apply now</span>
        <span v-else>
          Applied
          <i class="pi pi-check ml-2"></i>
        </span>
      </a>
    </div>
    <a
      v-if="job.is_favorite !== null"
      :class="[
        'h-9 w-9 inline-flex items-center justify-center rounded-full hover:text-white hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 absolute top-0 end-0 m-3',
        job.is_favorite ? 'bg-emerald-600 text-white' : 'bg-emerald-600/5 text-emerald-600'
      ]"
      href=""
      @click.prevent="favoriteJob"
    >
      <i class="pi pi-heart"></i>
    </a>
  </div>
</template>
