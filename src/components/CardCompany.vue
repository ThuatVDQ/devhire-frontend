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
    <!-- Logo -->
    <div
      class="w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md relative -mt-12"
    >
      <img :src="logoSource" alt="Logo Company" class="p-2" />
    </div>

    <!-- Name và Description với chiều cao cố định -->
    <div class="mt-4 flex flex-col space-y-2 min-h-[190px] flex-grow">
      <!-- Điều chỉnh min-h để có chiều cao phù hợp -->
      <!-- Tên công ty -->
      <RouterLink
        :to="`/companies/${company.id}`"
        class="text-lg hover:text-emerald-600 font-semibold"
      >
        {{ company.name }}
      </RouterLink>

      <!-- Mô tả công ty với giới hạn dòng -->
      <p class="text-slate-400 text-justify line-clamp-4 flex-grow">
        {{ company.description }}
      </p>
    </div>

    <!-- Địa chỉ và tổng số công việc (căn đều dưới cùng) -->
    <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
      <span class="text-slate-400 flex items-center">
        <i class="pi pi-map-marker mr-2"></i>
        {{ company.address.length > 20 ? `${company.address.slice(0, 20)}...` : company.address }}
      </span>
    </div>
    <span class="block font-semibold text-emerald-600 mt-2"> {{ company.totalJob }} Jobs </span>
  </div>
</template>
