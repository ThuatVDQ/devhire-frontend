<script setup>
import { reactive, ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import defaultAvatar from '../assets/avatar-default.svg'

const data = reactive({
  user: {}
})
const isLoggedIn = ref(false)
const avatarUrl = ref('')
if (localStorage.getItem('token')) {
  isLoggedIn.value = true
}

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const isProfileMenuOpen = ref(false)

const showProfileMenu = () => {
  isProfileMenuOpen.value = true
}

const hideProfileMenu = () => {
  isProfileMenuOpen.value = false
}

const isActiveLink = (routePath) => {
  const route = useRoute()
  return routePath === route.path
}

const router = useRouter()

const fetchUserProfile = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    data.user = response.data
    // Gán avatar URL
    if (response.data.avatar_url) {
      avatarUrl.value = `http://localhost:8090/uploads/${response.data.avatar_url}`
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/login')
}

// Gọi hàm để lấy thông tin người dùng khi component được mounted
onMounted(() => {
  if (isLoggedIn.value) {
    fetchUserProfile()
  }
})
</script>

<template>
  <header class="bg-white shadow-lg">
    <nav class="container py-4 flex justify-between items-center mx-0">
      <RouterLink to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="DevHire Logo" class="w-12 h-12" />
        <h1 class="ml-2 text-2xl font-bold text-green-600">DevHire</h1>
      </RouterLink>

      <ul class="hidden md:flex space-x-6 text-gray-600">
        <li class="relative group">
          <RouterLink
            to="/jobs"
            :class="[isActiveLink('/jobs') ? 'text-green-600' : 'hover:text-green-600']"
            class="inline-flex items-center"
          >
            Jobs
          </RouterLink>
          <div class="absolute inset-x-0 top-full h-2"></div>
          <!-- Dropdown Menu for Jobs -->
          <ul
            class="absolute top-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 p-3"
            style="left: 20%; transform: translateX(-20%); width: 400px"
          >
            <li
              class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <RouterLink to="/jobs" class="flex items-center w-full">
                <i class="pi pi-search text-green-600 mr-6"></i>
                <span class="text-gray-700 dark:text-gray-300">Search Jobs</span>
              </RouterLink>
            </li>
            <li
              class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <RouterLink to="/applied-jobs" class="flex items-center w-full">
                <i class="pi pi-briefcase text-green-600 mr-6"></i>
                <span class="text-gray-700 dark:text-gray-300">Applied Jobs </span>
              </RouterLink>
            </li>
            <li
              class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <RouterLink to="/favorite-jobs" class="flex items-center w-full">
                <i class="pi pi-heart text-green-600 mr-6"></i>
                <span class="text-gray-700 dark:text-gray-300">Favorite Jobs</span>
              </RouterLink>
            </li>
          </ul>
        </li>

        <li>
          <RouterLink
            to="/companies"
            :class="[isActiveLink('/companies') ? 'text-green-600' : 'hover:text-green-600']"
            >Companies</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/about"
            :class="[isActiveLink('/about-us') ? 'text-green-600' : 'hover:text-green-600']"
            >About Us</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            :class="[isActiveLink('/contact') ? 'text-green-600' : 'hover:text-green-600']"
            >Contact</RouterLink
          >
        </li>
      </ul>

      <div class="hidden md:flex items-center space-x-4 relative">
        <div v-if="isLoggedIn" class="flex items-center space-x-4 relative">
          <button class="relative">
            <i class="pi pi-bell text-gray-600 text-2xl"></i>
            <span
              class="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"
            ></span>
          </button>

          <div
            class="relative flex items-center"
            @mouseenter="showProfileMenu"
            @mouseleave="hideProfileMenu"
          >
            <div class="flex items-center space-x-2">
              <img
                :src="avatarUrl"
                @error="avatarUrl = defaultAvatar"
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover"
              />
              <i
                :class="isProfileMenuOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                class="text-gray-600"
              ></i>
            </div>

            <div
              v-show="isProfileMenuOpen"
              class="absolute right-0 bg-white border border-gray-200 shadow-lg rounded-lg z-50 profile-dropdown p-4"
              @mouseenter="showProfileMenu"
              @mouseleave="hideProfileMenu"
            >
              <div
                class="absolute top-[-1rem] right-0 w-full h-[1rem]"
                @mouseenter="showProfileMenu"
              ></div>

              <div class="px-3 pb-4 border-b border-gray-200 flex items-center">
                <img
                  :src="avatarUrl"
                  @error="avatarUrl = defaultAvatar"
                  alt="Profile"
                  class="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 class="text-green-600 font-semibold">{{ data.user.full_name }}</h4>
                  <p class="text-gray-500 text-sm">{{ data.user.email }}</p>
                </div>
              </div>

              <RouterLink
                to="/settings"
                class="px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <i class="pi pi-cog mr-5"></i>
                Settings
              </RouterLink>
              <RouterLink
                to="/change-password"
                class="px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <i class="pi pi-lock mr-5"></i>
                Change Password
              </RouterLink>
              <button
                @click="logout"
                class="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center hover:text-red-500"
              >
                <i class="pi pi-sign-out mr-5"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div v-else class="gap-4 flex">
          <RouterLink
            to="/login"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/signup"
            class="px-4 py-2 bg-gray-300 text-black-700 rounded hover:bg-gray-200"
          >
            Sign Up
          </RouterLink>
          <RouterLink
            to="/recruiter/login"
            class="px-4 py-2 bg-black text-white rounded hover:bg-black-600"
          >
            Recruiter & Find CV
          </RouterLink>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="isMenuOpen" class="md:hidden bg-white shadow-lg">
      <ul class="flex flex-col space-y-4 p-4 text-gray-600">
        <li>
          <RouterLink
            to="/jobs"
            :class="[isActiveLink('/jobs') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Jobs</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/companies"
            :class="[isActiveLink('/companies') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Companies</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/about"
            :class="[isActiveLink('/about-us') ? 'text-blue-500' : 'hover:text-blue-500']"
            >About Us</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            :class="[isActiveLink('/contact') ? 'text-blue-500' : 'hover:text-blue-500']"
            >Contact</RouterLink
          >
        </li>

        <div class="flex space-x-4">
          <div v-if="isLoggedIn">
            <RouterLink
              to="/profile"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Profile
            </RouterLink>
            <button
              @click="logout"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
            >
              Logout
            </button>
          </div>
          <div v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full"
            >
              Sign Up
            </RouterLink>
          </div>
        </div>
      </ul>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: #f8f9fa;
}

.pi.pi-bell {
  font-size: 1.5rem;
}

.pi.pi-chevron-up,
.pi.pi-chevron-down {
  font-size: 1rem;
}

.profile-dropdown {
  right: 0;
  top: 110%;
  width: max-content;
  z-index: 50;
  width: 300px;
}
</style>
