<script setup>
import CardJob from './CardJob.vue'
</script>

<template>
  <div class="container md:mt-24 mt-16 py-16">
    <div class="grid grid-cols-1 pb-8 text-center">
      <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
        Popular Jobs
      </h3>
      <p class="text-slate-400 max-w-xl mx-auto">
        Search all the open positions on the web. Get your own personalized salary estimate. Read
        reviews on over 30000+ companies worldwide.
      </p>
    </div>
    <div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
      <CardJob />
      <CardJob />
      <CardJob />
      <CardJob />
      <CardJob />
      <CardJob />
    </div>
    <div class="grid md:grid-cols-1 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <a
          href=""
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          See More Jobs <i class="pi pi-arrow-right pl-1"></i>
        </a>
      </div>
    </div>
  </div>
</template>
