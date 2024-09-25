<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div
    class="p-6 hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-gray-800 transition duration-500 rounded-2xl mt-6 text-center"
  >
    <div
      class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
    >
      <i :class="`${icon}`"></i>
    </div>
    <div class="content mt-7">
      <a class="title h5 text-lg font-semibold hover:text-emerald-600">{{ title }}</a>
      <p class="text-slate-400 mt-3">{{ description }}</p>
      <div class="mt-5">
        <RouterLink
          :to="`${link}`"
          class="btn btn-link text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
          >Read More <i class="pi pi-arrow-right ms-1"></i
        ></RouterLink>
      </div>
    </div>
  </div>
</template>
