<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
  >
    <!-- Popup container -->
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-in-out scale-100"
    >
      <!-- Full-width header with background color -->
      <div class="bg-emerald-600 rounded-t-lg">
        <h3 class="text-2xl font-semibold text-center text-white px-4 py-3">
          Select and Edit Email Template
        </h3>
      </div>

      <!-- Popup content with padding -->
      <div class="p-6">
        <!-- Radio buttons for each template with styling -->
        <div v-for="template in templates" :key="template.id" class="mb-4">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              :id="`template-${template.id}`"
              :value="template.id"
              v-model="selectedTemplateId"
              class="form-radio h-5 w-5 text-green-600 transition duration-150 ease-in-out"
            />
            <span class="text-gray-700 font-medium">{{ template.summary }}</span>
          </label>
        </div>

        <!-- Editable Subject and Body with input styling -->
        <div v-if="selectedTemplateId" class="mt-4">
          <label class="block text-gray-700 font-semibold mb-2">Subject:</label>
          <input
            type="text"
            v-model="editableSubject"
            class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
            placeholder="Enter email subject"
          />

          <label class="block mt-2 text-gray-700 font-semibold mb-2">Body:</label>
          <textarea
            v-model="editableBody"
            class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 h-40 overflow-y-auto"
            placeholder="Enter email body"
          ></textarea>
        </div>

        <!-- Accept and Cancel buttons with hover and focus effects -->
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="confirmSelection"
            :disabled="!selectedTemplateId"
            class="px-5 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-green-400 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
          >
            Accept
          </button>
          <button
            @click="closePopup"
            class="px-5 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted } from 'vue'
import { emailTemplates } from '@/data/emailTemplates.js'

const props = defineProps({
  application: Object // Nhận `application` từ component cha
})

const emit = defineEmits(['templateSelected', 'close'])

const selectedTemplateId = ref(null)
const templates = ref([])

// Thực hiện khi `application` có giá trị
watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      templates.value = emailTemplates.map((template) => {
        const candidateName = newApplication.full_name || ''
        const jobTitle = newApplication.job_title || ''

        return {
          ...template,
          summary: (template.subject || '')
            .split(':')[0] // Tạo `summary` từ `subject`
            .replace('{candidateName}', candidateName)
            .replace('{jobTitle}', jobTitle)
            .replace('at [Company Name]', ''),
          subject: (template.subject || '')
            .replace('{candidateName}', candidateName)
            .replace('{jobTitle}', jobTitle),
          body: (template.body || '')
            .replace('{candidateName}', candidateName)
            .replace('{jobTitle}', jobTitle)
        }
      })
    }
  },
  { immediate: true } // Thực hiện ngay khi `application` có giá trị
)

const selectedTemplate = computed(() =>
  templates.value.find((template) => template.id === selectedTemplateId.value)
)

// Editable fields for subject and body
const editableSubject = ref('')
const editableBody = ref('')

// Watch selectedTemplateId để thay thế placeholder khi template thay đổi
watch(selectedTemplateId, (newId) => {
  const template = templates.value.find((t) => t.id === newId)
  if (template && props.application) {
    // Thay thế placeholder bằng thông tin từ `application`
    editableSubject.value = template.subject
      .replace('{candidateName}', props.application.full_name || '')
      .replace('{jobTitle}', props.application.job_title || '')

    editableBody.value = template.body
      .replace('{candidateName}', props.application.full_name || '')
      .replace('{jobTitle}', props.application.job_title || '')
  }
})

// Đóng popup và đặt lại các trường nhập liệu
function closePopup() {
  emit('close')
  selectedTemplateId.value = null
  editableSubject.value = ''
  editableBody.value = ''
}

// Xác nhận template đã chọn và gửi nội dung đã thay thế cho component cha
function confirmSelection() {
  emit('templateSelected', {
    id: selectedTemplateId.value,
    subject: editableSubject.value,
    body: editableBody.value
  })
  closePopup()
}
</script>
