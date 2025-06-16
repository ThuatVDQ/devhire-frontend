<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
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

function formatSalary(amount) {
  if (amount >= 1000000) {
    return `${amount / 1000000}M`
  }
  return amount
}
</script>
<template>
  <div
    :class="[
      'flex flex-col relative overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-lg dark:shadow-gray-700 dark:hover:shadow-xl hover:scale-[1.02] rounded-md transition-all duration-500 border-2',
      state.job.is_highlight ? 'hover:border-rose-500' : 'hover:border-emerald-600',
      'border-transparent',
      'w-full max-w-xs mx-auto'
    ]"
  >
    <div class="p-2">
      <div class="flex items-center space-x-1">
        <div
          class="flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-full overflow-hidden flex-shrink-0"
        >
          <img class="w-full h-full object-cover" :src="logoSource" alt="Company Logo" />
        </div>

        <div class="ml-1 flex-grow min-w-0">
          <RouterLink
            v-if="!state.job.is_close"
            class="inline-block text-sm font-semibold hover:text-emerald-700 transition-all duration-500 truncate"
            :to="`/jobs/${state.job.id}`"
            :title="state.job.title"
          >
            {{ state.job.title }}
          </RouterLink>

          <div
            class="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-600"
          >
            {{ state.job.company.name }}
          </div>

          <div class="mt-0.5 flex items-center flex-wrap">
            <span
              class="bg-emerald-600/10 inline-block text-xs px-1.5 py-0.5 font-semibold rounded-full mr-1"
            >
              {{ state.job.type }}
            </span>
            <span
              class="bg-emerald-600/10 inline-block text-xs px-1.5 py-0.5 font-semibold rounded-full mr-1"
            >
              {{
                state.job.salary_start === 0 && state.job.salary_end === 0
                  ? 'Negotiable'
                  : `${formatSalary(state.job.salary_start)} - ${formatSalary(state.job.salary_end)} ${state.job.currency}`
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
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
      class="px-2 py-1 bg-slate-50 dark:bg-slate-800 flex justify-between items-center mt-auto text-xs"
    >
      <div class="flex items-center">
        <span
          v-for="(address, index) in state.job.addresses.slice(0, 1)"
          :key="index"
          class="inline-flex items-center text-slate-400 mr-2"
        >
          <i class="pi pi-map-marker text-xs mr-1"></i>{{ address.city }}
        </span>
      </div>
      <span v-if="state.job.is_close" class="text-xs text-gray-400">Closed</span>
      <a
        v-else
        class="btn btn-sm rounded-md px-2 py-0.5 flex items-center justify-center text-xs"
        :class="{
          'bg-gray-400 text-white cursor-default': state.job.apply_status !== null,
          'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white':
            state.job.apply_status === null
        }"
        href="#"
        @click.prevent="applyJob"
      >
        <span v-if="state.job.apply_status === null">Apply</span>
        <span v-else>
          Applied
          <i class="pi pi-check text-xs ml-1"></i>
        </span>
      </a>
    </div>
  </div>
</template>
