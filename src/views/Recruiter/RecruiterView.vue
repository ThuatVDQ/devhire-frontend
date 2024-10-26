<!-- RecruiterView.vue -->
<script setup>
import { RouterView } from 'vue-router'
import RecruiterSidebar from '@/components/RecruiterSidebar.vue'
import RecruiterNavBar from '@/components/RecruiterNavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="recruiter-layout">
    <RecruiterNavBar />
    <div class="recruiter-body">
      <RecruiterSidebar />
      <div class="recruiter-content bg-gray-100">
        <RouterView />
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.recruiter-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.recruiter-body {
  display: flex;
  flex: 1;
}

.recruiter-content {
  flex: 1;
  height: 100%;
  padding: 20px;
}
</style>
