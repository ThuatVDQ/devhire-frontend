<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-[32rem] max-w-full overflow-hidden">
      <!-- Header -->
      <h2 class="text-xl font-semibold text-white bg-indigo-600 p-4 text-center">
        Schedule Interview
      </h2>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Interview Time</label>
          <input
            ref="datetimeInput"
            type="text"
            v-model="form.interview_time"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Select date and time"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            min="1"
            max="480"
            v-model="form.duration_minutes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Location input or select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div class="space-y-2">
            <!-- Select box for predefined locations -->
            <select
              v-model="form.location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="In Person">In Person</option>
              <option value="Other">Other</option>
              <!-- Mục chọn "Khác" -->
            </select>
            <!-- Or Input for custom location when "Other" is selected -->
            <input
              v-if="form.location === 'Other'"
              type="text"
              v-model="form.customLocation"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter custom location"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea
            maxlength="1000"
            rows="4"
            v-model="form.note"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 flex justify-end space-x-3 bg-gray-50">
        <button
          @click="emitCancel"
          class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
        <button
          @click="emitConfirm"
          class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, nextTick } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  isVisible: Boolean
})

const form = ref({
  interview_time: '',
  duration_minutes: 30,
  location: 'Google Meet',
  customLocation: '',
  note: ''
})

const datetimeInput = ref(null)

// Khởi tạo flatpickr sau khi popup mở
watch(
  () => props.isVisible,
  (val) => {
    if (val) {
      nextTick(() => {
        if (datetimeInput.value) {
          flatpickr(datetimeInput.value, {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            minDate: 'today',
            time_24hr: true,
            defaultHour: 9,
            defaultMinute: 0,
            defaultSeconds: 0,
            onChange: function (selectedDates, dateStr, instance) {
              form.value.interview_time = dateStr
            }
          })
        }
      })
    }
  }
)

const emit = defineEmits(['confirm', 'cancel'])

function emitCancel() {
  emit('cancel')
}

function emitConfirm() {
  // Nếu location là "Other", sẽ dùng giá trị customLocation
  const location = form.value.location === 'Other' ? form.value.customLocation : form.value.location
  emit('confirm', {
    ...form.value,
    location // Gửi location là giá trị đã được xử lý
  })
}
</script>
