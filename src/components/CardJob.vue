<template>
  <div class="group relative overflow-hidden bg-white dark:bg-slate-900 shadow hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-700 hover:-mt-2 rounded-md transition-all duration-500 h-fit">
    <div class="p-6">
      <div class="flex items-center">
        <div class="size-14 min-w-[56px] flex items-center justify-center bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
            <img class="size-8" src="../assets/logo.svg"/>
        </div>
        <div class="ms-3">
          <a class="inline-block text-[16px] font-semibold hover:text-emerald-600 transition-all duration-500 me-1" href="">FaceBook</a>
          <span class="inline-block text-sm text-slate-400">2 days ago</span>
          <div>
            <span class="bg-emerald-600/10 inline-block text-emerald-600 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1">Full Time</span>
            <span class="text-sm font-medium inline-block me-1">Est. time: 
              <span class="text-slate-400">1 to 3 months</span>
            </span>
            <span class="text-sm font-medium inline-block me-1">Hourly: 
              <span class="text-slate-400">$16 - 20$</span>
            </span>
          </div>
        </div>
      </div>
      <p class="text-slate-400 py-3">Looking for an experienced Web Designer for an our company.</p>
      <div>
        <span class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1">HTML</span>
        <span class="bg-slate-100 dark:bg-slate-800 inline-block text-slate-900 dark:text-slate-300 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1">CSS</span>
      </div>
    </div>
    <div class="px-6 py-2 bg-slate-50 dark:bg-slate-800 lg:flex justify-between items-center">
      <div class="lg:inline-block flex justify-between">
        <span class="inline-block me-1 font-semibold">
          <i class="pi pi-verified text-blue-500 me-1"></i>
        </span>
        <ul class="list-none inline-block me-1 text-yellow-400 space-x-0.5">
          <li class="inline">
            <i class="pi pi-star-fill text-lg"></i>
          </li>
          <li class="inline">
            <i class="pi pi-star-fill text-lg"></i>
          </li>
        </ul>
        <span class="inline-flex items-center me-1 text-slate-400">
          <i class="pi pi-map-marker"></i>Viet Nam
        </span>
      </div>
      <a class="btn btn-sm rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white md:ms-2 w-full lg:w-auto lg:mt-0 mt-4 px-4 py-1" href="">Apply now</a>
    </div>
    <a class="btn btn-icon rounded-full bg-emerald-600/5 hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 hover:text-white absolute top-0 end-0 m-3" href="">
      <i class="pi pi-bookmark"></i>
    </a>
  </div>
</template>
