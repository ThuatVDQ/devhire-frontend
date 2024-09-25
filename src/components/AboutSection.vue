<script setup>
import Card from './Card.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="relative md:py-24 py-16">
    <div class="container">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          How it's Work?
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-6 gap-[30px]">
        <Card
          title="Create Account"
          description="The phrasal sequence of the is now so that many campaign and benefit"
          icon="pi pi-user-plus"
          link="/register"
        />
        <Card
          title="Complete Your Profile"
          description="The phrasal sequence of the is now so that many campaign and benefit"
          icon="pi pi-verified"
          link="/profile"
        />
        <Card
          title="Apply Job or Hire"
          description="The phrasal sequence of the is now so that many campaign and benefit"
          icon="pi pi-folder-open"
          link="/jobs"
        />
      </div>
    </div>
    <div class="container md:mt-24 mt-16">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-5 md:col-span-6">
          <div class="relative">
            <div class="grid grid-cols-12 gap-6 items-center">
              <div class="col-span-6">
                <div class="grid grid-cols-1 gap-6">
                  <img
                    src="https://jobstack-shreethemes.vercel.app/static/media/ab03.2b6e24b09b3690407ec5.jpg"
                    alt="image"
                  />
                  <img
                    src="https://jobstack-shreethemes.vercel.app/static/media/ab02.f851a3dde08585493f97.jpg"
                    alt="image"
                  />
                </div>
              </div>
              <div class="col-span-6">
                <div class="grid grid-cols-1 gap-6">
                  <img
                    src="https://jobstack-shreethemes.vercel.app/static/media/ab01.016884c7bf778010e79c.jpg"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            <div class="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">
              <RouterLink
                to="/about-us"
                class="lightbox size-20 rounded-full shadow-lg dark:shadow-gray-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-emerald-600 dark:text-white"
                ><i class="pi pi-caret-right text-emerald-500 text-xl"></i
              ></RouterLink>
            </div>
          </div>
        </div>
        <div class="lg:col-span-7 md:col-span-6">
          <div class="lg:ms-8">
            <h3 class="mb-6 md:text-4xl text-3xl md:leading-normal leading-normal font-bold">
              Get the job of you dreams
              <br />
              quick & easy.
            </h3>
            <p class="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own personalized salary estimate.
              Read reviews on over 30000+ companies worldwide.
            </p>
            <ul class="list-none text-slate-400 mt-4">
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle text-emerald-600 me-2"></i> Digital Marketing Solutions
                for Tomorrow
              </li>
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle text-emerald-600 me-2"></i> Our Talented & Experienced
                Marketing Agency
              </li>
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle text-emerald-600 me-2"></i> Create your own skin to
                match your brand
              </li>
            </ul>
            <div class="mt-6">
              <RouterLink
                to="/contact"
                class="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white mt-2 rounded-md inline-flex items-center px-4 py-2"
              >
                <i class="pi pi-envelope pr-1"></i>Contact us
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
