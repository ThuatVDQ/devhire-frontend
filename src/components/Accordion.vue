<script setup>
const props = defineProps({
  title: String,
  description: String,
  isOpen: Boolean
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="relative shadow dark:shadow-gray-700 rounded-md overflow-hidden mt-4">
    <h2 class="text-base font-medium">
      <button
        :class="{ 'text-emerald-500': isOpen, 'text-black': !isOpen }"
        class="flex justify-between items-center p-5 w-full font-medium text-left bg-gray-50 dark:bg-slate-800"
        @click="emit('toggle')"
      >
        <span>{{ title }}</span>
        <i
          :class="{ 'transform rotate-180': isOpen, 'transform rotate-0': !isOpen }"
          class="pi pi-chevron-down size-4 shrink-0 transition-transform"
        ></i>
      </button>
    </h2>
    <div v-show="isOpen">
      <div class="p-5">
        <p class="text-slate-400 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
