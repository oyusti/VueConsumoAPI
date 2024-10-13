import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const usePostStore = defineStore('postStore', () => {
  //const user = ref({})
  const errors = ref({})
  const router = useRouter()
  const posts = ref([])
  const categories = ref([])

  /***********************Get All Posts ****************************/
  const getData = async () => {
    try {
      const response = await axios.get('/api/v1/posts?included=user,category')
      posts.value = response.data.data
    } catch (error) {
      errors.value = error.response.data.errors
    }
  }

  /***********************Get a Post ****************************/
  const getPost = async (postId) => {
    try {
      const response = await axios.get(`/api/v1/posts/${postId}?included=user`)
      return response.data.data
    } catch (error) {
      errors.value = error.response.data.errors
    }
  }

  /*********************** Create a Post ****************************/
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
      }
    }
  }

  /*********************** Update a Post ****************************/
  async function updatePost(postId, formData) {
    try {
      const response = await axios.put(`/api/v1/posts/${postId}`, formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data) {
        errors.value = null
        getData()
      }
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors // Save errors to store
      }
    }
  }

  /*********************** Delete a Post ****************************/
  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`/api/v1/posts/${postId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data) {
        errors.value = null
        getData()
      }
    } catch (error) {
      if (error.response.status === 403) {
        errors.value = {
          status: 403,
          message: error.response.data.message
        }
      } else {
        errors.value = error.response.data.message
      }
    }
  }

  /*********************** Get all categories ****************************/
  const getCategories = async () => {
    try {
      const response = await axios.get('/api/v1/categories')
      if (response.data) {
        categories.value = response.data.data
      }
    } catch (error) {
      console.error('Error al obtener categorias: ', error)
    }
  }

  return {
    errors,
    posts,
    getData,
    createPost,
    updatePost,
    getPost,
    deletePost,
    getCategories,
    categories
  }
})
