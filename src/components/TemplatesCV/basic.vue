<template>
  <div ref="template" class="rounded-lg p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:space-x-6 border-b pb-4">
      <div
        class="relative w-40 h-40 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden mx-auto md:mx-0"
      >
        <!-- Display photo -->
        <img
          v-if="data.personal_info.photo"
          :src="data.personal_info.photo"
          crossOrigin="anonymous"
          alt="Profile Photo"
          class="w-full h-full object-cover"
        />
        <label
          v-if="isEdit"
          class="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 flex items-center justify-center"
          style="width: 40px; height: 40px"
        >
          <input type="file" class="hidden" @change="handlePhotoUpload" />
          <i class="pi pi-camera text-white text-xl"></i>
        </label>
      </div>
      <div class="text-center md:text-left mt-4 md:mt-0">
        <h1 v-if="!isEdit" class="text-3xl font-bold text-green-600">
          {{ data.personal_info.name }}
        </h1>
        <input
          v-else
          v-model="data.personal_info.name"
          class="text-3xl font-bold text-green-600 border rounded px-2 py-1 w-full"
        />
        <h2 v-if="!isEdit" class="text-xl font-semibold text-gray-700">
          {{ data.personal_info.job_title }}
        </h2>
        <input
          v-else
          v-model="data.personal_info.job_title"
          class="text-xl font-semibold text-gray-700 border rounded px-2 py-1 w-full mt-2"
        />
        <p v-if="!isEdit" class="text-gray-600 mt-2">{{ data.personal_info.summary }}</p>
        <textarea
          v-else
          v-model="data.personal_info.summary"
          class="text-gray-600 mt-2 border rounded px-2 py-1 w-full"
        ></textarea>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- Left Section -->
      <div class="col-span-2">
        <!-- Education -->
        <div class="mb-6">
          <div class="flex">
            <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">
              Education
            </h3>
            <button v-if="isEdit" @click="addEducation" class="text-blue-500 ml-2 hover:underline">
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="(edu, index) in data.education" :key="index" class="mb-4">
              <h4 v-if="!isEdit" class="text-gray-800 font-semibold">{{ edu.school }}</h4>
              <input
                v-else
                v-model="edu.school"
                class="text-gray-800 font-semibold border rounded px-2 py-1 w-full"
                placeholder="School"
              />
              <p v-if="!isEdit" class="text-gray-600">{{ edu.major }} ({{ edu.year }})</p>
              <div v-else class="flex space-x-2">
                <input
                  v-model="edu.major"
                  class="text-gray-600 border rounded px-2 py-1 w-2/3"
                  placeholder="Major"
                />
                <input
                  v-model="edu.year"
                  class="text-gray-600 border rounded px-2 py-1 w-1/3"
                  placeholder="Year"
                />
              </div>
              <p v-if="!isEdit" class="text-sm text-gray-500">{{ edu.grade }}</p>
              <input
                v-else
                v-model="edu.grade"
                class="text-sm text-gray-500 border rounded px-2 py-1 w-full"
                placeholder="Grade"
              />
              <button
                v-if="isEdit"
                @click="removeEducation(index)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="mb-6">
          <div class="flex">
            <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">
              Work Experience
            </h3>

            <button v-if="isEdit" @click="addExperience" class="text-blue-500 ml-2 hover:underline">
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="(exp, index) in data.work_experience" :key="index" class="mb-6">
              <h4 v-if="!isEdit" class="text-gray-800 font-semibold">{{ exp.company }}</h4>
              <input
                v-else
                v-model="exp.company"
                class="text-gray-800 font-semibold border rounded px-2 py-1 w-full"
                placeholder="Company Name"
              />
              <p v-if="!isEdit" class="text-sm text-gray-500">
                {{ exp.title }} ({{ exp.duration }})
              </p>
              <div v-else class="flex space-x-2">
                <input
                  v-model="exp.title"
                  class="text-gray-500 border rounded px-2 py-1 w-1/2"
                  placeholder="Title"
                />
                <input
                  v-model="exp.duration"
                  class="text-gray-500 border rounded px-2 py-1 w-1/2"
                  placeholder="Duration"
                />
              </div>
              <ul class="list-disc list-inside mt-2 text-gray-700">
                <li v-for="(detail, detailIndex) in exp.details" :key="detailIndex" class="mb-1">
                  <span v-if="!isEdit">{{ detail }}</span>
                  <input
                    v-else
                    v-model="exp.details[detailIndex]"
                    class="border rounded px-2 py-1 w-full"
                    placeholder="Job Description"
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
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div>
        <!-- Personal Information -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-green-600">Personal Information</h3>
          <ul class="mt-2 space-y-2">
            <li
              v-for="(field, key) in data.personal_info.contact"
              :key="key"
              class="flex items-center"
            >
              <span class="material-icons text-green-600 mr-2">{{ key }}</span>
              <span v-if="!isEdit">{{ field }}</span>
              <input
                v-else
                v-model="data.personal_info.contact[key]"
                class="border rounded px-2 py-1 w-full"
                :placeholder="'Enter ' + key"
              />
            </li>
          </ul>
        </div>

        <!-- Skills -->
        <div class="mt-6 border-t border-gray-200 pt-4">
          <div class="flex">
            <h3 class="text-lg font-semibold text-gray-800">Skills</h3>
            <button v-if="isEdit" @click="addSkill" class="text-blue-500 ml-2 hover:underline">
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>
          <ul class="space-y-4">
            <li
              v-for="(skill, index) in data.skills"
              :key="index"
              class="flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
            >
              <!-- When isEdit is false -->
              <span v-if="!isEdit" class="truncate">{{ skill }}</span>
              <!-- When isEdit is true -->
              <div v-else class="flex items-center w-full">
                <input
                  v-model="data.skills[index]"
                  class="bg-white border rounded px-2 py-1 w-full text-sm"
                  placeholder="Skill"
                />
                <button
                  @click="removeSkill(index)"
                  class="text-red-500 text-xs ml-2 hover:underline"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
import { reactive, ref, nextTick, watch } from 'vue'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image'

const props = defineProps({
  isEditable: Boolean
})

const isEdit = ref(false)

watch(
  () => props.isEditable,
  (newVal) => {
    isEdit.value = newVal
  },
  { immediate: true }
)

const data = reactive({
  personal_info: {
    photo: null,
    name: 'Nguyễn Văn B',
    job_title: 'Software Engineer', // Chức vụ thay đổi thành Software Engineer
    summary:
      'Software engineer with 4 years of experience in full-stack web development, specializing in JavaScript frameworks and building scalable web applications.',
    contact: {
      Email: 'nguyenb@example.com', // Thay đổi email thành một email chuyên nghiệp
      Phone: '0123 456 789',
      Git: 'https://github.com/nguyenb', // Thay đổi GitHub URL
      Address: 'District C, Ho Chi Minh City'
    }
  },
  education: [
    {
      school: 'University of Danang - University of Science and Technology', // Thay đổi tên trường
      major: 'Computer Science', // Chuyên ngành thay thành Khoa học Máy tính
      year: '2015 - 2019',
      grade: 'Graduated with Honors'
    }
  ],
  work_experience: [
    {
      company: 'Tech Innovators Ltd.', // Công ty thay thành công ty công nghệ
      title: 'Full Stack Developer', // Chức danh thay thành Full Stack Developer
      duration: '03/2020 - Present',
      details: [
        'Developed and maintained web applications using Node.js and React.',
        'Collaborated with front-end developers to integrate user-facing elements with server-side logic.',
        'Optimized application performance and reduced page load times by 30%.'
      ]
    },
    {
      company: 'Tech Solutions Inc.',
      title: 'Backend Developer', // Thêm một công ty với vị trí Backend Developer
      duration: '06/2019 - 03/2020',
      details: [
        'Built and deployed RESTful APIs using Node.js and Express.',
        'Implemented authentication systems using JWT and OAuth 2.0.',
        'Worked with MySQL and MongoDB for database management.'
      ]
    }
  ],
  skills: [
    'JavaScript',
    'Node.js',
    'React',
    'Express.js',
    'MongoDB',
    'MySQL',
    'Version Control (Git)',
    'Agile Methodology',
    'Problem Solving',
    'API Development'
  ]
})

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      data.personal_info.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function addEducation() {
  data.education.push({ school: '', major: '', year: '', grade: '' })
}

function removeEducation(index) {
  if (data.education.length === 1) {
    return
  }
  data.education.splice(index, 1)
}

function addExperience() {
  data.work_experience.push({ company: '', title: '', duration: '', details: ['', ''] })
}

function removeExperience(index) {
  if (data.work_experience.length === 1) {
    return
  }
  data.work_experience.splice(index, 1)
}

function addSkill() {
  data.skills.push('')
}

function removeSkill(index) {
  if (data.skills.length === 1) {
    return
  }
  data.skills.splice(index, 1)
}

const template = ref(null)

async function downloadStyledPDF() {
  isEdit.value = false // Set to preview mode
  await nextTick()

  const element = template.value

  try {
    // Tăng scale để cải thiện chất lượng
    const scale = 3 // Tăng giá trị này nếu muốn độ phân giải cao hơn
    const options = {
      width: element.offsetWidth * scale,
      height: element.scrollHeight * scale, // Sử dụng scrollHeight để chỉ bao phủ chiều cao nội dung
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${element.offsetWidth}px`,
        height: `${element.scrollHeight}px`, // Điều chỉnh chiều cao theo nội dung
        overflow: 'hidden' // Ẩn phần nội dung vượt ra ngoài
      }
    }

    // Tạo ảnh chất lượng cao sử dụng dom-to-image
    const dataUrl = await domtoimage.toPng(element, options)

    const pdf = new jsPDF('p', 'mm', 'a4')

    // Tính toán kích thước ảnh trong PDF
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (element.scrollHeight * pdfWidth) / element.offsetWidth // Sử dụng scrollHeight ở đây

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    pdf.save(`CV_${data.personal_info.name}.pdf`)
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error)
  } finally {
    isEdit.value = props.isEditable // Khôi phục trạng thái chỉnh sửa
  }
}
</script>
