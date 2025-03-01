<template>
  <header class="mb-6">
    <h1 class="text-3xl font-semibold text-white bg-emerald-600 px-6 py-10">
      Categories Management
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
          placeholder="Search categories..."
          class="border rounded-xl p-2 pl-10 w-full text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchByKeyword"
          class="bg-emerald-600 text-white px-4 rounded-2xl ml-4 text-sm hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      <!-- Add Category Button -->
      <button
        @click="openAddCategoryModal"
        class="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-700 flex items-center"
      >
        <i class="pi pi-plus mr-2"></i> Add Category
      </button>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table v-if="categories.length" class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">ID</th>
            <th class="py-3 px-6">Name</th>
            <th class="py-3 px-6">Total Jobs</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-base">
          <tr
            v-for="category in categories"
            :key="category.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6">{{ category.id }}</td>
            <td
              class="py-3 px-6 cursor-pointer font-medium text-blue-600 hover:underline"
              @click="goToDetail(category.id)"
            >
              {{ category.name }}
            </td>
            <td class="py-3 px-6">{{ category.totalJob }}</td>
            <td class="py-3 px-6 text-center">
              <button
                @click="openEditCategoryModal(category)"
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
    <ModalCategory
      :show="showModal"
      :title="modalTitle"
      :category="currentCategory"
      :buttonText="modalButtonText"
      :save="saveCategory"
      :close="closeModal"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import ModalCategory from '@/components/ModalCategory.vue'

const categories = ref([])
const keyword = ref('')
const showModal = ref(false)
const modalTitle = ref('')
const modalButtonText = ref('')
const currentCategory = ref({ name: '' })
const isEditing = ref(false)

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/category', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
    categories.value = response.data
  } catch (error) {
    categories.value = []
    console.error('Error fetching categories:', error)
  }
}

const openAddCategoryModal = () => {
  isEditing.value = false
  currentCategory.value = { name: '' }
  modalTitle.value = 'Add New Category'
  modalButtonText.value = 'Add'
  showModal.value = true
}

const openEditCategoryModal = (category) => {
  isEditing.value = true
  currentCategory.value = { ...category }
  modalTitle.value = 'Edit Category'
  modalButtonText.value = 'Save'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = async () => {
  if (!currentCategory.value.name.trim()) {
    return toastr.info('Category name cannot be empty!')
  }

  try {
    const formData = new FormData()
    formData.append('category', currentCategory.value.name)

    if (isEditing.value) {
      await axios.post('http://localhost:8090/api/category/update', null, {
        params: {
          id: currentCategory.value.id,
          category: currentCategory.value.name
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Category updated successfully!')
    } else {
      await axios.post('http://localhost:8090/api/category/add', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toastr.success('Category added successfully!')
    }

    closeModal()
    fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    toastr.error('Failed to save category. Please try again!')
  }
}

onMounted(fetchCategories)
</script>
