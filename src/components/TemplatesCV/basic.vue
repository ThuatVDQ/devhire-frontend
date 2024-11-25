<template>
  <div class="bg-gray-50 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-6 border-b pb-4">
      <div class="w-28 h-28 rounded-full bg-gray-300 flex-shrink-0"></div>
      <div>
        <h1 class="text-3xl font-bold text-green-600">{{ data.personal_info.name }}</h1>
        <h2 class="text-xl font-semibold text-gray-700">{{ data.personal_info.job_title }}</h2>
        <p class="text-gray-600 mt-2">{{ data.personal_info.summary }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-3 gap-6 mt-6">
      <!-- Left Section -->
      <div class="col-span-2">
        <!-- Education -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">Học vấn</h3>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="edu in data.education" :key="edu.school" class="mb-4">
              <h4 class="text-gray-800 font-semibold">{{ edu.school }}</h4>
              <p class="text-gray-600">{{ edu.major }} ({{ edu.year }})</p>
              <p class="text-sm text-gray-500">{{ edu.grade }}</p>
            </div>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">
            Kinh nghiệm làm việc
          </h3>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="exp in data.work_experience" :key="exp.company" class="mb-6">
              <h4 class="text-gray-800 font-semibold">{{ exp.company }}</h4>
              <p class="text-sm text-gray-500">{{ exp.title }} ({{ exp.duration }})</p>
              <ul class="list-disc list-inside mt-2 text-gray-700">
                <li v-for="detail in exp.details" :key="detail">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div>
        <!-- Personal Information -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-green-600">Thông tin cá nhân</h3>
          <ul class="mt-2 space-y-2">
            <li class="flex items-center">
              <span class="material-icons text-green-600 mr-2">email</span>
              {{ data.personal_info.contact.email }}
            </li>
            <li class="flex items-center">
              <span class="material-icons text-green-600 mr-2">phone</span>
              {{ data.personal_info.contact.phone }}
            </li>
            <li class="flex items-center">
              <span class="material-icons text-green-600 mr-2">language</span>
              <a :href="data.personal_info.contact.website" class="text-blue-500 hover:underline">
                {{ data.personal_info.contact.website }}
              </a>
            </li>
            <li class="flex items-center">
              <span class="material-icons text-green-600 mr-2">location_on</span>
              {{ data.personal_info.contact.address }}
            </li>
          </ul>
        </div>

        <!-- Skills -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-green-600">Các kỹ năng</h3>
          <ul class="mt-2 space-y-1">
            <li
              v-for="skill in data.skills"
              :key="skill"
              class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm inline-block"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const data = {
  personal_info: {
    name: 'Nguyễn Văn B',
    job_title: 'Nhân viên marketing',
    summary: 'Nhân viên marketing với 5 năm kinh nghiệm trong ngành quảng cáo...',
    contact: {
      email: 'example@gmail.com',
      phone: '0123 456 789',
      website: 'https://portfolio.com',
      address: 'Quận B, Hồ Chí Minh'
    }
  },
  education: [
    {
      school: 'Đại học Kinh tế TP.HCM',
      major: 'Marketing',
      year: '2015 - 2019',
      grade: 'Tốt nghiệp loại Giỏi'
    }
  ],
  work_experience: [
    {
      company: 'Công ty XYZ',
      title: 'Nhân viên marketing',
      duration: '01/2020 - Nay',
      details: [
        'Xây dựng chiến lược marketing cho sản phẩm mới...',
        'Quản lý ngân sách quảng cáo đạt hiệu quả tối đa...'
      ]
    }
  ],
  skills: ['Quản lý dự án', 'SEO', 'Kỹ năng giao tiếp', 'Social Media Marketing']
}
</script>
