import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import JobsView from '@/views/JobsView.vue'
import JobDetailView from '@/views/JobDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PostJobView from '@/views/PostJobView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CompanyView from '@/views/CompanyView.vue'
import CompanyDetailView from '@/views/CompanyDetailView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import ServiceView from '@/views/ServiceView.vue'
import PricingView from '@/views/PricingView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RecruiterView from '@/views/RecruiterView.vue'
import CustomerView from '@/views/CustomerView.vue'
import RecruiterDashboard from '@/views/RecruiterDashboard.vue'
import RecruiterJobs from '@/views/RecruiterJobs.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: CustomerView,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'about',
        name: 'about-us',
        component: AboutUsView
      },
      {
        path: 'services',
        name: 'services',
        component: ServiceView
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactView
      },
      {
        path: 'login',
        name: 'login',
        component: LoginView
      },
      {
        path: 'signup',
        name: 'signup',
        component: RegisterView
      },
      {
        path: ':catchAll(.*)',
        name: 'not-found',
        component: NotFoundView
      }
    ]
  },
  {
    path: '/customer',
    component: CustomerView,
    children: [
      {
        path: '',
        name: 'customer-home',
        component: HomeView
      },
      {
        path: 'jobs',
        name: 'customer-jobs',
        component: JobsView
      },
      {
        path: 'jobs/:id',
        name: 'customer-job-detail',
        component: JobDetailView,
        props: true
      },
      {
        path: 'profile/:id',
        name: 'customer-profile',
        component: ProfileView,
        props: true
      },
      {
        path: 'companies',
        name: 'customer-companies',
        component: CompanyView
      },
      {
        path: 'companies/:id',
        name: 'customer-company-detail',
        component: CompanyDetailView,
        props: true
      }
    ]
  },
  {
    path: '/recruiter',
    component: RecruiterView,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: RecruiterDashboard
      },
      {
        path: 'dashboard',
        name: 'dashboards',
        component: RecruiterDashboard
      },
      {
        path: 'post-job',
        name: 'recruiter-post-job',
        component: PostJobView
      },
      {
        path: 'jobs',
        name: 'manage-jobs',
        component: RecruiterJobs
      },
      {
        path: 'request-quote',
        name: 'pricing',
        component: PricingView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        nextTick(() => {
          resolve(savedPosition)
        })
      })
    } else {
      return { top: 0 }
    }
  }
})

export default router
