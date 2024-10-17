<template>
  <div class="sidebar">
    <ul class="menu">
      <li v-for="item in menuItems" :key="item.name" class="menu-item">
        <router-link
          :to="item.path"
          class="menu-link"
          @mouseover="hoveredItem = item.name"
          @mouseleave="hoveredItem = null"
        >
          <div
            class="icon-wrapper"
            :style="{ backgroundColor: hoveredItem === item.name ? '#e0f7fa' : 'transparent' }"
          >
            <i :class="item.icon" class="menu-icon"></i>
          </div>
          <span class="menu-label" v-if="hoveredItem === item.name">
            {{ item.name }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hoveredItem: null,
      menuItems: [
        { name: 'Dashboard', path: '/recruiter/dashboard', icon: 'pi pi-th-large' },
        { name: 'Post Job', path: '/recruiter/post-job', icon: 'pi pi-plus' },
        { name: 'Jobs', path: '/recruiter/jobs', icon: 'pi pi-briefcase' },
        { name: 'Settings', path: '/recruiter/settings', icon: 'pi pi-cog' },
        { name: 'Notifications', path: '/recruiter/notifications', icon: 'pi pi-bell' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 80px;
  background: #ffffff;
  height: 100%;
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-item {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.menu-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition:
    background-color 0.3s,
    color 0.3s;
  width: 100%;
  padding: 10px 0;
  position: relative;
  font-family: 'Arial', sans-serif;
}

.icon-wrapper {
  border-radius: 50%;
  padding: 8px;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-icon {
  font-size: 24px;
  color: #333;
}

.menu-label {
  font-size: 12px;
  margin-top: 5px;
  display: block;
  font-family: 'Arial', sans-serif;
}
</style>
