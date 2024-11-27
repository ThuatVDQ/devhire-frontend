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
          <div
            class="w-full h-56 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"
          >
            <span>Thumbnail</span>
          </div>

          <!-- <component
            class="w-full h-56 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 overflow-hidden"
            :is="template.component"
            :isEditable="isEditMode"
          /> -->
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
      @click.self="closePreview"
    >
      <div class="bg-white rounded-lg shadow-lg w-3/5 max-h-[90vh] p-6 relative overflow-y-auto">
        <component :is="selectedTemplate.component" :isEditable="isEditMode" />
      </div>
    </div>
  </div>
</template>
<script setup>
import CvTemplate from '@/components/TemplatesCV/elegant1.vue'
import CvTemplate2 from '@/components/TemplatesCV/basic.vue'
import CVTemplate3 from '@/components/TemplatesCV/modern1.vue'
import { ref } from 'vue'

const templates = [
  {
    id: 1,
    name: 'Template 1',
    component: CvTemplate
  },
  {
    id: 2,
    name: 'Template 2',
    component: CvTemplate2
  },
  {
    id: 3,
    name: 'Template 3',
    component: CVTemplate3
  },
  {
    id: 4,
    name: 'Template 1',
    component: CvTemplate
  },
  {
    id: 5,
    name: 'Template 2',
    component: CvTemplate2
  },
  {
    id: 6,
    name: 'Template 3',
    component: CVTemplate3
  }
]

let selectedTemplate = null
const showPreview = ref(false)
const isEditMode = ref(false)

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
  selectedTemplate = template
  isEditMode.value = true
  showPreview.value = true
}
</script>
