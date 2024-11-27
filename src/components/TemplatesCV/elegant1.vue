<template>
  <div ref="template" class="bg-white rounded-lg p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-6">
      <div class="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 relative">
        <!-- Display photo -->
        <img
          v-if="!isEdit"
          :src="profileImage || 'https://via.placeholder.com/150'"
          alt="Profile Image"
          class="w-24 h-24 object-cover rounded-full"
        />
        <div v-else>
          <img
            v-if="profileImage"
            :src="profileImage"
            alt="Profile Image"
            class="w-24 h-24 object-cover rounded-full mb-2"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      <div>
        <h1 v-if="!isEdit" class="text-2xl font-bold text-green-600">
          {{ data.personal_info.name }}
        </h1>
        <input
          v-else
          v-model="data.personal_info.name"
          class="text-2xl font-bold text-green-600 border rounded px-2 py-1 w-full"
        />
        <h2 v-if="!isEdit" class="text-lg font-semibold text-gray-600">
          {{ data.personal_info.job_title }}
        </h2>
        <input
          v-else
          v-model="data.personal_info.job_title"
          class="text-lg font-semibold text-gray-600 border rounded px-2 py-1 w-full mt-2"
        />
        <p v-if="!isEdit" class="text-gray-700 mt-2">{{ data.personal_info.summary }}</p>
        <textarea
          v-else
          v-model="data.personal_info.summary"
          class="text-gray-700 mt-2 border rounded px-2 py-1 w-full"
        ></textarea>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
      <ul class="space-y-1">
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">Email</span>
          <span v-if="!isEdit">{{ data.personal_info.contact.email }}</span>
          <input
            v-else
            v-model="data.personal_info.contact.email"
            class="border rounded px-2 py-1"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">Phone</span>
          <span v-if="!isEdit">{{ data.personal_info.contact.phone }}</span>
          <input
            v-else
            v-model="data.personal_info.contact.phone"
            class="border rounded px-2 py-1"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">Git</span>
          <a
            v-if="!isEdit"
            :href="data.personal_info.contact.git"
            class="text-blue-500 hover:underline"
          >
            {{ data.personal_info.contact.git }}
          </a>
          <input
            v-else
            v-model="data.personal_info.contact.git"
            class="border rounded px-2 py-1 w-full"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">Location</span>
          <span v-if="!isEdit">{{ data.personal_info.contact.address }}</span>
          <input
            v-else
            v-model="data.personal_info.contact.address"
            class="border rounded px-2 py-1"
          />
        </li>
      </ul>
    </div>

    <!-- Education -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <div class="flex">
        <h3 class="text-lg font-semibold text-gray-800">Education</h3>

        <button v-if="isEdit" @click="addEducation" class="text-blue-500 ml-2 hover:underline">
          <i class="pi pi-plus-circle"></i>
        </button>
      </div>
      <ul class="space-y-3">
        <li v-for="(edu, index) in data.education" :key="index" class="text-gray-700">
          <p>
            <strong v-if="!isEdit">{{ edu.school }}</strong>
            <input
              v-else
              v-model="edu.school"
              class="border rounded px-2 py-1 w-full font-bold mb-2"
              placeholder="School"
            />
            <span v-if="!isEdit"> - </span>
            <span v-if="!isEdit">{{ edu.major }}</span>
            <input
              v-else
              v-model="edu.major"
              class="border rounded px-2 py-1 w-full mb-2"
              placeholder="Major"
            />
          </p>
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ edu.year }}</p>
          <input
            v-else
            v-model="edu.year"
            class="text-sm text-gray-500 border rounded px-2 py-1 mr-2"
            placeholder="Year"
          />
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ edu.grade }}</p>
          <input
            v-else
            v-model="edu.grade"
            class="text-sm text-gray-500 border rounded px-2 py-1 mr-2"
            placeholder="Grade"
          />
          <button
            v-if="isEdit"
            @click="removeEducation(index)"
            class="text-red-500 text-sm mt-2 hover:underline"
          >
            <i class="pi pi-trash"></i>
          </button>
        </li>
      </ul>
    </div>

    <!-- Work Experience -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <div class="flex">
        <h3 class="text-lg font-semibold text-gray-800">Work Experience</h3>

        <button v-if="isEdit" @click="addExperience" class="text-blue-500 ml-2 hover:underline">
          <i class="pi pi-plus-circle"></i>
        </button>
      </div>
      <ul class="space-y-6">
        <li v-for="(exp, index) in data.work_experience" :key="index">
          <p v-if="!isEdit" class="text-gray-700 font-bold">{{ exp.company }}</p>
          <input
            v-else
            v-model="exp.company"
            class="text-gray-700 font-bold border rounded px-2 py-1 w-full"
            placeholder="Company Name"
          />
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ exp.duration }}</p>
          <input
            v-else
            v-model="exp.duration"
            class="text-sm text-gray-500 border rounded px-2 py-1"
            placeholder="Working Duration"
          />
          <ul class="list-disc list-inside mt-2 text-gray-700">
            <li v-for="(detail, dIndex) in exp.details" :key="dIndex">
              <span v-if="!isEdit">{{ detail }}</span>
              <input
                v-else
                v-model="exp.details[dIndex]"
                class="border rounded px-2 py-1 w-full"
                placeholder="Job Details"
              />
            </li>
          </ul>
          <button
            v-if="isEdit"
            @click="removeExperience(index)"
            class="text-red-500 text-sm mt-2 hover:underline"
          >
            <i class="pi pi-trash"></i>
          </button>
        </li>
      </ul>
    </div>

    <!-- Skills -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <div class="flex">
        <h3 class="text-lg font-semibold text-gray-800">Skills</h3>
        <button v-if="isEdit" @click="addSkill" class="text-blue-500 hover:underline ml-2">
          <i class="pi pi-plus-circle"></i>
        </button>
      </div>
      <ul class="grid grid-cols-2 gap-2">
        <!-- Change to grid layout for even distribution -->
        <li
          v-for="(skill, index) in data.skills"
          :key="index"
          class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
        >
          <!-- When isEdit is false -->
          <span v-if="!isEdit" class="truncate">{{ skill }}</span>

          <!-- When isEdit is true -->
          <div v-else class="flex items-center w-full">
            <input
              v-model="data.skills[index]"
              class="border rounded px-2 py-1 w-full bg-white"
              placeholder="Skill"
            />
            <button @click="removeSkill(index)" class="text-red-500 text-xs ml-2 hover:underline">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <button
      v-if="isEdit"
      @click="downloadStyledPDF"
      class="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
    >
      Download CV
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'
import defaultAvatar from '@/assets/avatar-default.svg'

const props = defineProps({ isEditable: Boolean })

const template = ref(null)
const isEdit = ref(false)

watch(
  () => props.isEditable,
  (newVal) => {
    console.log(newVal)
    isEdit.value = newVal
  },
  { immediate: true }
)

const profileImage = ref(defaultAvatar)

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result // Hiển thị ảnh đã chọn
    }
    reader.readAsDataURL(file)
  }
}
const data = reactive({
  personal_info: {
    name: 'Nguyễn Văn A',
    job_title: 'Sales Staff',
    summary: 'High-performance sales staff with X years of experience in areas A, B, C...',
    contact: {
      email: 'hotro@topcv.vn',
      phone: '(024) 6680 5588',
      git: 'https://fb.com/topcv.vn',
      address: 'District A, Hanoi'
    }
  },
  education: [
    {
      school: 'TOPCV University',
      major: 'Business Administration',
      year: '2016 - 2020',
      grade: 'Graduated with Honors'
    }
  ],
  work_experience: [
    {
      company: 'ABC Company',
      title: 'Sales Staff',
      duration: '08/2020 - 08/2022',
      details: ['Served a group of 20 major clients generating revenue of 5-10 billion...']
    }
  ],
  skills: ['Customer Search', 'Persuasion Skills', 'CRM']
})

// Thêm / Xóa Education
function addEducation() {
  data.education.push({
    school: '',
    major: '',
    year: '',
    grade: ''
  })
  console.log(data.education)
}
function removeEducation(index) {
  if (data.education.length > 1) {
    // Check if at least one remains
    data.education.splice(index, 1)
  }
}

// Thêm / Xóa Work Experience
function addExperience() {
  data.work_experience.push({
    company: '',
    title: '',
    duration: '',
    details: ['']
  })
}
function removeExperience(index) {
  if (data.work_experience.length > 1) {
    // Check if at least one remains
    data.work_experience.splice(index, 1)
  }
}

// Thêm / Xóa Skill
function addSkill() {
  data.skills.push('')
}
function removeSkill(index) {
  if (data.skills.length > 1) {
    // Check if at least one remains
    data.skills.splice(index, 1)
  }
}
async function downloadStyledPDF() {
  isEdit.value = false // Đặt về chế độ xem trước

  await nextTick()

  const element = template.value

  try {
    // Tăng scale để cải thiện chất lượng
    const scale = 3 // Tăng giá trị này để tăng độ phân giải
    const options = {
      width: element.offsetWidth * scale,
      height: element.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
        overflow: 'hidden'
      }
    }

    // Sử dụng dom-to-image để tạo ảnh chất lượng cao
    const dataUrl = await domtoimage.toPng(element, options)

    const pdf = new jsPDF('p', 'mm', 'a4')

    // Tính toán kích thước ảnh trong PDF
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    pdf.save(`CV_${data.personal_info.name}.pdf`)
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error)
  } finally {
    isEdit.value = props.isEditable // Khôi phục trạng thái chỉnh sửa
  }
}
</script>
