<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ title }}</h2>

      <!-- Input Name -->
      <label class="block text-sm font-medium text-gray-600 mb-1">Category Name</label>
      <input
        v-model="category.name"
        type="text"
        class="w-full border rounded-lg p-2 text-gray-700 mb-4 focus:ring-2 focus:ring-blue-500"
        placeholder="Enter category name"
      />

      <!-- Buttons -->
      <div class="flex justify-end">
        <button
          @click="close"
          class="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          @click="save"
          class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean, // Hiển thị modal
  title: String, // Tiêu đề modal
  category: Object, // Đối tượng danh mục đang chỉnh sửa
  buttonText: String, // Nút lưu
  save: Function, // Hàm lưu dữ liệu
  close: Function // Hàm đóng modal
})
</script>
