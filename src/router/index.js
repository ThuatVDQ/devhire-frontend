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
import AboutUsView from '@/views/AboutUsView.vue'

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
      path: '/about-us',
      name: 'about-us',
      component: AboutUsView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      //đảm bảo DOM được cập nhật trước khi cuộn lại vị trí cũ
      nextTick(() => {
        resolve(savedPosition)
      })
    } else {
      resolve({ top: 0 })
    }
  }
})

export default router
