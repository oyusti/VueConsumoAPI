import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const usePostStore = defineStore('postStore', () => {
  //const user = ref({})
  const errors = ref({})
  const router = useRouter()
  const posts = ref([])

  const getData = async () => {
    //loading = true // Activar el loader
    await axios
      .get('/api/v1/posts?included=user')
      .then((response) => (posts.value = response.data.data))
  }

  async function createPost(formData) {
    try {
      if (localStorage.getItem('token')) {
        const response = await axios.post(
          '/api/v1/posts',
          {
            ...formData
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (response.data) {
          errors.value = null // Clear errors
          getData()
        }
      } else {
        router.push({ name: 'login' })
      }
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors // Save errors to store
        console.log(errors.value)
      }
    }
  }

  /* const createPost = async (formData) => {
    try {
      const response = await axios.post('/api/v1/posts', formData)
      if (response.data) {
        errors.value = [] // Clear errors
        getData()
      }
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors // Save errors to store
      }
    }
  } */

  return { errors, posts, getData, createPost }
})
