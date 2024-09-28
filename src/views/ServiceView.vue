<script setup>
import Card from '../components//Card.vue'
import CardExploreJob from '../components/CardExploreJob.vue'
import Accordion from '@/components/Accordion.vue'
import { ref } from 'vue'

const openAccordion = ref(null)

const handleToggleAccordion = (index) => {
  openAccordion.value = openAccordion.value === index ? null : index
}
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
  },
  {
    title: 'Apply with confidence',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-user-plus'
  },
  {
    title: 'Reduce Hiring Bias',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-user-plus'
  },
  {
    title: 'Proactive Employers',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-briefcase'
  },
  {
    title: 'No Missed Opportunities',
    description: 'Many desktop publishing now use and a search for job',
    icon: 'pi pi-users'
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
          Services
        </h3>
      </div>
    </div>
  </section>
  <section class="relative md:py-24 py-16">
    <div class="container">
      <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[30px]">
        <Card
          v-for="(card, index) in cardItems"
          :key="index"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </div>
    <div class="container md:mt-24 md:pb-16 mt-16">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-5 md:col-span-6">
          <div class="relative">
            <div class="relative">
              <img
                src="https://jobstack-shreethemes.vercel.app/static/media/ab01.016884c7bf778010e79c.jpg"
                alt=""
                class="lg:w-[400px] w-[280px] rounded-md shadow dark:shadow-gray-700"
              />
              <div class="absolute top-0 translate-y-2/4 end-0 text-center">
                <a
                  href=""
                  class="lightbox size-20 rounded-full shadow-lg dark:shadow-gray-700 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-emerald-600 dark:text-white"
                >
                  <i
                    class="pi pi-caret-right text-emerald-500 inline-flex items-center justify-center text-2xl"
                  ></i>
                </a>
              </div>
            </div>
            <div class="absolute md:-end-5 end-0 -bottom-16">
              <img
                src="https://jobstack-shreethemes.vercel.app/static/media/ab02.f851a3dde08585493f97.jpg"
                alt=""
                class="lg:w-[280px] w-[200px] border-8 border-white dark:border-slate-900 rounded-md shadow dark:shadow-gray-700"
              />
            </div>
          </div>
        </div>
        <div class="lg:col-span-7 md:col-span-6 mt-14 md:mt-0">
          <div class="lg:ms-5">
            <h3 class="mb-6 md:text-[26px] text-2xl md:leading-normal leading-normal font-semibold">
              Frequently Asked Questions
            </h3>
            <p class="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own personalized salary estimate.
              Read reviews on over 30000+ companies worldwide.
            </p>
            <div class="mt-8">
              <Accordion
                title="How does it work ?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 0"
                @toggle="handleToggleAccordion(0)"
              />
              <Accordion
                title="Do I need a designer to use DevHire ?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 1"
                @toggle="handleToggleAccordion(1)"
              />
              <Accordion
                title="What do I need to do to start selling ?"
                description="There are many variations of passages of Lorem Ipsum available, but the
                      majority have suffered alteration in some form."
                :isOpen="openAccordion === 2"
                @toggle="handleToggleAccordion(2)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid md:mt-24 mt-16">
      <CardExploreJob />
    </div>
  </section>
</template>
