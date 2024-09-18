<script setup>
import Card from './Card.vue'
import CardExploreJob from './CardExploreJob.vue'
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
    <CardExploreJob />
  </section>
</template>
