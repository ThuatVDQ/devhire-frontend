<script setup>
import CompanyList from '@/components/CompanyList.vue'
import CardExploreJob from '@/components/CardExploreJob.vue'
import { useRoute } from 'vue-router'
import { reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import defaultLogo from '../assets/logo.svg'
import CardJob from '@/components/CardJob.vue'

const route = useRoute()

const state = reactive({
  company: {},
  jobs: [],
  companies: [],
  isLoading: true
})

const fetchCompanies = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/companies')
    state.companies = response.data
    console.log('Companies fetched:', response.data)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
  }
}

const fetchJobsByCompany = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/company/' + route.params.id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    state.jobs = response.data
    console.log('jobs fetched:', response.data)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
  }
}

const fetchCompanyData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8090/api/companies/${id}`)
    state.company = response.data
    console.log('Company:', response.data)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  state.isLoading = true
  await fetchCompanies()
  fetchCompanyData(route.params.id)
  state.isLoading = false
  fetchJobsByCompany()
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
              :src="company?.logo || defaultLogo"
              @error="(e) => (e.target.src = defaultLogo)"
              alt="logo-company"
              class="size-20 shadow dark:shadow-gray-700 rounded-md bg-slate-50 dark:bg-slate-800"
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
          <div class="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6">
            <CardJob v-for="job in state.jobs" :key="job.id" :job="job" />
          </div>
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
                ><span class="font-medium ml-2 break-all">{{ state.company.web_url }}</span>
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
