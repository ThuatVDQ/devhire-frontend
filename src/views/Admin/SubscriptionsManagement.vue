<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">
      Subscriptions Management
    </h1>
  </header>

  <section class="p-6">
    <div class="flex justify-between mb-8">
      <!-- Search Input -->
      <div class="relative w-full max-w-lg flex">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          @keydown.enter="searchByKeyword"
          v-model="keyword"
          placeholder="Search subscriptions..."
          class="border rounded-xl p-2 pl-10 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchByKeyword"
          class="bg-emerald-600 text-white px-4 rounded-2xl ml-4 text-sm hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      <!-- Add Subscription Button -->
      <button
        @click="openAddSubscriptionModal"
        class="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-700 flex items-center"
      >
        <i class="pi pi-plus mr-2"></i> Add Subscription
      </button>
    </div>

    <!-- Subscriptions Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table v-if="subscriptions.length" class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th></th>
            <th class="py-3 px-6">ID</th>
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">Price</th>
            <th class="py-3 px-6">Duration (days)</th>
            <th class="py-3 px-6">Status</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-base">
          <tr
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="subscription.status === 'ACTIVE'"
                  @click="(e) => handleToggleClick(e, subscription.id)"
                  class="sr-only peer"
                />
                <div
                  class="w-10 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-500 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                ></div>
              </label>
            </td>
            <td class="py-3 px-6">{{ subscription.id }}</td>
            <td class="py-3 px-6">{{ subscription.name }}</td>
            <td class="py-3 px-6">${{ subscription.price }}</td>
            <td class="py-3 px-6">{{ subscription.duration }}</td>
            <td class="py-3 px-6">
              <span
                :class="
                  subscription.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-300 text-gray-700'
                "
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ subscription.status }}
              </span>
            </td>
            <td class="py-3 px-6 text-center flex gap-4 justify-center">
              <button
                @click="openEditSubscriptionModal(subscription)"
                class="text-blue-500 hover:text-blue-700"
              >
                <i class="pi pi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reusable Modal for Add/Edit -->
    <ModalSubscription
      :show="showModal"
      :title="modalTitle"
      :subscription="currentSubscription"
      :buttonText="modalButtonText"
      :save="saveSubscription"
      :close="closeModal"
    />
    <ConfirmationDialog
      v-if="showModalConfirmDialog"
      :isVisible="showModalConfirmDialog"
      :message="modalMessage"
      @confirm="confirmAction"
      @cancel="closeDialog"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import ModalSubscription from '@/components/ModalSubscription.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const subscriptions = ref([])
const keyword = ref('')
const showModal = ref(false)
const modalTitle = ref('')
const modalButtonText = ref('')
const currentSubscription = ref({ name: '', price: 0, benefit: '', description: '', amount: 0 })
const isEditing = ref(false)

const fetchSubscriptions = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/subscription', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
    subscriptions.value = response.data
  } catch (error) {
    subscriptions.value = []
    console.error('Error fetching subscriptions:', error)
  }
}

const openAddSubscriptionModal = () => {
  isEditing.value = false
  currentSubscription.value = { name: '', price: 0, benefit: '', description: '', amount: 0 }
  modalTitle.value = 'Add New Subscription'
  modalButtonText.value = 'Add'
  showModal.value = true
}

const openEditSubscriptionModal = (subscription) => {
  isEditing.value = true
  currentSubscription.value = { ...subscription }
  modalTitle.value = 'Edit Subscription'
  modalButtonText.value = 'Save'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveSubscription = async () => {
  if (!currentSubscription.value.name.trim()) {
    return toastr.info('Subscription name cannot be empty!')
  }

  try {
    if (isEditing.value) {
      await axios.post('http://localhost:8090/api/subscription/update', null, {
        params: currentSubscription.value,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Subscription updated successfully!')
    } else {
      await axios.post('http://localhost:8090/api/subscription/add', currentSubscription.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Subscription added successfully!')
    }
    closeModal()
    fetchSubscriptions()
  } catch (error) {
    toastr.error('Failed to save subscription.')
  }
}

const showModalConfirmDialog = ref(false)
const currentSubscriptionId = ref(null)
const modalMessage = ref('')

const handleToggleClick = (event, subscriptionId) => {
  event.preventDefault() // Ngăn checkbox tự động thay đổi trạng thái

  const subscription = subscriptions.value.find((sub) => sub.id === subscriptionId)

  if (!subscription) return

  // Nếu trạng thái là OPEN và người dùng muốn đóng
  if (subscription.status === 'ACTIVE') {
    currentSubscriptionId.value = subscriptionId
    modalMessage.value = `Are you sure you want to close this subscription?`
    showModalConfirmDialog.value = true
  } else {
    // Nếu trạng thái là CLOSED và người dùng muốn mở
    currentSubscriptionId.value = subscriptionId
    modalMessage.value = `Are you sure you want to open this subscription?`
    showModalConfirmDialog.value = true
  }
}

const closeDialog = () => {
  showModalConfirmDialog.value = false
  currentSubscriptionId.value = null
  modalMessage.value = ''
}

const confirmAction = async () => {
  if (!currentSubscriptionId.value) return

  try {
    const subscription = subscriptions.value.find((sub) => sub.id === currentSubscriptionId.value)
    if (!subscription) return

    if (subscription.status === 'ACTIVE') {
      // Nếu subscription đang ACTIVE, gọi API để vô hiệu hóa (CLOSED)
      await axios.post('http://localhost:8090/api/subscription/delete', null, {
        params: { id: currentSubscriptionId.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Subscription has been closed.')
    } else {
      // Nếu subscription đang CLOSED, gọi API để mở lại (ACTIVE)
      await axios.post('http://localhost:8090/api/subscription/active', null, {
        params: { id: currentSubscriptionId.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Subscription has been activated.')
    }

    fetchSubscriptions() // Cập nhật danh sách
  } catch (error) {
    toastr.error('Failed to update subscription status.')
  } finally {
    closeDialog()
  }
}

onMounted(fetchSubscriptions)
</script>
