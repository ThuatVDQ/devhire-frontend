<script setup>
import CardCompany from './CardCompany.vue'
defineProps({
  companies: Object,
  pagination: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
    <CardCompany v-for="company in companies" :key="company.id" :company="company" />
  </div>
  <div v-if="pagination" class="grid md:grid-cols-12 grid-cols-1 mt-8">
    <div class="md:col-span-12 text-center">
      <nav aria-label="Page navigation example"></nav>
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-s-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
          >
            <i class="pi pi-angle-left"></i
          ></a>
        </li>
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
            >1</a
          >
        </li>
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
            >2</a
          >
        </li>
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
            >3</a
          >
        </li>
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
            >4</a
          >
        </li>
        <li>
          <a
            class="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-e-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600"
            href=""
          >
            <i class="pi pi-angle-right"></i
          ></a>
        </li>
      </ul>
    </div>
  </div>
  <div v-else></div>
</template>
