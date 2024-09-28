<script setup>
import JobList from '@/components/JobList.vue'
import CompanyList from '@/components/CompanyList.vue'
import CardExploreJob from '@/components/CardExploreJob.vue'
import { RouterLink, useRoute } from 'vue-router'
import { reactive, onMounted, watch } from 'vue'
import axios from 'axios'

const route = useRoute()

const state = reactive({
  company: {},
  jobs: [],
  companies: [],
  isLoading: true
})

const fetchJobs = async () => {
  try {
    const response = await axios.get('http://localhost:8000/jobs')
    state.jobs = response.data.slice(0, 2)
    console.log('Jobs fetched:', response.data)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
  }
}

const fetchCompanies = async () => {
  try {
    const response = await axios.get('http://localhost:8000/companies')
    state.companies = response.data.slice(0, 4)
    console.log('Companies fetched:', response.data)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
  }
}

const fetchCompanyData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/companies/${id}`)
    state.company = response.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  state.isLoading = true
  await fetchJobs()
  await fetchCompanies()
  fetchCompanyData(route.params.id)
  state.isLoading = false
})

// Theo dõi sự thay đổi của route.params.id để cập nhật dữ liệu khi id thay đổi
watch(
  () => route.params.id,
  (newId) => {
    fetchCompanyData(newId)
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <section
    class="relative table w-full py-40 bg-[url('../assets/banner.png')] bg-center bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0 bg-emerald-900/60"></div>
  </section>
  <section class="relative mb:pb-24 pb-16 -mt-16 z-1">
    <div class="container">
      <div class="grid grid-cols-1">
        <div
          class="md:flex justify-between items-center shadow dark:shadow-gray-700 rounded-md p-6 bg-white dark:bg-slate-900"
        >
          <div class="flex items-center">
            <img
              src=""
              alt="logo-company"
              class="size-20 p-3 shadow dark:shadow-gray-700 rounded-md bg-slate-50 dark:bg-slate-800"
            />
            <div class="ms-4">
              <h5 class="text-xl font-bold">{{ state.company.name }}</h5>
              <div class="flex items-center space-x-4">
                <h6 class="text-base text-slate-400 flex items-center">
                  <i class="pi pi-globe pr-1"></i>
                  {{ state.company.web_url }}
                </h6>
                <h6 class="text-base text-slate-400 flex items-center">
                  <i class="pi pi-building pr-1"></i>
                  {{ state.company.scale }} employees
                </h6>
              </div>
            </div>
          </div>
          <div class="md:mt-0 mt-4">
            <RouterLink
              to="/"
              class="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:border-emerald-600 text-white rounded-md"
              >Follow</RouterLink
            >
            <RouterLink
              to="/"
              class="py-3 px-6 bg-emerald-600/5 hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 hover:text-white rounded-md ms-1"
              >See jobs</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-12">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-7">
          <h5 class="text-xl font-semibold">Company Story</h5>
          <p class="text-slate-400 mt-4">
            {{ state.company.description }}
          </p>
          <h5 class="text-xl font-semibold mt-6">Vacancies:</h5>
          <JobList :jobs="state.jobs" :pagination="true" container="" />
        </div>
        <div class="lg:col-span-4 md:col-span-5">
          <div
            class="bg-slate-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-6 sticky top-20"
          >
            <div class="w-full leading-[0] border-0">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=31+duong+2+Lang+Bao+Chi,Phuong+Thao+Dien,Thanh+pho+Thu+Duc,Thanh+pho+Ho+Chi+Minh,Viet+Nam&zoom=15&language=vi"
                frameborder="0"
                class="w-full h-[350px] rounded-md shadow dark:shadow-gray-700"
                allowfullscreen
              ></iframe>
            </div>
            <ul class="list-none mt-4">
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Email:</span
                ><span class="font-medium">{{ state.company.email }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Phone:</span
                ><span class="font-medium">{{ state.company.phone }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Headquarters:</span
                ><span class="font-medium">{{ state.company.address }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Number of employees:</span
                ><span class="font-medium">{{ state.company.scale }}</span>
              </li>
              <li class="flex justify-between mt-2">
                <span class="text-slate-400 font-medium">Website:</span
                ><span class="font-medium">{{ state.company.web_url }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="container lg:mt-24 my-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <div class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Related Companies
        </div>
        <p class="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <CompanyList :companies="state.companies" :pagination="false" />
    </div>
    <CardExploreJob />
  </section>
</template>
