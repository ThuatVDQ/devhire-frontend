<template>
  <div ref="template" class="bg-white rounded-lg p-6 max-w-4xl mx-auto flex flex-col">
    <!-- Phần trên: Hình ảnh và thông tin cá nhân -->
    <div class="flex">
      <div class="w-2/5 flex flex-col items-center bg-gray-100 p-8">
        <div
          class="relative rounded-full bg-gray-300 flex-shrink-0 overflow-hidden mx-auto md:mx-0"
        >
          <img
            :src="profileImage || 'https://via.placeholder.com/150'"
            alt="Profile Image"
            class="w-40 h-40 object-cover rounded-full"
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
      </div>
      <div class="w-3/5 flex flex-col justify-center pl-6">
        <h1 v-if="!isEdit" class="text-4xl font-bold text-gray-800 font-serif">
          {{ data.personal_info.name }}
        </h1>
        <input
          v-else
          v-model="data.personal_info.name"
          class="text-4xl font-bold text-gray-800 border rounded px-2 py-1"
        />

        <h2 v-if="!isEdit" class="text-2xl text-gray-600 font-semibold">
          {{ data.personal_info.job_title }}
        </h2>
        <input
          v-else
          v-model="data.personal_info.job_title"
          class="text-2xl text-gray-600 font-semibold border rounded px-2 py-1 mt-2"
        />

        <p v-if="!isEdit" class="mt-2 text-gray-600">{{ data.personal_info.summary }}</p>
        <textarea
          v-else
          v-model="data.personal_info.summary"
          class="mt-2 text-gray-600 border rounded px-2 py-1 w-full overflow-hidden"
        ></textarea>
      </div>
    </div>

    <!-- Phần dưới: Thông tin liên hệ và kinh nghiệm làm việc -->
    <div class="flex">
      <div class="w-2/5 p-6 border-r border-gray-200 flex flex-col bg-gray-100">
        <div class="mb-6">
          <h2
            class="font-bold text-2xl text-white mb-2 bg-[#603e18] border-4 rounded-full p-2 text-center"
          >
            CONTACT
          </h2>
          <div class="p-2 space-y-3">
            <p class="text-gray-600">
              <i class="pi pi-phone mr-3"></i>
              <span v-if="!isEdit" class="text-gray-800">{{
                data.personal_info.contact.phone
              }}</span>
              <input
                v-else
                v-model="data.personal_info.contact.phone"
                class="border rounded px-2 py-1 w-full mt-1"
              />
            </p>
            <p class="text-gray-600">
              <i class="pi pi-envelope mr-3"></i>
              <span class="text-gray-800">{{ data.personal_info.contact.email }}</span>
              <input
                v-if="isEdit"
                v-model="data.personal_info.contact.email"
                class="border rounded px-2 py-1 w-full mt-1"
              />
            </p>
            <p class="text-gray-600">
              <i class="pi pi-github mr-3"></i>
              <span v-if="!isEdit" class="text-gray-800">{{ data.personal_info.contact.git }}</span>
              <input
                v-else
                v-model="data.personal_info.contact.git"
                class="border rounded px-2 py-1 w-full mt-1"
              />
            </p>
            <p class="text-gray-600">
              <i class="pi pi-map-marker mr-3"></i>
              <span v-if="!isEdit" class="text-gray-800">{{
                data.personal_info.contact.address
              }}</span>
              <input
                v-else
                v-model="data.personal_info.contact.address"
                class="border rounded px-2 py-1 w-full mt-1"
              />
            </p>
          </div>
        </div>

        <div class="mb-6">
          <h2
            class="font-bold text-2xl text-white mb-2 bg-[#603e18] border-4 rounded-full p-2 text-center"
          >
            Education
          </h2>
          <ul class="p-2 space-y-3">
            <li v-for="(edu, index) in data.education" :key="index" class="text-gray-600">
              <div v-if="!isEdit">{{ edu.major }}</div>
              <input
                v-else
                v-model="edu.major"
                class="border rounded px-2 py-1 w-full mb-2"
                placeholder="Major"
              />
              <div v-if="!isEdit" class="text-gray-800">{{ edu.school }}</div>
              <input
                v-else
                v-model="edu.school"
                class="border rounded px-2 py-1 w-full mb-2"
                placeholder="School"
              />
              <div v-if="!isEdit" class="text-gray-600">{{ edu.year }}</div>
              <input
                v-else
                v-model="edu.year"
                class="border rounded px-2 py-1 w-full mb-2"
                placeholder="Year"
              />
              <div class="text-right">
                <button
                  v-if="isEdit"
                  @click="removeEducation(index)"
                  class="text-red-500 hover:underline"
                >
                  <i class="pi pi-trash"></i> Remove
                </button>
              </div>
            </li>
            <button
              v-if="isEdit"
              @click="addEducation"
              class="text-emerald-800 rounded float-right"
            >
              <i class="pi pi-plus-circle"></i> Add Education
            </button>
          </ul>
        </div>

        <div>
          <h2
            class="font-bold text-2xl text-white mb-2 bg-[#603e18] border-4 rounded-full p-2 text-center"
          >
            Skills
          </h2>
          <ul class="p-2 space-y-3">
            <li
              v-for="(skill, index) in data.skills"
              :key="index"
              class="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center justify-between"
            >
              <span v-if="!isEdit">{{ skill }}</span>
              <div v-else class="flex items-center w-full">
                <input
                  v-model="data.skills[index]"
                  class="border rounded px-2 py-1 w-full"
                  placeholder="Skill"
                />
                <button @click="removeSkill(index)" class="text-red-500 ml-2 hover:underline">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </li>
            <button
              v-if="isEdit"
              @click="addSkill"
              class="mt-2 text-emerald-800 px-2 py-2 rounded float-right"
            >
              <i class="pi pi-plus-circle"></i> Add Skill
            </button>
          </ul>
        </div>
      </div>

      <div class="w-3/5 py-6 pl-6 flex flex-col">
        <div class="flex items-center mb-4">
          <h2 class="font-bold text-2xl mb-2 py-2">WORK EXPERIENCE</h2>
          <div class="flex-1 border-b border-gray-800"></div>
        </div>
        <ul>
          <li v-for="(exp, index) in data.work_experience" :key="index" class="mb-1">
            <div class="flex justify-between items-center">
              <span v-if="!isEdit" class="text-gray-800 font-bold">{{ exp.title }}</span>
              <input
                v-if="isEdit"
                v-model="exp.title"
                class="text-gray-800 font-bold border rounded px-2 py-1 w-3/5 mb-2"
                placeholder="Title"
              />
              <span v-if="!isEdit" class="text-gray-600">{{ exp.duration }}</span>
              <input
                v-else
                v-model="exp.duration"
                class="text-gray-600 border rounded px-2 py-1 w-2/5 mb-2 ml-2"
                placeholder="Duration"
              />
            </div>
            <p v-if="!isEdit" class="text-gray-800 font-semibold mt-1">{{ exp.company }}</p>
            <input
              v-else
              v-model="exp.company"
              class="text-gray-800 border rounded px-2 py-1 w-full"
              placeholder="Company"
            />
            <p class="text-gray-600 mt-1" v-for="(detail, dIndex) in exp.details" :key="dIndex">
              <span v-if="!isEdit">{{ detail }}</span>
              <textarea
                v-if="isEdit"
                v-model="exp.details[dIndex]"
                class="border rounded px-2 py-1 w-full mt-1"
                placeholder="Detail"
              ></textarea>
            </p>
            <div class="text-right">
              <button
                v-if="isEdit"
                @click="removeExperience(index)"
                class="text-red-500 hover:underline"
              >
                <i class="pi pi-trash"></i> Remove
              </button>
            </div>
            <div class="flex-1 border-b border-gray-800 my-2"></div>
          </li>
          <button v-if="isEdit" @click="addExperience" class="text-emerald-800 rounded float-right">
            <i class="pi pi-plus-circle"></i> Add Experience
          </button>
        </ul>
      </div>
    </div>
    <button
      v-if="isEdit"
      @click="downloadStyledPDF"
      class="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 w-40"
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
import defaultAvatar from '@/assets/profile-avatar2.png'

// Dữ liệu
const template = ref(null)
const profileImage = ref(defaultAvatar)
const props = defineProps({ isEditable: Boolean })
const isEdit = ref(false)

watch(
  () => props.isEditable,
  (newVal) => {
    console.log(newVal)
    isEdit.value = newVal
  },
  { immediate: true }
)

const data = reactive({
  personal_info: {
    name: 'Nguyễn Thuỳ Linh',
    job_title: 'Software Developer', // Chức vụ thay thành Software Developer
    summary:
      'Software developer with 3 years of experience in developing web applications using modern technologies like JavaScript, React, and Node.js. Proficient in both front-end and back-end development, with strong problem-solving skills.',
    contact: {
      email: 'nguyen.a@itcompany.vn', // Thay đổi email thành một email chuyên nghiệp
      phone: '(024) 6680 5588',
      git: 'https://github.com/nguyenvana', // Cập nhật link GitHub của lập trình viên
      address: 'District A, Hanoi'
    }
  },
  education: [
    {
      school: 'University of Danang - University of Science and Technology', // Thay trường đại học thành trường CNTT
      major: 'Computer Science', // Chuyên ngành thay thành Khoa học Máy tính
      year: '2016 - 2020',
      grade: 'Graduated with Honors'
    }
  ],
  work_experience: [
    {
      company: 'Tech Solutions Inc.', // Công ty thay thành công ty công nghệ
      title: 'Software Developer', // Chức danh thay thành Software Developer
      duration: '08/2020 - 08/2022',
      details: [
        'Developed and maintained web applications using React, Node.js, and Express.',
        'Collaborated with front-end and back-end teams to deliver high-quality software.',
        'Optimized application performance, reducing load times by 25%.'
      ]
    },
    {
      company: 'Intel Inc.', // Công ty thay thành công ty công nghệ
      title: 'Software Developer', // Chức danh thay thành Software Developer
      duration: '02/2023 - now',
      details: [
        'Developed and maintained web applications using React, Node.js, and Express.',
        'Collaborated with front-end and back-end teams to deliver high-quality software.',
        'Optimized application performance, reducing load times by 25%.'
      ]
    }
  ],
  skills: [
    'JavaScript',
    'React',
    'Node.js',
    'API Development',
    'Problem Solving',
    'Git',
    'HTML/CSS',
    'Database Management (MySQL, MongoDB)'
  ] // Cập nhật kỹ năng CNTT
})

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Các hàm thêm và xóa mục học vấn, kinh nghiệm, giải thưởng
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
  if (data.skills.length > 1) {
    // Check if at least one remains
    data.skills.splice(index, 1)
  }
}

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
    const pdfHeight = (element.scrollHeight * pdfWidth) / element.offsetWidth

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    pdf.save(`CV_${data.personal_info.name}.pdf`)
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error)
  } finally {
    isEdit.value = props.isEditable
  }
}
</script>
