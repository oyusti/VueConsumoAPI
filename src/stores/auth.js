import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref({})
  const errors = ref({})
  const router = useRouter()

  /***********************Get authenticated user ****************************/
  async function getUser() {
    try {
      if (localStorage.getItem('token')) {
        const response = await axios.get('/api/v1/user', {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data) {
          user.value = response.data
        } else {
          router.push({ name: 'home' })
        }
      } else {
        user.value = null
      }
    } catch (error) {
      console.log(error)
    }
  }

  /***********************Login or Register user ****************************/
  async function authenticate(apiRoute, formData) {
    try {
      const response = await axios.post(`/api/v1/${apiRoute}`, {
        ...formData
      })
      if (response.data) {
        errors.value = {} // Clear errors
        localStorage.setItem('token', response.data.token) // Save token to local storage
        user.value = response.data.user // Save user to store
        console.log(user) // Log user
        router.push({ name: 'home' })
      }
      console.log(response)
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors // Save errors to store
        console.log(errors.value)
      }
      console.log(errors)
    }
  }

  /*********************** Logout user ****************************/
  async function logout() {
    try {
      const response = await axios.post(
        '/api/v1/logout',
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.status == 200) {
        console.log(response)
        localStorage.removeItem('token') // Remove token from local storage
        user.value = {} // Clear user from store
        errors.value = {} // Clear errors
        router.push({ name: 'home' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return { user, authenticate, errors, getUser, logout }
})
