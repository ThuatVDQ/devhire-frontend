<script setup>
import CardCategory from './CardCategory.vue'
</script>

<template>
  <div class="container md:mt-24 mt-16">
    <div class="flex justify-between items-end pb-8">
      <div class="text-left">
        <h3 class="mb-4 text-2xl leading-normal font-semibold">Browse by Categories</h3>
        <p class="text-slate-400">Search your career opportunity with our categories</p>
      </div>
      <div class="text-right hidden md:block">
        <a
          href=""
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          All Categories <i class="pi pi-arrow-right pl-1"></i>
        </a>
      </div>
    </div>
    <div
      class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]"
    >
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
      <CardCategory />
    </div>
  </div>
</template>
