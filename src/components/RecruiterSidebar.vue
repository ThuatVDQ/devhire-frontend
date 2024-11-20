<template>
  <div class="relative h-full">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed bg-gray-800 text-gray-100 transition-all duration-300 h-full z-10',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Header Sidebar -->
      <div class="flex items-center py-4 px-4 bg-gray-900">
        <img
          src="@/assets/logo.svg"
          alt="Logo"
          class="transition-all duration-300"
          :class="isCollapsed ? 'w-8 h-8' : 'w-12 h-12'"
        />
        <span
          class="text-xl font-semibold ml-3 transition-opacity duration-300"
          v-if="!isCollapsed"
        >
          DevHire
        </span>
        <!-- Nút Toggle -->
        <button @click="toggleSidebar" class="ml-auto focus:outline-none text-gray-100 text-xl">
          <i :class="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
        </button>
      </div>

      <!-- Search Box -->
      <div class="relative mt-4 px-4" v-if="!isCollapsed">
        <div class="relative text-gray-600 focus-within:text-gray-400">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <i class="pi pi-search text-gray-500"></i>
          </span>
          <input
            type="search"
            class="py-2 text-sm text-white bg-gray-700 rounded-md pl-10 focus:outline-none w-full"
            placeholder="Search..."
          />
        </div>
      </div>

      <!-- Navigation Links -->
      <ul class="list-none p-0 m-0 mt-4">
        <li v-for="item in menuItems" :key="item.name" class="mb-2">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg transition duration-200 hover:bg-gray-700"
            active-class="bg-gray-700"
          >
            <i :class="item.icon" class="text-lg"></i>
            <span class="ml-4 transition-opacity duration-300" v-if="!isCollapsed">
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
      menuItems: [
        { name: 'Dashboard', path: '/recruiter/dashboard', icon: 'pi pi-th-large' },
        { name: 'Post Job', path: '/recruiter/post-job', icon: 'pi pi-plus' },
        { name: 'Jobs', path: '/recruiter/jobs', icon: 'pi pi-briefcase' },
        { name: 'Settings', path: '/recruiter/settings/profile', icon: 'pi pi-cog' },
        { name: 'Notifications', path: '/recruiter/notifications', icon: 'pi pi-bell' }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>
