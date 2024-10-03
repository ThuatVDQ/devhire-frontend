<script setup>
import { reactive, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SimilarJobs from '@/components/SimilarJobs.vue'
import axios from 'axios'

const route = useRoute()

const state = reactive({
  job: {},
  isLoading: true
})

const fetchJobData = async (id) => {
  state.isLoading = true
  try {
    const response = await axios.get(`http://localhost:8000/jobs/${id}`)
    state.job = response.data
  } catch (e) {
    console.error(e)
  } finally {
    state.isLoading = false
  }
}

onMounted(() => {
  fetchJobData(route.params.id)
})

// Theo dõi sự thay đổi của route.params.id để cập nhật dữ liệu khi id thay đổi
watch(
  () => route.params.id,
  (newId) => {
    fetchJobData(newId)
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-800 md:pb-24 pb-16">
    <div class="container mt-10">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-8 md:col-span-6">
          <div
            class="md:flex items-center p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <img
              src=""
              alt=""
              class="rounded-full size-28 p-4 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700"
            />
            <div class="md:ms-4 md:mt-0 mt-6">
              <h5 class="text-xl font-semibold">{{ state.job.title }}</h5>
              <div class="mt-2">
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-building"></i>Lenovo pvt. ltd .
                </span>
                <span class="text-slate-400 font-medium me-2 inline-flex items-center">
                  <i class="pi pi-map-marker"></i>Norway,Oslo
                </span>
              </div>
            </div>
          </div>
          <h5 class="text-lg font-semibold mt-6">Job Description:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.description }}
          </p>
          <!-- <p class="text-slate-400 mt-4">
            This means that Lorem Ipsum cannot accurately represent, for example, German, in which
            all nouns are capitalized. Thus, Lorem Ipsum has only limited suitability as a visual
            filler for German texts. If the fill text is intended to illustrate the characteristics
            of different typefaces.
          </p>
          <p class="text-slate-400 mt-4">
            It sometimes makes sense to select texts containing the various letters and symbols
            specific to the output language.
          </p> -->
          <h5 class="text-lg font-semibold mt-6">Requirements:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.requirement }}
          </p>
          <!-- <ul class="list-none">
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Participate in requirements analysis
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Write clean, scalable code using C# and .NET frameworks
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Test and deploy applications and systems
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Revise, update, refactor and debug code
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Improve existing software
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Develop documentation throughout the software development life cycle (SDLC)
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Serve as an expert on applications and provide technical support
            </li>
          </ul> -->
          <h5 class="text-lg font-semibold mt-6">Benefit:</h5>
          <p class="text-slate-400 mt-4">
            {{ state.job.benefit }}
          </p>
          <!-- <ul class="list-none">
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Proven experience as a .NET Developer or Application Developer
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>good understanding of SQL and Relational Databases, specifically Microsoft SQL
              Server.
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Experience designing, developing and creating RESTful web services and APIs
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Basic know how of Agile process and practices
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Good understanding of object-oriented programming.
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Good understanding of concurrent programming.
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Sound knowledge of application architecture and design.
            </li>
            <li class="text-slate-400 mt-2 items-center inline-flex">
              <i></i>Excellent problem solving and analytical skills
            </li>
          </ul> -->
          <div class="mt-5">
            <a
              class="py-2 px-4 font-[600] rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white md:ms-2 w-full md:w-auto"
              href="/job-apply"
              >Apply Now</a
            >
          </div>
        </div>
        <div class="lg:col-span-4 md:col-span-6">
          <div
            class="shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900 sticky top-20"
          >
            <div class="p-6">
              <h5 class="text-lg font-semibold">Job Information</h5>
            </div>
            <div class="p-6 border-t border-slate-100 dark:border-t-gray-700">
              <ul class="list-none">
                <li class="flex items-center">
                  <i class="pi pi-verified"></i>
                  <div class="ms-4">
                    <p class="font-medium">Employee Type:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{ state.job.type }}</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-map-marker"></i>
                  <div class="ms-4">
                    <p class="font-medium">Location:</p>
                    <span class="text-emerald-600 font-medium text-sm">Australia</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-desktop"></i>
                  <div class="ms-4">
                    <p class="font-medium">Job Type:</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{ state.job.level }} {{ state.job.position }}</span
                    >
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-briefcase"></i>
                  <div class="ms-4">
                    <p class="font-medium">Experience:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{
                      state.job.experience
                    }}</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-book"></i>
                  <div class="ms-4">
                    <p class="font-medium">Qualifications:</p>
                    <span class="text-emerald-600 font-medium text-sm">MCA</span>
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-dollar"></i>
                  <div class="ms-4">
                    <p class="font-medium">Salary:</p>
                    <span class="text-emerald-600 font-medium text-sm"
                      >{{ state.job.salary_start }} - {{ state.job.salary_end }}
                      {{ state.job.currency }}</span
                    >
                  </div>
                </li>
                <li class="flex items-center mt-3">
                  <i class="pi pi-clock"></i>
                  <div class="ms-4">
                    <p class="font-medium">Date posted:</p>
                    <span class="text-emerald-600 font-medium text-sm">{{
                      state.job.created_at
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SimilarJobs />
  </section>
</template>
