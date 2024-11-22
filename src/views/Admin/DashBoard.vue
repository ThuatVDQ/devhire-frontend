<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BarChart from '@/components/BarChart.vue'

// State để lưu dữ liệu từ API
const dashboardData = ref(null)
const recentActivities = ref([])
const monthlyApplications = ref({
  labels: [],
  datasets: [
    {
      label: 'Applications',
      backgroundColor: '#2196F3',
      data: []
    }
  ]
})

const monthlyJobs = ref({
  labels: [],
  datasets: [
    {
      label: 'Applications',
      backgroundColor: '#2196F3',
      data: []
    }
  ]
})

// Gọi API khi component được mount
const fetchDashboardData = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/admin/dashboard', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    dashboardData.value = response.data
    console.log('Dashboard data:', response.data)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// const fetchRecentActivities = async () => {
//   try {
//     const response = await axios.get('/applicationsPerJob')
//     recentActivities.value = response.data
//   } catch (error) {
//     console.error('Error fetching recent activities:', error)
//   }
// }

const fetchMonthlyApplications = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8090/api/admin/monthlyApplications?year=2024',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
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
    monthlyApplications.value = {
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
    console.error('Error fetching monthly applications:', error)
  }
}

const fetchMonthlyJobs = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/admin/monthlyJobs?year=2024', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
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
    monthlyJobs.value = {
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
    console.error('Error fetching monthly applications:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  fetchMonthlyJobs()
  fetchMonthlyApplications()
})

const chartOptions = computed(() => {
  const numOfDataPoints = monthlyApplications.value.labels.length
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
<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">Dashboard</h1>
  </header>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->

    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Stat Card 1 -->
      <div class="bg-white p-4 rounded-lg shadow" v-if="dashboardData">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Users</h3>
          <i class="pi pi-users text-2xl text-blue-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">{{ dashboardData.users?.count }}</p>
        <p
          :class="['text-sm', dashboardData.users?.growth >= 0 ? 'text-green-500' : 'text-red-500']"
        >
          {{ dashboardData.users?.growth >= 0 ? '+' : '-' }}{{ dashboardData.users?.growth }}% from
          last month
        </p>
      </div>

      <!-- Stat Card 2 -->
      <div class="bg-white p-4 rounded-lg shadow" v-if="dashboardData">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Jobs</h3>
          <i class="pi pi-briefcase text-2xl text-green-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">{{ dashboardData.jobs?.count }}</p>
        <p
          :class="['text-sm', dashboardData.jobs?.growth >= 0 ? 'text-green-500' : 'text-red-500']"
        >
          {{ dashboardData.jobs?.growth >= 0 ? '+' : '-' }}{{ dashboardData.jobs?.growth }}% from
          last month
        </p>
      </div>

      <!-- Stat Card 3 -->
      <div class="bg-white p-4 rounded-lg shadow" v-if="dashboardData">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Companies</h3>
          <i class="pi pi-building text-2xl text-yellow-500"></i>
        </div>
        <p class="mt-2 text-3xl font-bold text-gray-800">{{ dashboardData.companies?.count }}</p>
        <p
          :class="[
            'text-sm',
            dashboardData.companies?.growth >= 0 ? 'text-green-500' : 'text-red-500'
          ]"
        >
          {{ dashboardData.companies?.growth >= 0 ? '+' : '-'
          }}{{ dashboardData.companies?.growth }}% from last month
        </p>
      </div>
    </section>

    <!-- Chart Section -->
    <section class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Monthly Overview</h2>
      <div class="">
        <!-- Placeholder for Chart -->
        <BarChart :chartData="monthlyApplications" :options="chartOptions" />
      </div>

      <div class="">
        <!-- Placeholder for Chart -->
        <BarChart :chartData="monthlyJobs" :options="chartOptions" />
      </div>
    </section>

    <!-- Table Section -->
    <section class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="text-gray-600 uppercase text-sm leading-normal bg-gray-100">
              <th class="py-3 px-6">User</th>
              <th class="py-3 px-6">Action</th>
              <th class="py-3 px-6">Date</th>
              <th class="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm">
            <tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td class="py-3 px-6">John Doe</td>
              <td class="py-3 px-6">Created a job post</td>
              <td class="py-3 px-6">2023-11-01</td>
              <td class="py-3 px-6">
                <span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs"
                  >Completed</span
                >
              </td>
            </tr>
            <tr class="border-b border-gray-200 bg-white hover:bg-gray-100">
              <td class="py-3 px-6">Jane Smith</td>
              <td class="py-3 px-6">Updated company info</td>
              <td class="py-3 px-6">2023-11-02</td>
              <td class="py-3 px-6">
                <span class="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs"
                  >Pending</span
                >
              </td>
            </tr>
            <tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td class="py-3 px-6">Mike Johnson</td>
              <td class="py-3 px-6">Applied for a job</td>
              <td class="py-3 px-6">2023-11-03</td>
              <td class="py-3 px-6">
                <span class="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs">Rejected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
