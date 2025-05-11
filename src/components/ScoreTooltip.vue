<template>
  <teleport to="body">
    <div
      v-if="visible && parsedContent"
      :style="{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 1000
      }"
      class="bg-white border border-gray-300 rounded-lg shadow-xl p-4 text-sm text-gray-800 w-64 transition-all duration-300"
    >
      <div v-for="(value, key) in parsedContent" :key="key" class="flex justify-between mb-1">
        <span class="font-medium capitalize">{{ formatKey(key) }}:</span>
        <span v-if="typeof value === 'number'">{{ value.toFixed(2) }}</span>
        <span v-else>{{ value }}</span>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  content: String,
  position: Object
})

// Parse JSON nếu content là chuỗi
const parsedContent = computed(() => {
  try {
    return typeof props.content === 'string' ? JSON.parse(props.content) : props.content
  } catch (err) {
    return null
  }
})

// Hàm format lại key cho dễ đọc
function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}
</script>
