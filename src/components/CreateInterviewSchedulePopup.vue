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
            v-model="interviewDetails.interview_time"
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
            v-model="interviewDetails.duration_minutes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Location input or select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div class="space-y-2">
            <!-- Select box for predefined locations -->
            <select
              v-model="interviewDetails.location"
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
              v-if="interviewDetails.location === 'Other'"
              type="text"
              v-model="interviewDetails.customLocation"
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
            v-model="interviewDetails.note"
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
          v-if="interviewDetails.message === 'edit'"
          @click="editSchedule"
          class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          Save
        </button>

        <!-- Nút Create khi tạo mới -->
        <button
          v-else
          @click="emitConfirm"
          class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, nextTick, onMounted } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  isVisible: Boolean,
  interviewDetails: {
    type: Object,
    required: true
  }
})

const interviewDetails = ref({ ...props.interviewDetails })

watch(
  () => props.interviewDetails,
  (newValue) => {
    if (newValue && newValue.interview_time) {
      const localDate = new Date(newValue.interview_time)

      const year = localDate.getFullYear()
      const month = String(localDate.getMonth() + 1).padStart(2, '0')
      const day = String(localDate.getDate()).padStart(2, '0')
      const hour = String(localDate.getHours()).padStart(2, '0')
      const minute = String(localDate.getMinutes()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}T${hour}:${minute}`

      interviewDetails.value = {
        ...newValue,
        interview_time: formatted
      }
    } else {
      interviewDetails.value = { ...newValue }
    }
  },
  { immediate: true, deep: true }
)

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
              interviewDetails.value.interview_time = dateStr
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
  const location =
    interviewDetails.value.location === 'Other'
      ? interviewDetails.value.customLocation
      : interviewDetails.value.location
  emit('confirm', {
    ...interviewDetails.value,
    location // Gửi location là giá trị đã được xử lý
  })
}

function editSchedule() {
  // Nếu location là "Other", sẽ dùng giá trị customLocation
  const location =
    interviewDetails.value.location === 'Other'
      ? interviewDetails.value.customLocation
      : interviewDetails.value.location
  emit('edit', {
    ...interviewDetails.value,
    location // Gửi location là giá trị đã được xử lý
  })
}
</script>
