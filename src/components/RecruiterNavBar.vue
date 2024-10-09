<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo"><span class="logo-text">DevHire</span> for Business</div>
    </div>
    <div class="navbar-center">
      <router-link to="/recruiter/post-job" class="nav-item">
        <i class="pi pi-plus"></i> Post Job
      </router-link>
      <router-link to="/recruiter/find-cv" class="nav-item">
        <i class="pi pi-search"></i> Search CV
      </router-link>
      <router-link to="/recruiter/connect" class="nav-item">
        <i class="pi pi-comments"></i> Connect
      </router-link>
      <router-link to="/recruiter/help" class="nav-item">
        <i class="pi pi-question-circle"></i> Help
      </router-link>
    </div>
    <div class="navbar-right">
      <router-link to="/recruiter/notifications" class="notification-button">
        <i class="pi pi-bell"></i>
      </router-link>
      <button class="btn-primary" @click="redirectToQuote">
        <i class="pi pi-pencil"></i> Request a Quote
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'RecruiterNavbar',
  methods: {
    redirectToQuote() {
      this.$router.push('/recruiter/request-quote')
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #1c2b3a;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.logo-text {
  color: #00bcd4; /* Màu của thương hiệu, có thể tùy chỉnh */
}

.navbar-center {
  display: flex;
  gap: 15px;
}

.nav-item {
  text-decoration: none;
  color: #ffffff;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 16px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-item:hover {
  background-color: #00bcd4;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-button {
  position: relative;
  color: #ffffff;
  font-size: 18px;
  text-decoration: none;
}

.btn-primary {
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #388e3c;
}
</style>
