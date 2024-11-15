<template>
  <section class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <h3 class="text-gray-600 text-lg font-medium mb-2">Total Jobs Posted</h3>
        <p class="text-4xl font-bold text-blue-500">{{ totalJobsPosted }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <h3 class="text-gray-600 text-lg font-medium mb-2">Total Applications</h3>
        <p class="text-4xl font-bold text-blue-500">{{ totalApplications }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <h3 class="text-gray-600 text-lg font-medium mb-2">Jobs Pending Approval</h3>
        <p class="text-4xl font-bold text-blue-500">{{ jobsPendingApproval }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Monthly Applications</h3>
        <BarChart :chartData="monthlyApplicationsData" />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-gray-800 text-lg font-semibold mb-4">Latest Job Posts</h3>
      <ul class="divide-y divide-gray-200">
        <li v-for="job in latestJobPosts" :key="job.id" class="py-4">
          <div class="flex justify-between items-center">
            <!-- Đặt RouterLink quanh tiêu đề công việc -->
            <router-link
              :to="'/recruiter/jobs/' + job.id"
              class="text-blue-500 font-bold text-sm hover:underline"
            >
              {{ job.title }}
            </router-link>
            <p class="text-gray-500 text-xs">{{ job.datePosted }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BarChart from '@/components/BarChart.vue'

// Define reactive variables
const totalJobsPosted = ref(0)
const totalApplications = ref(0)
const jobsPendingApproval = ref(0)
const latestJobPosts = ref([])

const applicationsPerJobData = ref({
  labels: [],
  datasets: [
    {
      label: 'Applications',
      backgroundColor: '#4CAF50',
      data: []
    }
  ]
})

// Hàm để gán dữ liệu mẫu vào applicationsPerJobData
function setDummyApplicationsPerJobData() {
  const dummyLabels = ['Job 1', 'Job 2', 'Job 3', 'Job 4']
  const dummyData = [12, 19, 3, 5]

  // Sử dụng Object.assign để thay thế toàn bộ đối tượng để Vue nhận diện thay đổi
  applicationsPerJobData.value = {
    labels: dummyLabels,
    datasets: [
      {
        label: 'Applications',
        backgroundColor: '#4CAF50',
        data: dummyData
      }
    ]
  }

  console.log('Applications Per Job Data with Dummy Data:', applicationsPerJobData.value)
}

// Gọi hàm setDummyApplicationsPerJobData khi component được mounted
onMounted(setDummyApplicationsPerJobData)

const monthlyApplicationsData = ref({
  labels: [],
  datasets: [
    {
      label: 'Applications',
      backgroundColor: '#2196F3',
      data: []
    }
  ]
})

// Define functions for fetching data
async function fetchTotalJobsPosted() {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/total-posted', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    totalJobsPosted.value = response.data
  } catch (error) {
    console.error('Error fetching total jobs posted:', error)
  }
}

async function fetchJobsPendingApproval() {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/total-pending', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    jobsPendingApproval.value = response.data
  } catch (error) {
    console.error('Error fetching jobs pending approval:', error)
  }
}

async function fetchTotalApplications() {
  try {
    const response = await axios.get('http://localhost:8090/api/job-application/total', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    totalApplications.value = response.data
  } catch (error) {
    console.error('Error fetching total applications:', error)
  }
}

async function fetchMonthlyApplications() {
  try {
    const response = await axios.get('http://localhost:8090/api/job-application/monthly-count', {
      params: { year: new Date().getFullYear() },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const monthlyData = response.data

    // Khởi tạo mảng labels cho 12 tháng
    const labels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    // Khởi tạo mảng data cho 12 tháng với giá trị mặc định là 0
    const data = new Array(12).fill(0)

    // Cập nhật data dựa trên dữ liệu từ API
    monthlyData.forEach((item) => {
      const monthIndex = item.month - 1 // Chuyển tháng sang chỉ số bắt đầu từ 0
      data[monthIndex] = item.application_count // Gán giá trị từ API
    })

    // Gán lại toàn bộ đối tượng `monthlyApplicationsData` để Vue nhận diện thay đổi
    monthlyApplicationsData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Applications',
          backgroundColor: '#2196F3',
          data: data
        }
      ]
    }
  } catch (error) {
    console.error('Error fetching monthly applications data:', error)
  }
}

// Fetch data on mounted
onMounted(async () => {
  await fetchTotalJobsPosted()
  await fetchJobsPendingApproval()
  await fetchTotalApplications()
  await fetchMonthlyApplications()
})
</script>
