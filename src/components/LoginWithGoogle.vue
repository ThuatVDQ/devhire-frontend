<template>
  <div>
    <!-- Button to trigger Google login -->
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  roleId: {
    type: Number,
    required: true
  }
})

const router = useRouter()

const loginWithGoogle = async () => {
  try {
    localStorage.setItem('role_id', props.roleId)
    const response = await axios.get('http://localhost:8090/api/users/auth/google')
    if (response.status === 200) {
      window.location.href = `${response.data}`
    }
  } catch (error) {
    console.error('Error triggering Google login', error)
  }
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const role_id = localStorage.getItem('role_id')
  localStorage.removeItem('role_id')
  if (code) {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/users/auth/google/callback?code=${code}&role_id=${role_id}`
      )
      if (response.status === 200) {
        console.log('User info:', response.data)
        localStorage.setItem('token', response.data.token)
        router.push('/')
      }
    } catch (error) {
      console.error('Error during Google login callback', error)
    }
  }
})
</script>
