<script setup>
import CardCompany from './CardCompany.vue'
</script>

<template>
  <div class="relative md:py-24 py-16">
    <div class="container">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Find Best Companies
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
        <CardCompany />
        <CardCompany />
        <CardCompany />
        <CardCompany />
        <CardCompany />
        <CardCompany />
        <CardCompany />
        <CardCompany />
      </div>
    </div>
    <div class="grid md:grid-cols-12 grid-cols-1 mt-6">
      <div class="md:col-span-12 text-center">
        <a
          href=""
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          See More Companies <i class="pi pi-arrow-right pl-1"></i>
        </a>
      </div>
    </div>
  </div>
</template>
