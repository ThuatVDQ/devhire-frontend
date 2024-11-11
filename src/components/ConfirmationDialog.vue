<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-120 overflow-hidden">
      <!-- Đưa tiêu đề ra ngoài để màu nền tiêu đề chiếm toàn bộ chiều rộng -->
      <h2 class="text-xl font-semibold text-center text-white bg-emerald-500 p-4">{{ title }}</h2>

      <div class="p-6">
        <p class="text-gray-700 mb-6 text-center text-lg font-semibold">{{ message }}</p>

        <div class="flex justify-end space-x-4">
          <button @click="emitCancel" class="px-3 py-1 bg-gray-300 rounded-xl hover:bg-gray-400">
            Cancel
          </button>
          <button
            @click="emitConfirm"
            class="px-3 py-1 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function emitConfirm() {
  emit('confirm')
}

function emitCancel() {
  emit('cancel')
}
</script>
