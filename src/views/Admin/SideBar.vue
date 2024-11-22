<template>
  <div>
    <!-- Toggle button, only visible when sidebar is collapsed -->
    <button
      v-if="isCollapsed"
      @click="toggleSidebar"
      class="fixed top-20 left-0 z-20 bg-white rounded-full p-2 shadow focus:outline-none"
    >
      <i class="pi pi-list text-lg"></i>
    </button>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed bg-gray-800 text-gray-100 transition-all duration-300 h-screen z-10',
        isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
      ]"
    >
      <div v-if="!isCollapsed" class="p-4">
        <!-- Close Button (inside the sidebar) -->
        <div class="flex items-center justify-between">
          <button @click="toggleSidebar" class="focus:outline-none">
            <i class="pi pi-times text-xl"></i>
          </button>
          <span class="text-xl font-semibold">DevHire</span>
        </div>

        <!-- Logo and Sidebar Title -->
        <div class="flex items-center mt-4">
          <img src="@/assets/logo.svg" alt="DevHire Logo" class="w-8 h-8 mr-3" />
          <span class="text-xl font-semibold">DevHire</span>
        </div>

        <!-- Search Box -->
        <div class="mt-4">
          <div class="relative text-gray-600 focus-within:text-gray-400">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <i class="pi pi-search text-gray-500"></i>
            </span>
            <input
              v-model="searchQuery"
              type="search"
              class="py-2 text-sm text-white bg-gray-700 rounded-md pl-10 focus:outline-none w-full"
              placeholder="Search..."
            />
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-6 space-y-2">
          <RouterLink
            v-for="item in filteredMenuItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center p-2 rounded transition duration-200 hover:bg-gray-700"
            active-class="bg-gray-700"
          >
            <i :class="item.icon" class="mr-3"></i>
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <main :class="isCollapsed ? 'ml-0' : 'ml-64'">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isCollapsed = ref(true)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const searchQuery = ref('') // Từ khóa tìm kiếm

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-home' },
  { name: 'Users', path: '/admin/users', icon: 'pi pi-users' },
  { name: 'Jobs', path: '/admin/jobs', icon: 'pi pi-briefcase' },
  { name: 'Companies', path: '/admin/companies', icon: 'pi pi-building' },
  { name: 'Settings', path: '/admin/settings', icon: 'pi pi-cog' }
]

// Lọc danh sách menu theo từ khóa tìm kiếm
const filteredMenuItems = computed(() => {
  if (!searchQuery.value.trim()) return menuItems
  return menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
