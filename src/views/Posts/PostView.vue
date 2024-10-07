<script setup>
import { ref, onMounted } from 'vue'
//import { inject } from 'vue' // inject axios
import PostModal from './PostModal.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

//const posts = ref([])
const isModalVisible = ref(false)
const editMode = ref()
const selectedPost = ref({})
const router = useRouter()

const postStore = usePostStore()
const authStore = useAuthStore()

onMounted(() => {
  postStore.getData()
})

/* const statusText = computed((post) => {
  return post.status == 1 ? 'Publicado' : 'Borrador'
}) */

function showModal(post = null) {
  if (authStore.user && Object.keys(authStore.user).length > 0) {
    if (post == null) {
      editMode.value = false
      selectedPost.value = {}
      isModalVisible.value = true
    } else {
      editMode.value = true
      selectedPost.value = post
      isModalVisible.value = true
    }
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Debes iniciar sesion para continuar',
      icon: 'error'
    })
    router.push({ name: 'login' })
  }
}

function deleteCategory(post) {
  Swal.fire({
    title: 'Esta seguro de eliminar el registro?',
    text: 'Esta accion no puede revertirse!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(selectedPost.value)
      ;(async () => {
        try {
          const response = await axios.delete('/api/v1/posts/' + post.id)
          console.log(response)
          Swal.fire({
            title: 'Eliminado!',
            text: 'Tu registro ha sido borrado.',
            icon: 'success'
          })
          postStore.getData()
        } catch (error) {
          console.error(error)
        }
      })()
    }
  })
}

/* getData() */
</script>

<template>
  <div class="shadow-md rounded-2xl bg-white w-4/5">
    <div class="flex justify-between bg-blue-400">
      <h1 class="text-3xl text-gray-700 font-semibold my-4 ml-8">Posts</h1>
      <button
        @click="showModal()"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 my-4 mr-8"
      >
        Nuevo
      </button>
      <PostModal
        v-model:editMode="editMode"
        v-model:isVisible="isModalVisible"
        v-model:postData="selectedPost"
        @updateList="postStore.getData"
      />
    </div>
    <table class="w-full text-sm text-center rtl:text-right text-gray-700 dark:text-gray-400">
      <thead
        class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3 font-semibold">Titulo</th>
          <th scope="col" class="px-6 py-3 font-semibold">Autor</th>
          <!--<th scope="col" class="px-6 py-3 font-semibold">Slug</th>
           
            <th scope="col" class="px-6 py-3 font-semibold">Categoria</th> -->
          <th scope="col" class="px-6 py-3 font-semibold">Estatus</th>
          <th scope="col" class="px-6 py-3 font-semibold">Fecha de creación</th>
          <th scope="col" class="px-6 py-3 font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody v-if="postStore.posts.length > 0">
        <tr
          v-for="post in postStore.posts"
          :key="post.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td class="px-6 py-4">
            {{ post.title }}
          </td>
          <td class="px-6 py-4">
            {{ post.user.name }}
          </td>
          <td class="px-6 py-4">
            {{ post.status == 1 ? 'Borrador' : 'Publicado' }}
          </td>
          <td class="px-6 py-4">
            {{ post.created_at }}
          </td>
          <td class="px-6 py-4">
            <button
              @click="showModal(post)"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Editar
            </button>
            <button
              @click="deleteCategory(post)"
              type="button"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
