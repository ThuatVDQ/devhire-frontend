<script setup>
import { RouterLink } from 'vue-router'
import ListCategory from './ListCategory.vue'
</script>

<template>
  <div class="container md:mt-24 mt-16">
    <div class="flex justify-between items-end pb-8">
      <div class="text-left">
        <h3 class="mb-4 text-2xl leading-normal font-semibold">Browse by Categories</h3>
        <p class="text-slate-400">Search your career opportunity with our categories</p>
      </div>
      <div class="text-right hidden md:block">
        <RouterLink
          to="/categories"
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          All Categories <i class="pi pi-arrow-right pl-1"></i>
        </RouterLink>
      </div>
    </div>
    <ListCategory />
  </div>
</template>
