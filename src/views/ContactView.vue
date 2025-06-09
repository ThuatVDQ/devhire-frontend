<template>
  <section class="relative lg:py-24 py-16">
    <div class="container">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-7 md:col-span-6">
          <img src="@/assets/contact.svg" alt="Contact Us" />
        </div>
        <div class="lg:col-span-5 md:col-span-6">
          <div class="lg:ms-5">
            <div class="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
              <h3 class="mb-6 text-2xl leading-normal font-semibold">Get in touch !</h3>
              <form @submit.prevent="submitForm">
                <div class="grid lg:grid-cols-12 lg:gap-6">
                  <div class="lg:col-span-6 mb-5">
                    <label for="" class="font-semibold">Your Name: </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="form-input mt-2"
                      placeholder="Name: "
                    />
                  </div>
                  <div class="lg:col-span-6 mb-5">
                    <label for="" class="font-semibold">Your Email: </label>
                    <input
                      v-model="formData.email"
                      type="text"
                      class="form-input mt-2"
                      placeholder="Email: "
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1">
                  <div class="mb-5">
                    <label for="" class="font-semibold">Subject: </label>
                    <input
                      v-model="formData.subject"
                      type="text"
                      class="form-input mt-2"
                      placeholder="Subject: "
                    />
                  </div>
                  <div class="mb-5">
                    <label for="" class="font-semibold">Your Comment: </label>
                    <textarea
                      v-model="formData.content"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[100px]"
                      placeholder="Message: "
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  :disabled="!isFormValid"
                  class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isSubmitting"
      class="absolute inset-0 bg-gray-700 opacity-50 z-10 flex items-center justify-center"
    >
      <div class="flex items-center justify-center">
        <!-- Spinning Circle Loader -->
        <div
          class="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mr-2"
        ></div>
        <div class="text-white text-xl">Sending...</div>
      </div>
    </div>
    <div class="container lg:mt-24 mt-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-[30px]">
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-phone"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Phone</h5>
            <p class="text-slate-400 mt-3">
              The phrasal sequence of the is now so that many campaign and benefit
            </p>
            <div class="mt-5">
              <label
                for=""
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >+152 534-468-854</label
              >
            </div>
          </div>
        </div>
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-envelope"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Email</h5>
            <p class="text-slate-400 mt-3">
              The phrasal sequence of the is now so that many campaign and benefit
            </p>
            <div class="mt-5">
              <label
                for=""
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >contact@devhire.com</label
              >
            </div>
          </div>
        </div>
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-map-marker"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Location</h5>
            <p class="text-slate-400 mt-3">
              01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh, Việt Nam
            </p>
            <div class="mt-5">
              <a
                href="https://www.google.com/maps?q=01+Đ.+Võ+Văn+Ngân,+Linh+Chiểu,+Thủ+Đức,+Hồ+Chí+Minh,+Việt+Nam"
                target="_blank"
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >View on Google map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  content: ''
})
const isSubmitting = ref(false)

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isEmailValid = computed(() => {
  return emailRegex.test(formData.value.email)
})

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    formData.value.subject.trim() !== '' &&
    formData.value.content.trim() !== '' &&
    isEmailValid.value
  )
})

const submitForm = async () => {
  try {
    // Validate form data
    if (!isFormValid.value) {
      toastr.error('All fields are required.', 'Error')
      return
    }
    isSubmitting.value = true
    const response = await axios.post('http://localhost:8090/api/users/contact', formData.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      toastr.success('Your message has been sent successfully.', 'Success')
      // Clear form
      formData.value = { name: '', email: '', subject: '', content: '' }
    }
  } catch (error) {
    console.error(error)
    toastr.error('Failed to send message. Please try again later.', 'Error')
  } finally {
    isSubmitting.value = false // Reset submitting state
  }
}
</script>
