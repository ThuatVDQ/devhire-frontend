import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import JobsView from '@/views/JobsView.vue'
import JobDetailView from '@/views/JobDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PostJobView from '@/views/Recruiter/PostJobView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CompanyView from '@/views/CompanyView.vue'
import CompanyDetailView from '@/views/CompanyDetailView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import ServiceView from '@/views/ServiceView.vue'
import PricingView from '@/views/PricingView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RecruiterView from '@/views/Recruiter/RecruiterView.vue'
import CandidateView from '@/views/CandidateView.vue'
import RecruiterDashboard from '@/views/Recruiter/RecruiterDashboard.vue'
import RecruiterJobs from '@/views/Recruiter/RecruiterJobs.vue'
import RecruiterJobDetail from '@/views/Recruiter/RecruiterJobDetail.vue'
import RecruiterSetting from '@/views/Recruiter/RecruiterSetting.vue'
import RecruiterChangePassword from '@/views/Recruiter/RecruiterChangePassword.vue'
import RecruiterProfile from '@/views/Recruiter/RecruiterProfile.vue'
import RecruiterEditCompany from '@/views/Recruiter/RecruiterEditCompany.vue'
import ApplyForm from '@/components/ApplyForm.vue'
import RecruiterLogin from '@/views/Recruiter/RecruiterLogin.vue'
import RecruiterRegister from '@/views/Recruiter/RecruiterRegister.vue'
import FavoriteJobsView from '@/views/FavoriteJobsView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import AppliedJobsView from '@/views/AppliedJobsView.vue'
import AdminView from '@/views/Admin/AdminView.vue'
import DashBoard from '@/views/Admin/DashBoard.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'
import JobManagement from '@/views/Admin/JobManagement.vue'
import JobDetail from '@/views/Admin/JobDetail.vue'
import EditJob from '@/views/Recruiter/EditJob.vue'
import Login from '@/views/Admin/Login.vue'
import CompaniesManagement from '@/views/Admin/CompaniesManagement.vue'
import Notifications from '@/views/Admin/Notifications.vue'
import RecruiterNotifications from '@/views/Recruiter/RecruiterNotifications.vue'
import CompanyDetail from '@/views/Admin/CompanyDetail.vue'
import CreateCVView from '@/views/CreateCVView.vue'
import LoginWithGoogle from '@/components/LoginWithGoogle.vue'
import CategoriesManagement from '@/views/Admin/CategoriesManagement.vue'
import SubscriptionsManagement from '@/views/Admin/SubscriptionsManagement.vue'
import PaymentResultView from '@/views/Recruiter/PaymentResultView.vue'
import RecruiterInterviews from '@/views/Recruiter/RecruiterInterviews.vue'
import JobsBySkill from '@/views/JobsBySkill.vue'
import JobsByTitle from '@/views/JobsByTitle.vue'
import CandidateSearch from '@/views/Recruiter/CandidateSearch.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: CandidateView,
    meta: {
      title: 'DevHire - Top IT jobs for you'
    },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'settings',
        name: 'candidate-ettings',
        component: ProfileView
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: JobsView
      },
      {
        path: 'jobs/:id',
        name: 'job-detail',
        component: JobDetailView,
        props: true
      },
      {
        path: 'favorite-jobs',
        name: 'favorite-jobs',
        component: FavoriteJobsView
      },
      {
        path: 'applied-jobs',
        name: 'applied-jobs',
        component: AppliedJobsView
      },
      {
        path: 'companies',
        name: 'companies',
        component: CompanyView
      },
      {
        path: 'companies/:id',
        name: 'company-detail',
        component: CompanyDetailView,
        props: true
      },
      {
        path: '/template-cv',
        name: 'template-cv',
        component: CreateCVView
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
        path: 'change-password',
        name: 'change-password',
        component: ChangePasswordView
      },
      {
        path: 'signup',
        name: 'signup',
        component: RegisterView
      },
      {
        path: 'job-skill-index',
        name: 'job-skill-index',
        component: JobsBySkill
      },
      {
        path: 'job-title-index',
        name: 'job-title-index',
        component: JobsByTitle
      }
    ]
  },
  {
    path: '/recruiter',
    component: RecruiterView,
    meta: {
      title: 'Hire the best IT professionals in Việt Nam with DevHire'
    },
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
        path: 'notifications',
        name: 'manage-notifications',
        component: RecruiterNotifications
      },
      {
        path: 'job-detail/:id',
        name: 'recruiter-job-detail',
        component: RecruiterJobDetail
      },
      {
        path: 'edit-job/:id',
        name: 'recruiter-edit-job',
        component: EditJob
      },
      {
        path: 'candidates',
        name: 'recruiter-candidate-search',
        component: CandidateSearch
      },
      {
        path: 'settings',
        name: 'recruiter-settings',
        component: RecruiterSetting,
        children: [
          {
            path: 'change-password',
            name: 'recruiter-change-password',
            component: RecruiterChangePassword
          },
          {
            path: 'profile',
            name: 'recruiter-profile',
            component: RecruiterProfile
          },
          {
            path: 'company',
            name: 'recruiter-company',
            component: RecruiterEditCompany
          }
        ]
      },
      {
        path: 'about',
        name: 'recruiter-about',
        component: AboutUsView
      },
      {
        path: 'contact',
        name: 'recruiter-contact',
        component: ContactView
      },
      {
        path: 'upgrade',
        name: 'recruiter-upgrade',
        component: PricingView
      },
      {
        path: 'interviews',
        name: 'recruiter-interviews',
        component: RecruiterInterviews
      }
    ]
  },
  {
    path: '/upgrade-result',
    name: 'recruiter-upgrade-result',
    component: PaymentResultView
  },
  {
    path: '/recruiter/login',
    name: 'recruiter-login',
    component: RecruiterLogin,
    meta: {
      title: 'Login for Recruiter'
    }
  },
  {
    path: '/recruiter/signup',
    name: 'recruiter-signup',
    component: RecruiterRegister,
    meta: {
      title: 'Sign-up for Recruiter'
    }
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: Login,
    meta: {
      title: 'Login for Admin'
    }
  },
  {
    path: '/admin',
    component: AdminView,
    meta: {
      title: 'Admin - DevHire'
    },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: DashBoard
      },
      {
        path: 'users',
        name: 'admin-users-management',
        component: UserManagement
      },
      {
        path: 'companies',
        name: 'admin-companies-management',
        component: CompaniesManagement
      },
      {
        path: 'companies/:id',
        name: 'admin-companies-detail',
        component: CompanyDetail
      },
      {
        path: 'jobs',
        name: 'admin-jobs-management',
        component: JobManagement
      },
      {
        path: 'notifications',
        name: 'admin-notifications-management',
        component: Notifications
      },
      {
        path: 'job/:id',
        name: 'admin-detail-job',
        component: JobDetail
      },
      {
        path: 'categories',
        name: 'admin-categories-management',
        component: CategoriesManagement
      },
      {
        path: 'subscriptions',
        name: 'admin-subscriptions-management',
        component: SubscriptionsManagement
      }
    ]
  },
  {
    path: '/auth/callback',
    name: 'loginCallback',
    component: LoginWithGoogle
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

router.beforeEach((to, from, next) => {
  // Cập nhật title nếu có meta.title trong route
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
