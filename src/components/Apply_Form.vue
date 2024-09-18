<template>
  <section class="relative bg-slate-50 dark:bg-slate-800 lg:py-24 py-16">
    <div class="container">
      <div class="md:flex justify-center">
        <div class="lg:w-2/4 md:w-2/3">
          <div class="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
            <form class="text-left">
              <div class="grid grid-cols-1">
                <div class="mb-4 ltr:text-left rtl:text-right inline-grid">
                  <label class="font-semibold">Your Name:</label>
                  <input type="text" class="form-input" placeholder="Your name is ..." />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right inline-grid">
                  <label class="font-semibold">Email Address</label>
                  <input type="text" class="form-input" placeholder="Your email is ..." />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right inline-grid">
                  <label class="font-semibold">Phone No</label>
                  <input type="text" class="form-input" placeholder="Your phone number is ..." />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right inline-grid">
                  <label class="font-semibold">Converting Letter</label>
                  <textarea
                    type="text"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Message: ..."
                  ></textarea>
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right inline-grid">
                  <label class="font-semibold">Upload Resume</label>
                  <input
                    type="file"
                    id="file_input"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <button
                    class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
