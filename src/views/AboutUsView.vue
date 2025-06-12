<script setup>
import Card from '../components//Card.vue'
import CardExploreJob from '../components/CardExploreJob.vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import aboutus01 from '../assets/about_us01-Dky8rhyA.jpg'
import aboutus02 from '../assets/about_us02-Dnw9ga1r.jpg'

const jobsCount = ref(0)
const companiesCount = ref(0)

const counterItems = [
  { value: jobsCount, suffix: '+', label: 'Job Fulfillment' },
  { value: companiesCount, suffix: '+', label: 'Branches' },
  {
    value: calculateExperience().value,
    suffix: '+',
    label: calculateExperience().label
  }
]

function calculateExperience() {
  // Tháng 11/2024
  const targetDate = new Date('2024-11-01')
  // Thời điểm hiện tại
  const currentDate = new Date()

  // Tính số năm
  let yearsDifference = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsDifference = currentDate.getMonth() - targetDate.getMonth()

  // Nếu tháng hiện tại trước tháng 11, giảm đi 1 năm
  if (monthsDifference < 0) {
    yearsDifference--
    monthsDifference += 12 // Cộng thêm 12 tháng
  }

  // Trả về số tháng nếu năm < 1
  if (yearsDifference < 1) {
    return {
      value: monthsDifference,
      label: 'months experiences'
    }
  }

  // Trả về số năm và số tháng nếu năm >= 1
  return {
    value: yearsDifference,
    label: 'years experiences'
  }
}

const getJobCount = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/total')
    jobsCount.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const getCompanyCount = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/companies/total')
    companiesCount.value = response.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getJobCount()
  getCompanyCount()
})
// Card data
const cardItems = [
  {
    title: '24/7 Support',
    description:
      'We offer round-the-clock support to assist you with any inquiries or issues, no matter the time.',
    icon: 'pi pi-phone'
  },
  {
    title: 'Tech & Startup Jobs',
    description:
      'Explore a wide range of exciting opportunities in the tech and startup industries to jumpstart your career.',
    icon: 'pi pi-slack'
  },
  {
    title: 'Quick & Easy',
    description:
      'Our platform is designed for a seamless and user-friendly experience, so you can find your next job in no time.',
    icon: 'pi pi-user-plus'
  },
  {
    title: 'Save Time',
    description:
      'We help you save valuable time by offering efficient and automated job search and application processes.',
    icon: 'pi pi-hourglass'
  }
]

// FAQ data
const faqs = [
  {
    question: 'How does DevHire work?',
    answer:
      'DevHire connects talented developers with businesses, offering a seamless platform for finding and managing top-tier professionals for projects and full-time roles.'
  },
  {
    question: 'What is the process for opening an account?',
    answer:
      'The account opening process is straightforward—simply sign up with your email, fill in your profile details, and you’re ready to start connecting with the best talent or companies.'
  },
  {
    question: 'How can I enter unlimited data?',
    answer:
      'DevHire allows you to input unlimited data on projects, candidates, and job requirements, making it easier to manage everything in one place.'
  },
  {
    question: 'Is DevHire safe to use with my account?',
    answer:
      'DevHire prioritizes security, using encryption and secure authentication methods to ensure that your account and personal data are protected.'
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
                :src="aboutus01"
                alt=""
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
                :src="aboutus02"
                alt=""
                class="lg:w-[280px] w-[200px] border-8 border-white dark:border-slate-900 rounded-md shadow dark:shadow-gray-700"
              />
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
    <div class="container md:mt-24 mt-16">
      <div class="grid grid-cols-1 pb-8 text-center">
        <h3 class="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
          Here's why you'll love it DevHire
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
          link="/about"
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
