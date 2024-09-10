<template>
  <section
    class="relative py-36 table w-full bg-gradient-to-b from-emerald-600/20 dark:from-emerald-600/40 via-emerald-600/10 dark:via-emerald-600/20 to-transparent"
  >
    <div class="container mx-auto">
      <div class="grid md:grid-cols-2 grid-cols-1 items-center mt-10 gap-[30px]">
        <div class="md:order-1 order-2">
          <div
            class="bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-800 md:p-8 p-6 lg:me-10 relative"
          >
            <!-- Left Section: Text and Form -->
            <div>
              <h1 class="text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                Find Your <br />Dream <span class="text-emerald-600">Job</span> Here
              </h1>
              <p class="mt-4 text-slate-500 dark:text-slate-300">
                Explore thousands of job opportunities, career options, and employment offers from
                top companies.
              </p>

              <!-- Search Form -->
              <form class="mt-6">
                <div class="grid grid-cols-1 gap-4">
                  <!-- Search Keywords -->
                  <div class="relative">
                    <label class="form-label font-medium">Search:</label>
                    <input
                      type="text"
                      placeholder="Job title, keywords..."
                      class="form-input w-full mt-2 bg-gray-50 dark:bg-slate-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <!-- Location -->
                  <div class="relative">
                    <label class="form-label font-medium">Location:</label>
                    <input
                      type="text"
                      placeholder="City, country..."
                      class="form-input w-full mt-2 bg-gray-50 dark:bg-slate-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <!-- Job Type -->
                  <div class="relative">
                    <label class="form-label font-medium">Job Type:</label>
                    <select
                      class="form-select w-full mt-2 bg-gray-50 dark:bg-slate-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Select job type</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Freelance</option>
                    </select>
                  </div>

                  <!-- Search Button -->
                  <button
                    type="submit"
                    class="btn bg-emerald-600 hover:bg-emerald-700 text-white rounded-md mt-4 py-3 w-full"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="md:order-2 order-1">
          <img
            src="https://jobstack-shreethemes.vercel.app/static/media/woman_working_2.26b4fe242bd386b51ed8fe80be6ff7bb.svg"
            alt="Job Search"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'JobHeroSection'
}
</script>

<style scoped>
.form-input {
  border: 1px solid #e5e7eb;
}

.form-select {
  border: 1px solid #e5e7eb;
}

.btn {
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
</style>
