<template>
  <header class="">
    <h1 class="text-3xl font-semibold text-white bg-blue-700 px-11 py-10">Dashboard</h1>
  </header>
  <section class="p-11 bg-gray-100 min-h-screen">
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
        <h3 class="text-lg font-semibold mb-4">Applications Per Job</h3>
        <BarChart :chartData="applicationsPerJobData" :options="chartOptions" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Monthly Applications</h3>
        <BarChart :chartData="monthlyApplicationsData" :options="chartOptions" />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-gray-800 text-xl font-semibold mb-4">Latest Job Posts</h3>
      <table class="min-w-full table-auto text-left">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b text-gray-600 text-sm font-semibold">Job Title</th>
            <th class="py-2 px-4 border-b text-gray-600 text-sm font-semibold">Status</th>
            <th class="py-2 px-4 border-b text-gray-600 text-sm font-semibold">Deadline</th>
            <th class="py-2 px-4 border-b text-gray-600 text-sm font-semibold">Slots</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in latestJobPosts" :key="job.id">
            <td class="py-2 px-4 border-b">
              <!-- Giữ lại RouterLink để điều hướng tới chi tiết công việc -->
              <router-link :to="'/recruiter/edit-job/' + job.id">
                {{ job.title }}
              </router-link>
            </td>
            <td class="py-2 px-4 border-b">{{ job.status }}</td>
            <td class="py-2 px-4 border-b">{{ formatDate(job.deadline) }}</td>
            <td class="py-2 px-4 border-b">{{ job.slots }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BarChart from '@/components/BarChart.vue'

// Define reactive variables
const totalJobsPosted = ref(0)
const totalApplications = ref(0)
const jobsPendingApproval = ref(0)
const latestJobPosts = ref([])

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options)
}

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

// Hàm để lấy số liệu ứng tuyển theo công việc từ API
async function fetchApplicationsPerJob() {
  try {
    const response = await axios.get('http://localhost:8090/api/job-application/count-per-job', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const jobData = response.data
    console.log(jobData)

    // Khởi tạo mảng labels (tên công việc) và data (số lượng ứng tuyển)
    const labels = jobData.map((job) => job.jobTitle) // Giả sử API trả về mảng công việc với `title`
    const data = jobData.map((job) => job.count) // Giả sử API trả về mảng số lượng ứng tuyển

    // Cập nhật lại dữ liệu cho biểu đồ
    applicationsPerJobData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Applications',
          backgroundColor: '#4CAF50',
          data: data
        }
      ]
    }
  } catch (error) {
    console.error('Error fetching applications per job data:', error)
  }
}

// Hàm lấy số liệu ứng tuyển theo tháng từ API
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
      data[monthIndex] = item.count // Gán giá trị từ API
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

// Hàm lấy tổng số công việc đã đăng
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

// Hàm lấy tổng số công việc đang chờ phê duyệt
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

// Hàm lấy tổng số ứng tuyển
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

async function fetchLatestJobs() {
  try {
    const response = await axios.get('http://localhost:8090/api/jobs/latest', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    latestJobPosts.value = response.data
  } catch (error) {
    console.error('Error fetching latest jobs:', error)
  }
}

// Fetch data on mounted
onMounted(async () => {
  await fetchTotalJobsPosted()
  await fetchJobsPendingApproval()
  await fetchTotalApplications()
  await fetchMonthlyApplications()
  await fetchApplicationsPerJob()
  await fetchLatestJobs()
})

// Cập nhật chartOptions
const chartOptions = computed(() => {
  const numOfDataPoints = applicationsPerJobData.value.labels.length
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true
        },
        barPercentage: numOfDataPoints <= 5 ? 0.9 : numOfDataPoints <= 10 ? 0.7 : 0.5,
        categoryPercentage: numOfDataPoints <= 5 ? 1 : numOfDataPoints <= 10 ? 0.8 : 0.6
      },
      y: {
        beginAtZero: true
      }
    }
  }
})
</script>
