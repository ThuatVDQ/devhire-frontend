<script setup>
import Card from '../components//Card.vue'
import CardExploreJob from '../components/CardExploreJob.vue'

// Card data
const cardItems = [
  {
    title: '24/7 Support',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-phone'
  },
  {
    title: 'Tech & Startup Jobs',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-slack'
  },
  {
    title: 'Quick & Easy',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-user-plus'
  },
  {
    title: 'Save Time',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-hourglass'
  }
]

// Pricing plans data
const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    features: ['Full Access', 'Source Files', 'Free Appointments', 'Enhanced Security'],
    buttonLabel: 'Get Started',
    borderColor: 'border-transparent',
    bgColor: 'bg-white'
  },
  {
    name: 'Business',
    price: 39,
    features: ['Full Access', 'Source Files', 'Free Appointments', 'Enhanced Security'],
    buttonLabel: 'Signup',
    borderColor: 'border-emerald-600',
    bgColor: 'bg-gray-50'
  },
  {
    name: 'Professional',
    price: 59,
    features: ['Full Access', 'Source Files', 'Free Appointments', 'Enhanced Security'],
    buttonLabel: 'Try it Now',
    borderColor: 'border-transparent',
    bgColor: 'bg-white'
  }
]
</script>
<template>
  <section
    class="relative table w-full py-36 bg-[url('../assets/banner.png')] bg-top bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0 bg-emerald-400/50"></div>
    <div class="container relative z-10">
      <div class="grid grid-cols-1 text-center">
        <h3
          class="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white"
        >
          Pricing Plans
        </h3>
      </div>
    </div>
  </section>
  <section class="relative lg:py-24 py-16">
    <div class="container">
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[30px]">
        <div
          v-for="(plan, index) in pricingPlans"
          :key="index"
          :class="`group relative shadow hover:shadow-md dark:shadow-gray-800 rounded-md transition-all duration-500 ${plan.borderColor} ${plan.bgColor}`"
        >
          <div class="p-6 py-8">
            <h6 class="text-lg font-bold uppercase mb-5 text-emerald-600">{{ plan.name }}</h6>
            <div class="flex mb-5">
              <span class="text-xl font-semibold">$</span>
              <span class="price text-4xl font-semibold mb-0">{{ plan.price }}</span>
              <span class="text-xl font-semibold self-end mb-1">/mo</span>
            </div>
            <ul
              class="list-none text-slate-400 border-t border-gray-100 dark:border-gray-700 pt-5 mb-8"
            >
              <li v-for="(feature, idx) in plan.features" :key="idx" class="my-2 flex items-center">
                <i class="pi pi-check-circle mr-3 text-emerald-600 text-xl me-2"></i>{{ feature }}
              </li>
            </ul>
            <a
              href="#"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md"
              >{{ plan.buttonLabel }}</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="container md:mt-24 mt-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Here's why you'll love it Jobstack
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
        <Card
          v-for="(card, index) in cardItems"
          :key="index"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </div>
  </section>
</template>
