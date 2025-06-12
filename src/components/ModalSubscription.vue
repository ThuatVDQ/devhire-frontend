<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-full flex flex-col"
      >
        <h2 class="text-2xl font-bold text-white bg-emerald-600 py-4 text-center">{{ title }}</h2>

        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Subscription Name</label>
            <input
              v-model="subscription.name"
              type="text"
              class="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500"
              :disabled="readOnly"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Benefit</label>
            <textarea
              v-model="subscription.benefit"
              :disabled="readOnly"
              class="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 resize-none min-h-[100px]"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Price ($)</label>
            <input
              v-model.number="subscription.price"
              type="number"
              class="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500"
              :disabled="readOnly"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="subscription.description"
              :disabled="readOnly"
              class="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 p-6 bg-gray-100">
          <button
            @click="close"
            class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            v-if="!readOnly"
            @click="save"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  show: Boolean,
  title: String,
  subscription: Object,
  buttonText: String,
  save: Function,
  close: Function,
  readOnly: {
    type: Boolean,
    default: false
  }
})
</script>
