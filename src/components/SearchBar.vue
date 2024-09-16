<template>
  <section>
    <div class="container">
      <div class="grid grid-cols-1 text-center mt-10">
        <h3
          class="md:text-4xl text-3xl md:leading-tight leading-snug tracking-wide font-bold text-gray-900"
        >
          Job Vacancies
        </h3>
      </div>
    </div>
    <div class="container z-1">
      <div class="d-flex" id="reserve-form">
        <div class="md:w-5/6 mx-auto">
          <div class="lg:col-span-10">
            <div class="bg-white dark:bg-slate-900 border-0 shadow rounded-md p-3">
              <form class="flex items-center bg-white rounded-lg shadow-md p-4">
                <div class="registration-form text-dark text-start">
                  <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
                    <div class="flex items-center border-r border-gray-300 pr-4">
                      <i class="pi pi-briefcase text-green-500 mr-2"></i>
                      <input
                        type="text"
                        placeholder="Search ..."
                        class="block w-full p-1 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div class="flex items-center border-r border-gray-300 px-4">
                      <i class="pi pi-map-marker text-green-500 mr-2"></i>
                      <select class="bg-transparent border-none outline-none">
                        <option>Select...</option>
                      </select>
                    </div>

                    <div class="flex items-center px-4">
                      <i class="pi pi-briefcase text-green-500 mr-2"></i>
                      <select class="bg-transparent border-none outline-none">
                        <option>Select...</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      class="ml-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
