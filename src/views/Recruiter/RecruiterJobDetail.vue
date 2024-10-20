<template>
  <div class="container mx-auto p-6">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="px-4 py-2 mb-4 bg-gray-200 text-gray-600 rounded-lg flex items-center"
    >
      <i class="pi pi-arrow-left mr-2"></i>
      Back
    </button>
    <h2 class="text-xl font-semibold mb-4">Candidates</h2>

    <!-- Applications Section -->
    <div class="bg-white shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Candidate Name
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
              Application Date
            </th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(application, index) in paginatedApplications"
            :key="application.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-4 px-6 text-sm text-gray-700">{{ application.user.fullName }}</td>
            <td class="py-4 px-6 text-sm text-gray-700">{{ formatDate(application.createdAt) }}</td>
            <td class="py-4 px-6 text-sm text-gray-700">{{ application.status }}</td>
            <td class="py-4 px-6 text-sm text-gray-700">
              <div
                class="flex items-center space-x-1 cursor-pointer"
                @click="downloadCV(application.id)"
              >
                <i class="pi pi-download text-gray-500 hover:text-gray-700"></i>
                <span class="text-sm text-gray-500 hover:text-gray-700">Download CV</span>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedApplications.length === 0">
            <td colspan="4" class="py-4 px-6 text-center text-gray-500">No candidates found.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-center mt-6">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="pi pi-angle-left"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex mx-2 space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          :class="[
            'px-3 py-2 rounded-full',
            currentPage === page ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          ]"
          class="px-4 py-2 text-gray-700 rounded hover:bg-gray-400"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="pi pi-angle-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Mock data for testing
const jobApplications = ref([
  {
    id: 1,
    createdAt: '2024-10-10T14:30:00Z',
    status: 'IN_PROGRESS',
    user: { fullName: 'John Doe' }
  },
  {
    id: 2,
    createdAt: '2024-10-12T09:20:00Z',
    status: 'APPROVED',
    user: { fullName: 'Jane Smith' }
  },
  {
    id: 3,
    createdAt: '2024-10-15T11:45:00Z',
    status: 'REJECTED',
    user: { fullName: 'Sam Wilson' }
  },
  {
    id: 4,
    createdAt: '2024-10-16T11:45:00Z',
    status: 'IN_PROGRESS',
    user: { fullName: 'Chris Evans' }
  },
  {
    id: 5,
    createdAt: '2024-10-17T11:45:00Z',
    status: 'APPROVED',
    user: { fullName: 'Scarlett Johansson' }
  },
  {
    id: 6,
    createdAt: '2024-10-18T11:45:00Z',
    status: 'IN_PROGRESS',
    user: { fullName: 'Robert Downey' }
  }
])

// Pagination settings
const currentPage = ref(1)
const itemsPerPage = ref(2)

// Compute total pages based on number of job applications
const totalPages = computed(() => {
  return Math.ceil(jobApplications.value.length / itemsPerPage.value)
})

// Get paginated applications
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return jobApplications.value.slice(start, end)
})

// Functions to handle page navigation
function setPage(page) {
  currentPage.value = page
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Functions to handle button clicks
function downloadCV(applicationId) {
  console.log(`Downloading CV for application ID: ${applicationId}`)
  // Mock downloading CV
}

// Format date utility
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Back button functionality
function goBack() {
  router.back() // Điều hướng quay lại trang trước
}
</script>

<style scoped>
/* Pagination Button Styles */
.pagination-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f1f1f1;
  color: #4a4a4a;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.pagination-button:hover {
  background-color: #e1e1e1;
}

.pagination-active {
  background-color: #22c55e;
  color: white;
}

.pagination-inactive {
  background-color: #f1f1f1;
}
</style>
