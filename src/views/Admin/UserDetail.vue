<script setup>
import { reactive, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import defaultAvatar from '@/assets/avatar-default.svg'
import toastr, { error } from 'toastr'
import 'toastr/build/toastr.min.css'

const data = reactive({
  user: {}
})
const route = useRoute()
const user_id = route.params.id

const currentAvatar = ref(defaultAvatar)

async function fetchDataUser() {
  try {
    const response = await axios.get(`http://localhost:8090/api/admin/${user_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    data.user = response.data
    if (data.user.avatar_url) {
      currentAvatar.value = `http://localhost:8090/uploads/${data.user.avatar_url}`
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchDataUser()
})
</script>

<template>
  <section class="dark:bg-gray-800 py-8">
    <div class="container">
      <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
        <div class="lg:col-span-4 md:col-span-6">
          <div
            class="relative md:flex items-center p-2 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900"
          >
            <div class="relative">
              <img
                :src="currentAvatar"
                alt="User Avatar"
                class="rounded-full size-28 bg-white dark:bg-slate-900 dark:shadow-gray-700"
              />
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
        </div>
        <div class="lg:col-span-8 md:col-span-6">
          <div class="p-6 shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
            <h5 class="text-xl font-semibold mb-5">Personal Details</h5>
            <label class="font-semibold">Introduction</label>
            <p class="text-gray-700 dark:text-gray-300">{{ data.user.introduction }}</p>
            <div class="flex space-x-4 mb-5">
              <div class="w-1/2">
                <label class="font-semibold">Name</label>
                <p class="text-gray-700 dark:text-gray-300">{{ data.user.fullName }}</p>
              </div>
              <div class="w-1/2">
                <label class="font-semibold">Gender</label>
                <p class="text-gray-700 dark:text-gray-300">{{ data.user.gender }}</p>
              </div>
            </div>
            <label class="font-semibold">Phone</label>
            <p class="text-gray-700 dark:text-gray-300">{{ data.user.phone }}</p>
            <label class="font-semibold">Email</label>
            <p class="text-gray-700 dark:text-gray-300">{{ data.user.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
