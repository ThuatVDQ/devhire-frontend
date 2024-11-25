<template>
  <div ref="template" class="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-6">
      <div class="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0"></div>
      <div>
        <h1 v-if="!isEdit" class="text-2xl font-bold text-green-600">
          {{ data.personal_info.name }}
        </h1>
        <input
          v-else
          v-model="data.personal_info.name"
          class="text-2xl font-bold text-green-600 border rounded px-2 py-1"
        />
        <h2 v-if="!isEdit" class="text-lg font-semibold text-gray-600">
          {{ data.personal_info.job_title }}
        </h2>
        <input
          v-else
          v-model="data.personal_info.job_title"
          class="text-lg font-semibold text-gray-600 border rounded px-2 py-1"
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
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Thông tin cá nhân</h3>
      <ul class="space-y-1">
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">email</span>
          <span v-if="!isEdit">{{ data.personal_info.contact.email }}</span>
          <input
            v-else
            v-model="data.personal_info.contact.email"
            class="border rounded px-2 py-1"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">phone</span>
          <span v-if="!isEdit">{{ data.personal_info.contact.phone }}</span>
          <input
            v-else
            v-model="data.personal_info.contact.phone"
            class="border rounded px-2 py-1"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">language</span>
          <a
            v-if="!isEdit"
            :href="data.personal_info.contact.website"
            class="text-blue-500 hover:underline"
          >
            {{ data.personal_info.contact.website }}
          </a>
          <input
            v-else
            v-model="data.personal_info.contact.website"
            class="border rounded px-2 py-1 w-full"
          />
        </li>
        <li class="flex items-center">
          <span class="material-icons text-green-600 mr-2">location_on</span>
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
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Học vấn</h3>
      <ul class="space-y-3">
        <li v-for="(edu, index) in data.education" :key="index" class="text-gray-700">
          <p>
            <strong v-if="!isEdit">{{ edu.school }}</strong>
            <input
              v-else
              v-model="edu.school"
              class="border rounded px-2 py-1 w-full font-bold"
              placeholder="Trường học"
            />
            <span v-if="!isEdit"> - </span>
            <span v-if="!isEdit">{{ edu.major }}</span>
            <input
              v-else
              v-model="edu.major"
              class="border rounded px-2 py-1 w-full"
              placeholder="Ngành học"
            />
          </p>
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ edu.year }}</p>
          <input
            v-else
            v-model="edu.year"
            class="text-sm text-gray-500 border rounded px-2 py-1"
            placeholder="Thời gian học"
          />
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ edu.grade }}</p>
          <input
            v-else
            v-model="edu.grade"
            class="text-sm text-gray-500 border rounded px-2 py-1"
            placeholder="Loại tốt nghiệp"
          />
          <button
            v-if="isEdit"
            @click="removeEducation(index)"
            class="text-red-500 text-sm mt-2 hover:underline"
          >
            Remove
          </button>
        </li>
      </ul>
      <button v-if="isEdit" @click="addEducation" class="text-blue-500 mt-3 hover:underline">
        + Add Education
      </button>
    </div>

    <!-- Work Experience -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Kinh nghiệm làm việc</h3>
      <ul class="space-y-6">
        <li v-for="(exp, index) in data.work_experience" :key="index">
          <p v-if="!isEdit" class="text-gray-700 font-bold">{{ exp.company }}</p>
          <input
            v-else
            v-model="exp.company"
            class="text-gray-700 font-bold border rounded px-2 py-1 w-full"
            placeholder="Tên công ty"
          />
          <p class="text-sm text-gray-500" v-if="!isEdit">{{ exp.duration }}</p>
          <input
            v-else
            v-model="exp.duration"
            class="text-sm text-gray-500 border rounded px-2 py-1"
            placeholder="Thời gian làm việc"
          />
          <ul class="list-disc list-inside mt-2 text-gray-700">
            <li v-for="(detail, dIndex) in exp.details" :key="dIndex">
              <span v-if="!isEdit">{{ detail }}</span>
              <input
                v-else
                v-model="exp.details[dIndex]"
                class="border rounded px-2 py-1 w-full"
                placeholder="Chi tiết công việc"
              />
            </li>
          </ul>
          <button
            v-if="isEdit"
            @click="removeExperience(index)"
            class="text-red-500 text-sm mt-2 hover:underline"
          >
            Remove
          </button>
        </li>
      </ul>
      <button v-if="isEdit" @click="addExperience" class="text-blue-500 mt-3 hover:underline">
        + Add Experience
      </button>
    </div>

    <!-- Skills -->
    <div class="mt-6 border-t border-gray-200 pt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Kỹ năng</h3>
      <ul class="flex flex-wrap space-x-2">
        <li
          v-for="(skill, index) in data.skills"
          :key="index"
          class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center"
        >
          <span v-if="!isEdit">{{ skill }}</span>
          <input
            v-else
            v-model="data.skills[index]"
            class="border rounded px-2 py-1 w-full"
            placeholder="Kỹ năng"
          />
          <button
            v-if="isEdit"
            @click="removeSkill(index)"
            class="text-red-500 text-xs ml-2 hover:underline"
          >
            ✕
          </button>
        </li>
      </ul>
      <button v-if="isEdit" @click="addSkill" class="text-blue-500 mt-3 hover:underline">
        + Add Skill
      </button>
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
defineProps(['isEditable'])
import { reactive, ref, watch } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

const template = ref(null)
const isEdit = ref(false)

const data = reactive({
  personal_info: {
    name: 'Nguyễn Văn A',
    job_title: 'Nhân viên bán hàng',
    summary: 'Nhân viên bán hàng hiệu suất cao với X năm kinh nghiệm trong lĩnh vực A, B, C...',
    contact: {
      email: 'hotro@topcv.vn',
      phone: '(024) 6680 5588',
      website: 'https://fb.com/topcv.vn',
      address: 'Quận A, Hà Nội'
    }
  },
  education: [
    {
      school: 'Đại học TOPCV',
      major: 'Quản trị kinh doanh',
      year: '2016 - 2020',
      grade: 'Tốt nghiệp loại Giỏi'
    }
  ],
  work_experience: [
    {
      company: 'Công ty ABC',
      title: 'Nhân viên kinh doanh',
      duration: '08/2020 - 08/2022',
      details: ['Phục vụ nhóm 20 khách hàng lớn đem về doanh thu 5-10 tỉ...']
    }
  ],
  skills: ['Tìm kiếm khách hàng', 'Kỹ năng thuyết phục', 'CRM']
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
  data.education.splice(index, 1)
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
  data.work_experience.splice(index, 1)
}

// Thêm / Xóa Skill
function addSkill() {
  data.skills.push('')
}
function removeSkill(index) {
  data.skills.splice(index, 1)
}
async function downloadStyledPDF() {
  isEdit = false // Chuyển về chế độ không chỉnh sửa

  // Đợi Vue cập nhật lại giao diện trước khi chụp
  await nextTick()

  const element = template.value // Sử dụng ref để lấy DOM element

  try {
    const dataUrl = await domtoimage.toPng(element) // Chụp giao diện
    const pdf = new jsPDF('p', 'mm', 'a4') // Tạo file PDF với kích thước A4

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight) // Thêm ảnh vào PDF
    pdf.save('Styled_CV.pdf') // Lưu file PDF
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error)
  } finally {
    isEdit.value = isEditable // Khôi phục trạng thái chỉnh sửa ban đầu
  }
}
</script>
