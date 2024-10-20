<template>
  <section class="dashboard-content">
    <h2 class="dashboard-title">Dashboard Overview</h2>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="dashboard-card">
        <h3 class="card-title">Total Jobs Posted</h3>
        <p class="card-number">{{ totalJobsPosted }}</p>
      </div>
      <div class="dashboard-card">
        <h3 class="card-title">Total Applications</h3>
        <p class="card-number">{{ totalApplications }}</p>
      </div>
      <div class="dashboard-card">
        <h3 class="card-title">Jobs Pending Approval</h3>
        <p class="card-number">{{ jobsPendingApproval }}</p>
      </div>
    </div>

    <!-- Charts or reports -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="dashboard-chart">
        <h3 class="chart-title">Applications per Job</h3>
        <!-- Placeholder for chart, replace with a chart library like Chart.js -->
        <div class="chart-placeholder">[Chart]</div>
      </div>
      <div class="dashboard-chart">
        <h3 class="chart-title">Monthly Applications</h3>
        <div class="chart-placeholder">[Chart]</div>
      </div>
    </div>

    <div class="latest-jobs">
      <h3 class="latest-title">Latest Job Posts</h3>
      <ul class="job-list">
        <li v-for="job in latestJobPosts" :key="job.id" class="job-item">
          <h4>{{ job.title }}</h4>
          <p>{{ job.datePosted }}</p>
          <router-link :to="'/recruiter/jobs/' + job.id" class="job-link">View Details</router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State for summary cards
const totalJobsPosted = ref(0)
const totalApplications = ref(0)
const jobsPendingApproval = ref(0)

// State for latest job posts
const latestJobPosts = ref([])

// Fetch data from API when the component is mounted
onMounted(async () => {
  await fetchDashboardData()
  await fetchLatestJobPosts()
})

async function fetchDashboardData() {
  try {
    const response = await axios.get('http://localhost:8000/dashboard/summary')
    const { jobsPosted, applications, pendingJobs } = response.data
    totalJobsPosted.value = jobsPosted
    totalApplications.value = applications
    jobsPendingApproval.value = pendingJobs
  } catch (error) {
    console.error('Error fetching dashboard summary data:', error)
  }
}

async function fetchLatestJobPosts() {
  try {
    const response = await axios.get('http://localhost:8000/jobs/latest')
    latestJobPosts.value = response.data
  } catch (error) {
    console.error('Error fetching latest job posts:', error)
  }
}
</script>

<style scoped>
.dashboard-content {
  padding: 20px;
  background-color: #f5f7fa;
  flex: 1;
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.card-title {
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
}

.card-number {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
}

.dashboard-chart {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
}

.chart-placeholder {
  height: 200px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: #888;
  font-size: 14px;
}

.latest-jobs {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.latest-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.job-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.job-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.job-item h4 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
}

.job-item p {
  margin: 0;
  font-size: 12px;
  color: #777;
}

.job-link {
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
}

.job-link:hover {
  text-decoration: underline;
}
</style>
