<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import defaultLogo from '../assets/logo.svg'

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
  const deadline = new Date(state.job.deadline)
  const differenceInTime = deadline.getTime() - currentDate.getTime()
  return Math.floor(differenceInTime / (1000 * 3600 * 24))
})

async function favoriteJob() {
  try {
    if (!state.job.is_favorite) {
      await axios.post(
        `http://localhost:8090/api/jobs/${state.job.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      state.job.is_favorite = true
    } else {
      await axios.delete(
        `http://localhost:8090/api/favorite-job/remove`,

        {
          params: { jobId: state.job.id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
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
</script>

<template>
  <div
    class="flex flex-col group relative overflow-hidden bg-white dark:bg-slate-900 shadow hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-700 hover:-mt-2 rounded-md transition-all duration-500"
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
            class="inline-block text-[16px] font-semibold hover:text-emerald-600 transition-all duration-500 me-1"
            :to="`/jobs/${state.job.id}`"
          >
            {{ state.job.title }}
          </RouterLink>
          <span class="inline-block text-sm text-red-400">
            {{ differenceInDays > 0 ? `Remaining ${differenceInDays} days` : 'Expired' }}
          </span>

          <!-- Company Name with Ellipsis -->
          <div class="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            <span class="text-gray-400">{{ state.job.company.name }}</span>
          </div>

          <!-- Application Period -->
          <div>
            <span v-if="state.job.date_applied" class="text-gray-600">
              Application period:
              {{
                new Date(state.job.date_applied).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              }}
            </span>
          </div>

          <!-- Job Type and Salary -->
          <div class="mt-1">
            <span
              class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
            >
              {{ state.job.type }}
            </span>
            <span class="text-sm font-medium inline-block me-1">
              Salary:
              <span
                class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1"
              >
                {{
                  state.job.salary_start === 0 && state.job.salary_end === 0
                    ? 'Negotiable'
                    : `${state.job.salary_start} - ${state.job.salary_end} ${state.job.currency}`
                }}
              </span>
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
      <a
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
        'h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 absolute top-0 end-0 m-3',
        job.is_favorite ? 'bg-emerald-600 text-white' : 'bg-emerald-600/5 text-emerald-600'
      ]"
      href=""
      @click.prevent="favoriteJob"
    >
      <i class="pi pi-heart"></i>
    </a>
  </div>
</template>
