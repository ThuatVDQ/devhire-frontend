<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">Dashboard</h1>
  </header>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->

    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Stat Card 1 -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Users</h3>
          <i class="pi pi-users text-2xl text-blue-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">1,235</p>
        <p class="text-green-500 text-sm">+3% from last month</p>
      </div>

      <!-- Stat Card 2 -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Jobs</h3>
          <i class="pi pi-briefcase text-2xl text-green-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">245</p>
        <p class="text-red-500 text-sm">-2% from last month</p>
      </div>

      <!-- Stat Card 3 -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Companies</h3>
          <i class="pi pi-building text-2xl text-yellow-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">53</p>
        <p class="text-green-500 text-sm">+8% from last month</p>
      </div>
    </section>

    <!-- Chart Section -->
    <section class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Monthly Overview</h2>
      <div class="h-64 bg-gray-200 flex items-center justify-center">
        <!-- Placeholder for Chart -->
        <span class="text-gray-500">Chart goes here</span>
      </div>
    </section>

    <!-- Table Section -->
    <section class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="text-gray-600 uppercase text-sm leading-normal bg-gray-100">
              <th class="py-3 px-6">User</th>
              <th class="py-3 px-6">Action</th>
              <th class="py-3 px-6">Date</th>
              <th class="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm">
            <tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td class="py-3 px-6">John Doe</td>
              <td class="py-3 px-6">Created a job post</td>
              <td class="py-3 px-6">2023-11-01</td>
              <td class="py-3 px-6">
                <span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs"
                  >Completed</span
                >
              </td>
            </tr>
            <tr class="border-b border-gray-200 bg-white hover:bg-gray-100">
              <td class="py-3 px-6">Jane Smith</td>
              <td class="py-3 px-6">Updated company info</td>
              <td class="py-3 px-6">2023-11-02</td>
              <td class="py-3 px-6">
                <span class="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs"
                  >Pending</span
                >
              </td>
            </tr>
            <tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td class="py-3 px-6">Mike Johnson</td>
              <td class="py-3 px-6">Applied for a job</td>
              <td class="py-3 px-6">2023-11-03</td>
              <td class="py-3 px-6">
                <span class="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs">Rejected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
// You can add chart data and other necessary data fetching logic here.
</script>

<style scoped>
/* Any additional styling specific to this component can go here. */
</style>
