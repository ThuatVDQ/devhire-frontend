<template>
  <footer class="relative bg-slate-900 dark:bg-slate-800">
    <div class="container">
      <div class="grid grid-cols-1">
        <div class="relative py-12">
          <div class="relative w-full">
            <div class="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
              <div class="md:col-span-3">
                <a
                  href=""
                  class="flex justify-center md:justify-start focus:outline-none ml-2 text-2xl font-bold text-blue-600"
                >
                  <img src="../assets/logo.svg" alt="" class="w-12 h-12" />DevHire
                </a>
              </div>
              <div class="md:col-span-9">
                <ul
                  class="list-disc footer-list ltr:md:text-right rtl:md:text-left text-center space-x-3"
                >
                  <li class="inline-block">
                    <a
                      class="text-gray-300 hover:text-gray-400 duration-500 ease-in-out font-medium me-4"
                      href="/"
                      >Home</a
                    >
                  </li>
                  <li class="inline-block mt-[10px] md:mt-0">
                    <a
                      class="text-gray-300 hover:text-gray-400 duration-500 ease-in-out font-medium me-4"
                      href="/services"
                      >How it works</a
                    >
                  </li>
                  <li class="inline-block mt-[10px] md:mt-0">
                    <a
                      @click.prevent="showLoginPrompt"
                      class="text-gray-300 hover:text-gray-400 duration-500 ease-in-out font-medium me-4"
                      href="#"
                      >Create a job</a
                    >
                  </li>
                  <li class="inline-block mt-[10px] md:mt-0">
                    <a
                      class="text-gray-300 hover:text-gray-400 duration-500 ease-in-out font-medium me-4"
                      href="/about"
                      >About us</a
                    >
                  </li>
                  <li class="inline-block mt-[10px] md:mt-0">
                    <a
                      class="text-gray-300 hover:text-gray-400 duration-500 ease-in-out font-medium"
                      href="/contact"
                      >Contact us</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-[30px] px-0 border-t border-gray-800 dark:border-gray-700">
      <div class="container">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="ltr:md:text-left rtl:md:text-right text-center">
            <p class="mb-0 text-gray-300 font-medium">
              ©2024 DevHire.
              <i class="text-red-600"></i> by <a class="text-reset" href="" target="_blank">aa</a>.
            </p>
          </div>
          <!-- <ul class="list-none ltr:md:text-right rtl:md:text-left text-center space-x-0.5">
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
                target="_blank"
              ></a>
            </li>
            <li class="inline">
              <a
                class="btn btn-icon btn-sm border-2 border-gray-800 dark:border-gray-700 rounded-md hover:border-emerald-600 dark:hover:border-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white"
                href=""
              ></a>
            </li>
          </ul> -->
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const showLoginPrompt = () => {
  toastr.info('Please log in as an employer to create a job.', 'Login Required')
}
</script>
