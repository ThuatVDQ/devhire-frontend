<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import defaultLogo from '../assets/logo.svg'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})
function truncateDescription(description) {
  const sentences = description.split('. ')
  let truncated = sentences[0] + '. ' // Đảm bảo có ít nhất một câu
  let index = 1

  // Thêm các câu tiếp theo cho đến khi đạt giới hạn 150 ký tự
  while (index < sentences.length && truncated.length + sentences[index].length + 2 <= 150) {
    truncated += sentences[index] + '. '
    index++
  }

  // Nếu đã rút gọn, thêm dấu ba chấm
  return truncated.trim() + (truncated.length < description.length ? '...' : '')
}

const logoSource = computed(() => {
  const logo = props.company.logo

  if (logo) {
    return `http://localhost:8090/uploads/${logo}`
  } else {
    return defaultLogo
  }
})
</script>

<template>
  <div class="group relative p-6 rounded-md shadow dark:shadow-gray-700 mt-6">
    <div
      class="size-14 flex items-center justify-center bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md relative -mt-12"
    >
      <img :src="logoSource" alt="Logo Company" class="p-2" />
    </div>
    <div class="mt-4">
      <RouterLink
        :to="`/companies/${company.id}`"
        class="text-lg hover:text-emerald-600 font-semibold"
        >{{ company.name }}</RouterLink
      >
      <p class="text-slate-400 mt-2">
        {{ truncateDescription(company.description) }}
      </p>
    </div>
    <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
      <span class="text-slate-400 flex items-center">
        <i class="pi pi-map-marker mr-2"></i>
        {{ company.address }}
      </span>
      <span class="block font-semibold text-emerald-600"> {{ company.totalJob }} Jobs</span>
    </div>
  </div>
</template>
