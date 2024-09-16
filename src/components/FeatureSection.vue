<script setup>
import Card from './Card.vue'
</script>
<template>
  <section class="relative md:py-24 py-16">
    <div class="container">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Here's why you'll love it Jobstack
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 mt-6 gap-[30px]">
        <Card
          title="24/7 Support"
          description="Many desktop publishing now use and a search for job"
          icon="pi pi-phone"
        />
        <Card
          title="Tech & Startup Jobs"
          description="Many desktop publishing now use and a search for job"
          icon="pi pi-slack"
        />
        <Card
          title="Quick & Easy"
          description="Many desktop publishing now use and a search for job"
          icon="pi pi-user-plus"
        />
        <Card
          title="Save Time"
          description="Many desktop publishing now use and a search for job"
          icon="pi pi-hourglass"
        />
      </div>
    </div>
    <div class="container-fluid md:mt-24 mt-16">
      <div class="container">
        <div class="grid grid-cols-1">
          <div
            class="relative overflow-hidden lg:px-8 px-6 py-10 rounded-xl shadow-lg dark:shadow-gray-700"
          >
            <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
              <div class="lg:col-span-8 md:col-span-7">
                <div class="ltr:md:text-left rtl:md:text-right text-left relative z-1">
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-4">
                    Explore a job now!
                  </h3>
                  <p class="text-slate-400 max-w-xl">
                    Search all the open positions on the web. Get your own personalized salary
                    estimate. Read reviews on over 30000+ companies worldwide.
                  </p>
                </div>
              </div>
              <div class="lg:col-span-4 md:col-span-5">
                <div class="ltr:text-right rtl:text-left relative z-1">
                  <a
                    class="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:border-emerald-600 text-white rounded-md border-1 inline-block text-[15px] font-semibold tracking-[.025em] leading-[28px] px-5 py-1"
                    href=""
                    >Apply Now</a
                  >
                  <a
                    class="btn bg-emerald-600/5 hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 hover:text-white rounded-md ms-2 border-1 inline-block text-[15px] font-semibold tracking-[.025em] leading-[28px] px-5 py-1"
                    >Learn More</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
