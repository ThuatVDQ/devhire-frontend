import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import JobsView from '@/views/JobsView.vue'
import JobDetailView from '@/views/JobDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ApplyJob from '@/views/ApplyJob.vue'
import ProfileView from '@/views/ProfileView.vue'
import CompanyView from '@/views/CompanyView.vue'
import CompanyDetailView from '@/views/CompanyDetailView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import ServiceView from '@/views/ServiceView.vue'
import PricingView from '@/views/PricingView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: JobDetailView
    },
    {
      path: '/jobs/apply-jobs',
      name: 'apply-jobs',
      component: ApplyJob
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegisterView
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompanyView
    },
    {
      path: '/companies/:id',
      name: 'company-detail',
      component: CompanyDetailView
    },
    {
      path: '/about',
      name: 'about-us',
      component: AboutUsView
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceView
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Đảm bảo DOM được cập nhật trước khi cuộn lại vị trí cũ
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
