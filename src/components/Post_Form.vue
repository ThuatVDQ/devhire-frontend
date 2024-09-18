<template>
  <section class="relative bg-slate-50 dark:bg-slate-800 lg:py-24 py-16 px-20">
    <div class="container">
      <div class="lg:flex justify-center">
        <div class="lg:w-2/3">
          <div class="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
            <div class="text-left">
              <div class="grid grid-cols-1">
                <h5 class="text-lg font-semibold">Job Details:</h5>
              </div>
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Title</label>
                  <input type="text" class="form-input" placeholder="..." />
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Description</label>
                  <textarea
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Categories</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Job Type</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="md:col-span-6 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Currency</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="md:col-span-3 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold md:invisible md:block hidden">Min:</label>
                  <div class="relative mt-1">
                    <input type="number" class="form-input" placeholder="Min:" />
                  </div>
                </div>
                <div class="md:col-span-3 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold md:invisible md:block hidden">Max:</label>
                  <div class="relative mt-1">
                    <input type="number" class="form-input" placeholder="Max: " />
                  </div>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Experience</label>
                  <input type="text" class="form-input" placeholder="Experience" />
                </div>
              </div>
              <div class="grid grid-cols-1 mt-8">
                <h5 class="text-lg font-semibold">Address</h5>
              </div>
              <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Country</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">City</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="md:col-span-4 col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">District</label>
                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></select>
                </div>
                <div class="col-span-12 ltr:text-left rtl:text-right">
                  <label class="font-semibold">Address</label>
                  <input type="text" class="form-input" placeholder="Address" />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <button
                    class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
                    type="submit"
                  >
                    PostNow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
