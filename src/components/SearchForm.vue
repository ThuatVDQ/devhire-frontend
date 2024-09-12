<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-800 md:p-8 p-6 lg:me-10 relative"
  >
    <!-- Left Section: Text and Form -->
    <div>
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white leading-tight">
        Find Your <br />Dream <span class="text-emerald-600">Job</span> Here
      </h1>
      <p class="mt-4 text-slate-500 dark:text-slate-300">
        Explore thousands of job opportunities, career options, and employment offers from top
        companies.
      </p>

      <!-- Search Form -->
      <form class="mt-6">
        <div class="grid grid-cols-1 gap-4">
          <!-- Search Keywords -->
          <div class="mb-4">
            <label class="form-label font-medium">Search:</label>
            <div class="filter-search-form relative mt-2 flex items-center">
              <i class="pi pi-briefcase absolute left-3 text-green-500"></i>
              <input
                type="text"
                placeholder="Job title, keywords..."
                class="form-input w-full bg-gray-50 dark:bg-slate-800 rounded-md pl-10 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Location -->
          <div class="mb-4">
            <label class="form-label font-medium">Location:</label>
            <div class="filter-search-form relative mt-2 flex items-center">
              <i class="pi pi-map-marker absolute left-3 text-green-500"></i>
              <input
                type="text"
                placeholder="City, country..."
                class="form-input w-full bg-gray-50 dark:bg-slate-800 rounded-md pl-10 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Job Type -->
          <div class="mb-4">
            <label class="form-label font-medium">Job Type:</label>
            <div class="filter-search-form relative mt-2 flex items-center">
              <i class="pi pi-briefcase absolute left-3 text-green-500"></i>
              <select
                class="form-select w-full bg-gray-50 dark:bg-slate-800 rounded-md pl-10 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option>Select job type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          <!-- Search Button -->
          <button
            type="button"
            class="text-white bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 font-medium rounded-lg px-5 py-2.5 mb-2"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
