<script setup>
import Card from '../components//Card.vue'
import CardExploreJob from '../components/CardExploreJob.vue'

// Counter data
const counterItems = [
  { value: '1,548', suffix: 'K+', label: 'Job Fulfillment' },
  { value: '25', suffix: '+', label: 'Branches' },
  { value: '9', suffix: '+', label: 'years experience' }
]

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

// FAQ data
const faqs = [
  {
    question: 'How our Jobstack work?',
    answer:
      'Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts.'
  },
  {
    question: 'What is the main process open account?',
    answer:
      'Words is random, the reader will not be distracted from making a neutral judgement on the visual impact.'
  },
  {
    question: 'How to make unlimited data entry?',
    answer:
      'Furthermore, it is advantageous when the dummy text is relatively realistic so that the layout impression of the final publication is not compromised.'
  },
  {
    question: 'Is DevHire safer to use with my account?',
    answer:
      "The most well-known dummy text is the 'Lorem Ipsum', which is said to have originated in the 16th century. Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin."
  }
]
</script>
<template>
  <section
    class="relative table w-full py-36 bg-[url('../assets/bg-about-us.jpg')] bg-top bg-no-repeat bg-cover"
  >
    <div class="absolute inset-0"></div>
    <div class="container">
      <div class="grid grid-cols-1 text-center mt-10">
        <h3 class="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium">
          About Us
        </h3>
      </div>
    </div>
  </section>
  <div class="md:py-24 py-16">
    <div class="container md:pb-16">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-5 md:col-span-6">
          <div class="relative">
            <div class="relative">
              <img
                class="lg:w-[400px] w-[280px] rounded-md shadow dark:shadow-gray-700"
                src="../assets/bg.jpg"
              />
              <div class="absolute top-0 translate-y-2/4 end-0 text-center">
                <a
                  datatype="youtube"
                  class="lightbox size-20 rounded-full shadow-lg dark:shadow-gray-700 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-emerald-600 dark:text-white"
                  ><i class="pi pi-play"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-7 md:col-span-6 mt-14 md:mt-0">
          <div class="lg:ms-5">
            <h3 class="mb-6 md:text-[26px] text-2xl md:leading-normal leading-normal font-semibold">
              Millions of jobs. <br />
              Find the one that's right for you.
            </h3>
            <p class="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own personalized salary estimate.
              Read reviews on over 30000+ companies worldwide.
            </p>
            <ul class="list-none text-slate-400 mt-4">
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle mr-3 text-emerald-600 text-xl me-2"></i> Digital
                Marketing Solutions for Tomorrow
              </li>
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle mr-3 text-emerald-600 text-xl me-2"></i> Our Talented &
                Experienced Marketing Agency
              </li>
              <li class="mb-1 flex items-center">
                <i class="pi pi-check-circle mr-3 text-emerald-600 text-xl me-2"></i> Create your
                own skin to match your brand
              </li>
            </ul>
            <div class="mt-6">
              <button
                class="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
                type="submit"
              >
                <i class="pi pi-envelope mr-2"></i>
                Contact us
              </button>
            </div>
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
    <div class="container md:mt-24 mt-16">
      <div class="grid grid-cols-1">
        <div class="relative overflow-hidden bg-emerald-600 rounded-md shadow dark:shadow-gray-700">
          <div class="grid md:grid-cols-2 items-center gap-[30px]">
            <div class="relative">
              <img src="../assets/img-about-us-3.jpg" />
              <div
                class="absolute md:bottom-1/2 md:translate-y-1/2 md:-end-10 ltr:md:translate-x-0 rtl:md:translate-x-0 -bottom-10 end-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2 text-center"
              >
                <a
                  class="lightbox size-20 rounded-full shadow-lg dark:shadow-gray-700 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-emerald-600 dark:text-white"
                  ><i class="pi pi-play inline-flex items-center justify-center text-2xl"></i
                ></a>
              </div>
            </div>
            <div>
              <div class="text-white p-4">
                <h4 class="leading-normal text-4xl mb-3 font-semibold">
                  Get the job of your <br />
                  dreams quickly.
                </h4>
                <p class="text-white/70 text-lg max-w-xl">
                  Search all the open positions on the web. Get your own personalized salary
                  estimate. Read reviews on over 30000+ companies worldwide.
                </p>
                <ul class="list-none text-white/50 mt-4">
                  <li class="mb-1 flex items-center">
                    <i class="pi pi-check-circle mr-3 text-xl me-2"></i> Digital Marketing Solutions
                    for Tomorrow
                  </li>
                  <li class="mb-1 flex items-center">
                    <i class="pi pi-check-circle mr-3 text-xl me-2"></i> Our Talented & Experienced
                    Marketing Agency
                  </li>
                  <li class="mb-1 flex items-center">
                    <i class="pi pi-check-circle mr-3 text-xl me-2"></i> Create your own skin to
                    match your brand
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container md:mt-24 mt-16">
      <div class="grid md:grid-cols-3 grid-cols-1 items-center gap-[30px] z-1">
        <div v-for="(item, index) in counterItems" :key="index" class="counter-box text-center">
          <h1 class="lg:text-5xl text-4xl font-semibold mb-2 dark:text-white">
            <span>{{ item.value }}</span
            >{{ item.suffix }}
          </h1>
          <h5 class="counter-head text-sm font-semibold text-slate-400 uppercase">
            {{ item.label }}
          </h5>
        </div>
      </div>
    </div>
    <div class="container md:mt-24 mt-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Questions & Answers
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized salary estimate. Read
          reviews on over 30000+ companies worldwide.
        </p>
      </div>
      <div class="grid md:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
        <div v-for="(faq, index) in faqs" :key="index" class="flex">
          <i class="pi pi-question-circle mr-3 mt-1.5 text-emerald-600"></i>
          <div class="flex-1">
            <h5 class="mb-2 text-lg font-semibold">{{ faq.question }}</h5>
            <p class="text-slate-400">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid md:mt-24 mt-16">
      <CardExploreJob />
    </div>
  </div>
</template>
