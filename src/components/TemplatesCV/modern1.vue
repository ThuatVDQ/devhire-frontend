<template>
  <div ref="template" class="bg-white p-4 rounded-lg max-w-4xl mx-auto">
    <!-- Header Section -->
    <div class="bg-green-600 text-white flex items-center p-6 rounded-t-lg">
      <div
        class="relative w-40 h-40 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden mx-auto md:mx-0"
      >
        <!-- Display image -->
        <img
          v-if="data.personal_info.photo"
          :src="data.personal_info.photo"
          crossOrigin="anonymous"
          alt="Profile Photo"
          class="w-full h-full object-cover"
        />

        <!-- Display icon and input to choose file when isEdit is true -->
        <label
          v-if="isEdit"
          class="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 flex items-center justify-center"
          style="width: 40px; height: 40px"
        >
          <input type="file" class="hidden" @change="handlePhotoUpload" />
          <i class="pi pi-camera text-white text-xl"></i>
        </label>
      </div>

      <div class="ml-4">
        <h1 v-if="!isEdit" class="text-3xl font-bold">{{ data.personal_info.name }}</h1>
        <input
          v-else
          v-model="data.personal_info.name"
          class="text-2xl font-bold text-green-600 border rounded px-2 py-1 w-full"
        />
        <h2 v-if="!isEdit" class="text-xl font-semibold">
          {{ data.personal_info.job_title }}
        </h2>
        <input
          v-else
          v-model="data.personal_info.job_title"
          class="text-lg font-semibold text-gray-600 border rounded px-2 py-1 w-full mt-2"
        />
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-2 gap-4 text-gray-700 mt-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <!-- Icon for Email -->
          <i class="pi pi-envelope"></i>
          <p v-if="!isEdit" class="flex-grow">{{ data.personal_info.contact.email }}</p>
          <input
            v-else
            v-model="data.personal_info.contact.email"
            id="email"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div class="flex items-center space-x-2">
          <!-- Icon for Phone -->
          <i class="pi pi-phone"></i>
          <p v-if="!isEdit" class="flex-grow">{{ data.personal_info.contact.phone }}</p>
          <input
            v-else
            v-model="data.personal_info.contact.phone"
            id="phone"
            class="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <!-- Icon for Git -->
          <i class="pi pi-github"></i>
          <p v-if="!isEdit" class="flex-grow">
            <a :href="data.personal_info.contact.website" class="text-blue-500 hover:underline">
              {{ data.personal_info.contact.website }}
            </a>
          </p>
          <input
            v-else
            v-model="data.personal_info.contact.website"
            id="git"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div class="flex items-center space-x-2">
          <!-- Icon for Address -->
          <i class="pi pi-map-marker"></i>
          <p v-if="!isEdit" class="flex-grow">{{ data.personal_info.contact.address }}</p>
          <input
            v-else
            v-model="data.personal_info.contact.address"
            id="address"
            class="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>
    </div>

    <!-- Career Objective -->
    <div class="mt-6">
      <h3 class="text-lg font-bold text-green-600">Career Objective</h3>
      <p v-if="!isEdit">{{ data.personal_info.summary }}</p>
      <textarea
        v-else
        v-model="data.personal_info.summary"
        class="border rounded px-2 py-1 w-full mt-2"
      ></textarea>
    </div>

    <!-- Skills and Certifications -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column (Skills, Work Experience) -->
      <div>
        <div class="">
          <div class="flex">
            <h3 class="text-lg font-bold text-green-600">Work Experience</h3>

            <button v-if="isEdit" @click="addExperience" class="text-blue-500 ml-2 hover:underline">
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>

          <!-- When isEdit is true, display input fields for editing -->
          <ul v-if="isEdit" class="space-y-4">
            <li v-for="(job, index) in data.work_experience" :key="job.company">
              <div class="items-center space-y-2">
                <input
                  v-model="data.work_experience[index].title"
                  class="border rounded px-2 py-1 w-full"
                  placeholder="Job Title"
                />
                <input
                  v-model="data.work_experience[index].company"
                  class="border rounded px-2 py-1 w-full"
                  placeholder="Company"
                />
                <input
                  v-model="data.work_experience[index].duration"
                  class="border rounded px-2 py-1 w-full"
                  placeholder="Duration"
                />
              </div>
              <ul class="list-disc ml-4 text-gray-700 mt-2">
                <li v-for="(detail, dIndex) in job.details" :key="dIndex">
                  <input
                    v-model="data.work_experience[index].details[dIndex]"
                    class="border rounded px-2 py-1 w-full"
                    placeholder="Job Description"
                  />
                </li>
              </ul>
              <button
                @click="removeExperience(index)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>

          <!-- When isEdit is false, display information without inputs -->
          <ul v-else class="space-y-4">
            <li v-for="job in data.work_experience" :key="job.company">
              <h4 class="font-semibold">{{ job.title }} - {{ job.company }}</h4>
              <p class="text-sm text-gray-500">{{ job.duration }}</p>
              <ul class="list-disc ml-4 text-gray-700 mt-2">
                <li v-for="detail in job.details" :key="detail">{{ detail }}</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- Skills Section -->
        <div class="mt-4">
          <div class="flex">
            <h3 class="text-lg font-bold text-green-600">Skills</h3>
            <div v-if="isEdit" class="">
              <button @click="addSkill" class="text-blue-500 ml-2 hover:underline">
                <i class="pi pi-plus-circle"></i>
              </button>
            </div>
          </div>

          <!-- When isEdit is true, display input fields to edit skills -->
          <ul v-if="isEdit" class="space-y-2">
            <li
              v-for="(skill, index) in data.skills"
              :key="index"
              class="flex items-center space-x-4"
            >
              <input
                v-model="data.skills[index].name"
                class="border rounded px-2 py-1 w-full"
                placeholder="Skill Name"
              />
              <button @click="removeSkill(index)" class="text-red-500 text-xs ml-2 hover:underline">
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>

          <!-- When isEdit is false, display skills as text -->
          <ul v-else class="space-y-2">
            <li v-for="skill in data.skills" :key="skill" class="flex items-center">
              <span class="w-full">{{ skill.name }}</span>
            </li>
          </ul>

          <!-- Only show "Add Skill" button when isEdit is true -->
        </div>
      </div>

      <!-- Right Column (Certifications, Education) -->
      <div>
        <!-- Certifications Section -->
        <div>
          <div class="flex">
            <h3 class="text-lg font-bold text-green-600">Certifications</h3>
            <div v-if="isEdit" class="">
              <button @click="addCertification" class="text-blue-500 ml-2 hover:underline">
                <i class="pi pi-plus-circle"></i>
              </button>
            </div>
          </div>

          <!-- When isEdit is true, display input fields for editing certifications -->
          <ul v-if="isEdit" class="list-disc ml-4 space-y-1">
            <li
              v-for="(cert, index) in data.certifications"
              :key="cert.name"
              class="items-center space-y-2"
            >
              <input
                v-model="data.certifications[index].name"
                class="border rounded px-2 py-1 w-full"
                placeholder="Certification Name"
              />
              <input
                v-model="data.certifications[index].year"
                class="border rounded px-2 py-1 w-full"
                placeholder="Year"
              />
              <button
                @click="removeCertification(index)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>

          <!-- When isEdit is false, display certifications as text -->
          <ul v-else class="list-disc ml-4 space-y-1">
            <li v-for="cert in data.certifications" :key="cert.name">
              {{ cert.name }} - {{ cert.year }}
            </li>
          </ul>
        </div>

        <!-- Education Section -->
        <div class="mt-6">
          <div class="flex">
            <h3 class="text-lg font-bold text-green-600">Education</h3>
            <div v-if="isEdit" class="">
              <button @click="addEducation" class="text-blue-500 ml-2 hover:underline">
                <i class="pi pi-plus-circle"></i>
              </button>
            </div>
          </div>

          <!-- When isEdit is true, display input fields for editing education -->
          <ul v-if="isEdit" class="space-y-4">
            <li v-for="(edu, index) in data.education" :key="edu.school" class="space-y-2">
              <div>
                <input
                  v-model="data.education[index].major"
                  class="border rounded px-2 py-1 w-full font-semibold mb-2"
                  placeholder="Major"
                />
                <input
                  v-model="data.education[index].school"
                  class="border rounded px-2 py-1 w-full mb-2"
                  placeholder="School"
                />
                <input
                  v-model="data.education[index].year"
                  class="border rounded px-2 py-1 w-full mb-2"
                  placeholder="Year"
                />
                <input
                  v-model="data.education[index].grade"
                  class="border rounded px-2 py-1 w-full mb-2"
                  placeholder="Grade"
                />
                <button
                  @click="removeEducation(index)"
                  class="text-red-500 text-sm mt-2 hover:underline"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </li>
          </ul>

          <!-- When isEdit is false, display education as text -->
          <ul v-else class="space-y-4">
            <li v-for="edu in data.education" :key="edu.school">
              <h4 class="font-semibold">{{ edu.major }} - {{ edu.school }}</h4>
              <p class="text-sm text-gray-500">{{ edu.year }}</p>
              <p class="text-sm">{{ edu.grade }}</p>
            </li>
          </ul>

          <!-- Only show Add button when isEdit is true -->
        </div>

        <div class="mt-6">
          <div class="flex">
            <h3 class="text-lg font-bold text-green-600">Awards</h3>
            <button v-if="isEdit" @click="addAward" class="ml-2 text-green-600 hover:underline">
              <i class="pi pi-plus-circle"></i>
            </button>
          </div>

          <!-- When isEdit is true, display input fields for editing awards -->
          <ul v-if="isEdit" class="list-disc ml-4 space-y-1">
            <li
              v-for="(award, index) in data.awards"
              :key="award.name"
              class="items-center space-y-2"
            >
              <input
                v-model="data.awards[index].name"
                class="border rounded px-2 py-1 w-full"
                placeholder="Award Name"
              />
              <input
                v-model="data.awards[index].year"
                class="border rounded px-2 py-1 w-full"
                placeholder="Year"
              />
              <button @click="removeAward(index)" class="text-red-500 text-sm mt-2 hover:underline">
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>

          <!-- When isEdit is false, display awards as text -->
          <ul v-else class="list-disc ml-4 space-y-1">
            <li v-for="award in data.awards" :key="award.name">
              {{ award.name }} - {{ award.year }}
            </li>
          </ul>

          <!-- Add Award button when isEdit is true -->
        </div>
      </div>
    </div>
    <div v-if="isEdit" class="flex space-x-4">
      <button
        @click="downloadCV"
        class="mt-6 bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
      >
        Download CV
      </button>
      <button
        @click="saveCV"
        class="mt-6 bg-emerald-600 text-white px-4 py-2 rounded-2xl hover:bg-emerald-700"
      >
        Save CV
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick, defineEmits } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'
import defaultAvatar from '@/assets/profile-avatar5.png'

const props = defineProps({ isEditable: Boolean })

const template = ref(null)
const emit = defineEmits(['download', 'save'])
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
    name: 'Nguyễn Thành Nam',
    photo: defaultAvatar,
    job_title: 'Full Stack Developer', // Chức vụ thay thành Full Stack Developer
    summary:
      'Full Stack Developer with 4 years of experience in developing web applications using JavaScript, Node.js, React, and modern web technologies. Proficient in both front-end and back-end development, database management, and API design.',
    contact: {
      email: 'nguyen.a@itcompany.vn', // Thay đổi email thành một email chuyên nghiệp
      phone: '(024) 6680 5588',
      website: 'https://github.com/nguyenthanhnam', // Thay đổi link website thành GitHub của lập trình viên
      address: 'District A, Hanoi'
    }
  },
  skills: [
    { name: 'JavaScript', level: 90 }, // Thay các kỹ năng marketing thành kỹ năng lập trình
    { name: 'Node.js', level: 85 },
    { name: 'React', level: 80 },
    { name: 'API Development', level: 75 },
    { name: 'Database Management (MySQL, MongoDB)', level: 80 }
  ],
  certifications: [
    { name: 'Certified JavaScript Developer', year: 2022 }, // Thay chứng chỉ marketing thành chứng chỉ IT
    { name: 'AWS Certified Solutions Architect', year: 2021 }
  ],
  work_experience: [
    {
      title: 'Full Stack Developer',
      company: 'Tech Solutions Inc.', // Công ty thay thành công ty công nghệ
      duration: '01/2021 - Present',
      details: [
        'Developed and maintained scalable web applications using Node.js and React.',
        'Collaborated with cross-functional teams to deliver high-quality software solutions.',
        'Optimized API performance and reduced page load times by 30%.'
      ]
    },
    {
      title: 'Backend Developer',
      company: 'WebTech Solutions',
      duration: '06/2020 - 12/2020',
      details: [
        'Built and deployed RESTful APIs using Node.js and Express.',
        'Worked with MongoDB and MySQL for database management and optimization.',
        'Integrated third-party APIs for payment processing and user authentication.'
      ]
    }
  ],
  education: [
    {
      school: 'University of Danang - University of Science and Technology', // Thay tên trường thành một trường nổi tiếng về CNTT
      major: 'Computer Science', // Chuyên ngành thay thành Khoa học Máy tính
      year: '2016 - 2020',
      grade: 'Graduated with Honors'
    }
  ],
  awards: [
    { name: 'Employee of the Year 2023', year: 2023 }, // Cập nhật giải thưởng phù hợp với ngành IT
    { name: 'Best Developer of Q3/2022', year: 2022 }
  ]
})

// Tải ảnh khi chọn
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

function addAward() {
  data.awards.push({ name: '', year: '' })
}

function removeAward(index) {
  if (data.awards.length === 1) {
    return
  }
  data.awards.splice(index, 1)
}

function addCertification() {
  data.certifications.push({ name: '', year: '' })
}

function removeCertification(index) {
  if (data.certifications.length === 1) {
    return
  }
  data.certifications.splice(index, 1)
}

async function generatePDF() {
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
    return pdf
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error)
  } finally {
    isEdit.value = props.isEditable
  }
}
async function saveCV() {
  emit('save', {
    file: await generatePDF()
  })
}

async function downloadCV() {
  emit('download', {
    name: data.personal_info.name,
    file: await generatePDF()
  })
}
</script>
