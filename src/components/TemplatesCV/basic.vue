<template>
  <div ref="template" class="bg-gray-50 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-6 border-b pb-4">
      <div class="relative w-28 h-28 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
        <img
          v-if="data.personal_info.photo"
          :src="data.personal_info.photo"
          alt="Profile Photo"
          class="w-full h-full object-cover"
        />
        <label
          v-if="isEdit"
          class="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full cursor-pointer hover:bg-green-700"
        >
          <input type="file" class="hidden" @change="handlePhotoUpload" />
          <span class="material-icons text-sm">edit</span>
        </label>
      </div>
      <div>
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
          class="text-xl font-semibold text-gray-700 border rounded px-2 py-1 w-full"
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
    <div class="grid grid-cols-3 gap-6 mt-6">
      <!-- Left Section -->
      <div class="col-span-2">
        <!-- Education -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">Học vấn</h3>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="(edu, index) in data.education" :key="index" class="mb-4">
              <h4 v-if="!isEdit" class="text-gray-800 font-semibold">{{ edu.school }}</h4>
              <input
                v-else
                v-model="edu.school"
                class="text-gray-800 font-semibold border rounded px-2 py-1 w-full"
                placeholder="Trường học"
              />
              <p v-if="!isEdit" class="text-gray-600">{{ edu.major }} ({{ edu.year }})</p>
              <div v-else class="flex space-x-2">
                <input
                  v-model="edu.major"
                  class="text-gray-600 border rounded px-2 py-1 w-full"
                  placeholder="Ngành học"
                />
                <input
                  v-model="edu.year"
                  class="text-gray-600 border rounded px-2 py-1 w-1/4"
                  placeholder="Năm"
                />
              </div>
              <p v-if="!isEdit" class="text-sm text-gray-500">{{ edu.grade }}</p>
              <input
                v-else
                v-model="edu.grade"
                class="text-sm text-gray-500 border rounded px-2 py-1 w-full"
                placeholder="Loại tốt nghiệp"
              />
              <button
                v-if="isEdit"
                @click="removeEducation(index)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                Xóa
              </button>
            </div>
            <button v-if="isEdit" @click="addEducation" class="text-blue-500 mt-3 hover:underline">
              + Thêm học vấn
            </button>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg">
            Kinh nghiệm làm việc
          </h3>
          <div class="bg-white border rounded-b-lg p-4">
            <div v-for="(exp, index) in data.work_experience" :key="index" class="mb-6">
              <h4 v-if="!isEdit" class="text-gray-800 font-semibold">{{ exp.company }}</h4>
              <input
                v-else
                v-model="exp.company"
                class="text-gray-800 font-semibold border rounded px-2 py-1 w-full"
                placeholder="Tên công ty"
              />
              <p v-if="!isEdit" class="text-sm text-gray-500">
                {{ exp.title }} ({{ exp.duration }})
              </p>
              <div v-else class="flex space-x-2">
                <input
                  v-model="exp.title"
                  class="text-gray-500 border rounded px-2 py-1 w-1/2"
                  placeholder="Chức danh"
                />
                <input
                  v-model="exp.duration"
                  class="text-gray-500 border rounded px-2 py-1 w-1/2"
                  placeholder="Thời gian làm việc"
                />
              </div>
              <ul class="list-disc list-inside mt-2 text-gray-700">
                <li v-for="(detail, detailIndex) in exp.details" :key="detailIndex" class="mb-1">
                  <span v-if="!isEdit">{{ detail }}</span>
                  <input
                    v-else
                    v-model="exp.details[detailIndex]"
                    class="border rounded px-2 py-1 w-full"
                    placeholder="Mô tả chi tiết"
                  />
                </li>
              </ul>
              <button
                v-if="isEdit"
                @click="removeExperience(index)"
                class="text-red-500 text-sm mt-2 hover:underline"
              >
                Xóa
              </button>
            </div>
            <button v-if="isEdit" @click="addExperience" class="text-blue-500 mt-3 hover:underline">
              + Thêm kinh nghiệm
            </button>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div>
        <!-- Personal Information -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-green-600">Thông tin cá nhân</h3>
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
                :placeholder="'Nhập ' + key"
              />
            </li>
          </ul>
        </div>

        <!-- Skills -->
        <div class="mb-6">
          <h3 class="text-lg font-bold text-green-600">Các kỹ năng</h3>
          <ul class="flex flex-wrap mt-2 space-x-2">
            <li
              v-for="(skill, index) in data.skills"
              :key="index"
              class="flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
            >
              <span v-if="!isEdit">{{ skill }}</span>
              <input
                v-else
                v-model="data.skills[index]"
                class="border rounded px-2 py-1"
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
            + Thêm kỹ năng
          </button>
        </div>
      </div>
    </div>
    <button
      v-if="isEditable"
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
})

function addEducation() {
  data.education.push({ school: '', major: '', year: '', grade: '' })
}

function removeEducation(index) {
  data.education.splice(index, 1)
}

function addExperience() {
  data.work_experience.push({ company: '', title: '', duration: '', details: [] })
}

function removeExperience(index) {
  data.work_experience.splice(index, 1)
}

function addSkill() {
  data.skills.push('')
}

function removeSkill(index) {
  data.skills.splice(index, 1)
}

async function downloadStyledPDF() {
  isEdit.value = false
  await nextTick()
  const element = document.querySelector('.bg-gray-50')
  const dataUrl = await domtoimage.toPng(element)
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth
  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save('Styled_CV.pdf')
}
</script>
