<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'

const data = reactive({
  user: {}
})

async function fetchDataUser() {
  try {
    const response = await axios.get('http://localhost:8000/users/1')
    data.user = response.data
    console.log(data.user)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchDataUser()
})
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-800 py-8">
    <div class="container">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-4 md:col-span-6">
          <div
            class="relative md:flex items-center p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <div class="relative">
              <img
                :src="data.user.avatar_url"
                alt="User Avatar"
                class="rounded-full size-28 p-4 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700"
              />
              <i
                class="pi pi-camera absolute bottom-0 right-0 p-1 bg-gray-300 rounded-full text-xl cursor-pointer"
                style="transform: translate(25%, 25%)"
              ></i>
            </div>
            <div class="md:ms-4 md:mt-0 mt-6">
              <h3 class="text-xl font-semibold">Welcome, {{ data.user.full_name }}</h3>
              <div class="mt-2">
                <span
                  class="inline-block px-2 py-1 text-sm font-semibold rounded-md mt-2 bg-green-100 text-green-800"
                >
                  {{ data.user.status }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="mt-3 bg-slate-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-700 p-6"
          >
            <div class="flex justify-between mt-3">
              <span class="text-slate-600 font-medium">Social: </span>
              <ul class="list-none ltr:text-right rtl:text-left space-x-0.5">
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.facebook_url"
                  >
                    <i class="pi pi-facebook"></i>
                  </a>
                </li>
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.linkedin_url"
                  >
                    <i class="pi pi-linkedin"></i>
                  </a>
                </li>
                <li class="inline">
                  <a
                    class="p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:text-white text-slate-400"
                    :href="data.user.github_url"
                  >
                    <i class="pi pi-github"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div
              class="mt-3 w-full bg-white dark:bg-slate-900 p-3 rounded-md shadow dark:shadow-gray-700"
            >
              <div class="flex items-center mb-3">
                <i class="pi pi-file"></i>
                <span class="font-medium ms-2">{{ data.user.resume }}</span>
              </div>
              <a
                class="p-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:border-emerald-600 text-white rounded-md w-full flex items-center justify-center"
                :href="data.user.resume"
                target="_blank"
              >
                <i class="pi pi-file"></i>Download CV
              </a>
            </div>
          </div>
        </div>
        <div class="lg:col-span-8 md:col-span-6">
          <div class="p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
            <h5 class="text-xl font-semibold mb-5">Personal Details</h5>
            <label class="font-semibold">Introduction</label>
            <textarea
              v-model="data.user.introduction"
              class="block mb-5 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[200px]"
            ></textarea>
            <label class="font-semibold">Name</label>
            <input type="text" v-model="data.user.full_name" class="form-input mb-5" />
            <label class="font-semibold">Phone</label>
            <input type="text" v-model="data.user.phone" class="form-input mb-5" />
            <label class="font-semibold">Email</label>
            <input type="text" v-model="data.user.email" class="form-input mb-5" />
            <button
              class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
          <div class="p-6 mt-3 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
            <h5 class="text-xl font-semibold mb-5">Social Url</h5>
            <label class="font-semibold">Facebook</label>
            <input type="text" v-model="data.user.facebook_url" class="form-input mb-5" />
            <label class="font-semibold">Linkedin</label>
            <input type="text" v-model="data.user.linkedin_url" class="form-input mb-5" />
            <label class="font-semibold">Github</label>
            <input type="text" v-model="data.user.github_url" class="form-input mb-5" />
            <button
              class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
