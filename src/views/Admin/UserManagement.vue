<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">User Management</h1>
  </header>

  <section class="p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="relative w-1/3">
        <input
          type="text"
          placeholder="Search by..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
        />
        <i
          class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
      </div>
    </div>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">ID</th>
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">Email</th>
            <th class="py-3 px-6">Role</th>
            <th class="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm">
          <tr class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6">1</td>
            <td class="py-3 px-6">John Doe</td>
            <td class="py-3 px-6">john.doe@example.com</td>
            <td class="py-3 px-6">Admin</td>
            <td class="py-3 px-6">
              <button class="text-blue-500 hover:underline mr-4">Edit</button>
              <button class="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="grid md:grid-cols-12 grid-cols-1 mt-8">
      <div class="md:col-span-12 text-center">
        <nav aria-label="Page navigation example">
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-l-full border border-gray-300"
                @click.prevent="changePage(currentPage - 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage <= 0 }"
              >
                <i class="pi pi-angle-left"></i>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page">
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center border border-gray-300"
                :class="{
                  'bg-emerald-600 text-white': currentPage === page - 1,
                  'bg-white text-gray-700': currentPage !== page - 1
                }"
                @click.prevent="changePage(page - 1)"
              >
                {{ page }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="w-10 h-10 flex justify-center items-center text-gray-400 bg-white rounded-r-full border border-gray-300"
                @click.prevent="changePage(currentPage + 1)"
                :class="{ 'opacity-50 pointer-events-none': currentPage >= totalPages - 1 }"
              >
                <i class="pi pi-angle-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(0)
const totalPages = 5

function changePage(page) {
  if (page >= 0 && page < totalPages) {
    currentPage.value = page
  }
}
</script>
