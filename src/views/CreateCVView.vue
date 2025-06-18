<template>
  <div class="relative">
    <img
      src="@/assets/header-template-cv.png"
      alt="Header Image"
      class="w-full h-60 object-cover"
    />
    <div
      class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white"
    ></div>
  </div>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">List Templates</h1>
    <div class="grid grid-cols-3 gap-6">
      <!-- Loop through templates -->
      <div
        v-for="template in templates"
        :key="template.id"
        class="relative bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
      >
        <div>
          <!-- Template Name -->
          <h2 class="text-lg font-semibold text-gray-700 mb-2">{{ template.name }}</h2>
          <!-- Thumbnail -->
          <!-- <div
            class="w-full h-56 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"
          >
            <span>Thumbnail</span>
          </div> -->

          <div
            class="w-full h-auto bg-gray-100 rounded-md flex items-center justify-center text-gray-400"
          >
            <img
              :src="template.thumbnail"
              alt="Template Thumbnail"
              class="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        <!-- Hover Options -->
        <div
          class="absolute inset-0 bg-gray-900 bg-opacity-75 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <div class="flex space-x-4">
            <button
              @click="previewTemplate(template)"
              class="bg-blue-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600"
            >
              Preview
            </button>
            <button
              @click="useTemplate(template)"
              class="bg-green-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-600"
            >
              Use
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Preview -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto"
      @click.self="closePreview"
    >
      <div class="bg-white rounded-lg shadow-lg w-3/5 max-h-[90vh] p-6 relative overflow-y-auto">
        <component
          :is="selectedTemplate.component"
          :isEditable="isEditMode"
          @download="onDownloadCV"
          @save="onSaveCV"
        />
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-2xl w-1/4">
        <h3
          class="text-xl text-white font-semibold py-4 text-center bg-emerald-700 rounded-tl-2xl rounded-tr-2xl"
        >
          Enter CV Name
        </h3>
        <div class="p-4">
          <input
            v-model="cvName"
            type="text"
            placeholder="Enter CV name"
            class="border border-gray-500 rounded-xl px-4 py-2 w-full mb-4"
          />
          <div class="flex justify-end space-x-2 text-sm">
            <button
              v-if="!isUpload"
              @click="showModal = false"
              class="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 ml-2"
            >
              Cancel
            </button>
            <button
              @click="saveCV"
              :disabled="isUpload"
              class="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700"
              :class="{ 'bg-gray-400 hover:bg-gray-400': isUpload }"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import CvTemplate from '@/components/TemplatesCV/elegant1.vue'
import CvTemplate2 from '@/components/TemplatesCV/basic.vue'
import CVTemplate3 from '@/components/TemplatesCV/modern1.vue'
import CVTemplate4 from '@/components/TemplatesCV/professional1.vue'
import CVTemplate5 from '@/components/TemplatesCV/professional2.vue'
import basic1 from '@/assets/thumbnails/1.png'
import basic2 from '@/assets/thumbnails/2.png'
import elegant1 from '@/assets/thumbnails/3.png'
import professional1 from '@/assets/thumbnails/4.png'
import professional2 from '@/assets/thumbnails/5.png'
import html2canvas from 'html2canvas'
import { ref, reactive } from 'vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

const templates = [
  {
    id: 1,
    name: 'Basic 1',
    component: CvTemplate,
    thumbnail: basic1
  },
  {
    id: 2,
    name: 'Basic 2',
    component: CvTemplate2,
    thumbnail: basic2
  },
  {
    id: 3,
    name: 'Elegant 1',
    component: CVTemplate3,
    thumbnail: elegant1
  },
  {
    id: 4,
    name: 'Professional 1',
    component: CVTemplate4,
    thumbnail: professional1
  },
  {
    id: 5,
    name: 'Professional 2',
    component: CVTemplate5,
    thumbnail: professional2
  }
]

let selectedTemplate = null
const showPreview = ref(false)
const isEditMode = ref(false)

const isUpload = ref(false)
const showModal = ref(false)
const cvName = ref('')
const file = ref(null)

function previewTemplate(template) {
  selectedTemplate = template
  console.log(selectedTemplate.component)
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
  isEditMode.value = false
}

function useTemplate(template) {
  const token = localStorage.getItem('token')
  if (template.id === 1 || template.id === 2) {
    selectedTemplate = template
    isEditMode.value = true
    showPreview.value = true
  } else {
    if (token) {
      selectedTemplate = template
      isEditMode.value = true
      showPreview.value = true
    } else {
      toastr.info('Please login to use this template', 'Error')
    }
  }
}

function onDownloadCV(data) {
  try {
    console.log(data)
    const fileName = `CV_${data.name}.pdf` // Use the user's name for the file name
    data.file.save(fileName) // Trigger the download
  } catch (error) {
    console.error('Error downloading CV:', error)
  }
}

function onSaveCV(data) {
  if (`Bearer ${localStorage.getItem('token')}` == 'Bearer null') {
    toastr.info('Please login to save CV') // Show an error message if the user is not logged in
    return
  }
  showModal.value = true
  file.value = data.file.output('blob')
}

function saveCV() {
  isUpload.value = true
  try {
    if (cvName.value == '') {
      toastr.error('Please enter a CV name', 'Error') // Show an error message if the CV name is empty
      return
    }

    // Get the PDF as a blob

    const formData = new FormData()
    formData.append('file', file.value, 'CV.pdf') // Add the generated PDF
    formData.append('name', cvName.value) // Attach user ID

    // Send the PDF to the backend to save it
    const response = axios.post(`${API_URL}/cv/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    toastr.success('CV saved successfully', 'Success')
    showModal.value = false
    isUpload.value = false
    showPreview.value = false
  } catch (error) {
    toastr.error('Failed to save CV', 'Error')
    console.error('Error saving CV:', error)
  } finally {
    isUpload.value = false
  }
}
</script>
