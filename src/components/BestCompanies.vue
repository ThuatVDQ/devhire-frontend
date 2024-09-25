<script setup>
import CompanyList from './CompanyList.vue'
import { RouterLink } from 'vue-router'
import { reactive, onMounted } from 'vue'
import axios from 'axios'

const state = reactive({
  companies: [],
  isLoading: true
})

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/companies')
    state.companies = response.data.slice(0, 8)
    console.log(response.data)
  } catch (e) {
    console.error(e)
  }
})
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
      <CompanyList :companies="state.companies" :pagination="false" />
    </div>
    <div class="grid md:grid-cols-12 grid-cols-1 mt-6">
      <div class="md:col-span-12 text-center">
        <RouterLink
          to="/conpanies"
          class="btn btn-link text-slate-400 hover:text-emerald-600 after:bg-emerald-600 duration-500 ease-in-out inline-flex items-center"
        >
          See More Companies <i class="pi pi-arrow-right pl-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
