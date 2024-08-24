<script setup>
import { ref, watch, watchEffect, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const categories = ref([])
const users = ref([])
const isToggled = ref('1')
const errors = ref(null)
const props = defineProps({
  isVisible: Boolean,
  editMode: Boolean,
  postData: Object
})

const formData = ref({
  title: '',
  slug: '',
  extract: '',
  body: '',
  status: '',
  user_id: null,
  category_id: null
})

// Observa los cambios en postData y actualiza formData
watchEffect(() => {
  if (props.editMode && props.postData) {
    console.log(props.postData)
    formData.value = { ...props.postData }
    formData.value.user_id = props.postData.user.id
    formData.value.category_id = props.postData.category.id
    if (props.postData.status === '2') {
      isToggled.value = true
    } else {
      isToggled.value = false
    }
  } else {
    formData.value = {
      title: '',
      slug: '',
      extract: '',
      body: '',
      status: '1',
      user_id: null,
      category_id: null
    }
  }
})

watch(
  () => formData.value.title,
  (newValue) => {
    // Actualiza formData.slug, reemplazando espacios por guiones
    formData.value.slug = newValue.replace(/\s+/g, '-')
  }
)

watch(isToggled, (newValue) => {
  formData.value.status = newValue ? 2 : 1
})

function defineAction() {
  if (props.editMode) {
    handleUpdate()
  } else {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/v1/posts', formData.value)
    console.log(response)
    Swal.fire({
      title: 'Excelente!',
      text: 'Tu post ha sido creado!',
      icon: 'success'
    })
    errors.value = null
    emit('updateList')
    closeModal()
  } catch (error) {
    console.error(error)
    errors.value = error.response.data.errors
    /* Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salio mal!'
    }) */
  }
}

const handleUpdate = async () => {
  try {
    const response = await axios.put('/api/v1/posts/' + formData.value.id, formData.value)
    console.log(response)
    Swal.fire({
      title: 'Excelente!',
      text: 'Su post ha sido actualizado!',
      icon: 'success'
    })
    errors.value = null
    emit('updateList')
    closeModal()
  } catch (error) {
    console.error(error)
    errors.value = error.response.data.errors
    /* Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salio mal!'
    }) */
  }
}

const emit = defineEmits(['update:isVisible', 'update:editMode', 'update:postData', 'updateList'])

const getCategory = async () => {
  //loading = true // Activar el loader
  await axios.get('/api/v1/categories').then((response) => (categories.value = response.data.data))
}

const getUsers = async () => {
  //loading = true // Activar el loader
  await axios.get('/api/v1/users').then((response) => (users.value = response.data.data))
}

function closeModal() {
  /* isVisible.value = false */
  emit('update:isVisible', false)
  emit('update:editMode', null)
  emit('update:postData', {})
}

onMounted(() => {
  getCategory()
  getUsers()
})
</script>

<template>
  <div
    class="fixed bg-gray-800 bg-opacity-80 top-20 bottom-0 left-0 right-0 grid place-items-center"
    v-if="isVisible"
  >
    <div class="bg-white relative text-black w-2/5 p-10 rounded-lg">
      <span
        class="absolute h-12 w-12 flex justify-center items-center top-0 right-0 text-5xl cursor-pointer"
        @click="closeModal"
        >&times;</span
      >
      <form @submit.prevent="defineAction()" class="max-w-md mx-auto">
        <h2 class="font-semibold text-3xl mb-8">
          {{ !editMode ? 'Nuevo Post' : 'Editar Post' }}
        </h2>

        <ul class="mb-5">
          <li v-if="errors" class="text-red-500">
            <ul>
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </ul>
          </li>
        </ul>

        <!-- <h2 v-else class="font-semibold text-3xl mb-8">Editar Categoria</h2> -->
        <div class="mb-5">
          <label
            for="title_post"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Titulo:</label
          >
          <input
            v-model="formData.title"
            type="text"
            id="title_post"
            placeholder="Escribe un titulo"
            class="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div class="mb-5">
          <label
            for="slug_post"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Slug:</label
          >
          <input
            v-model="formData.slug"
            type="text"
            id="slug_post"
            class="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            readonly
          />
        </div>

        <div class="mb-5">
          <label
            for="extract_post"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Resumen:</label
          >
          <textarea
            v-model="formData.extract"
            id="extract_post"
            rows="2"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe un breve extracto"
          ></textarea>
        </div>

        <div class="mb-5">
          <label
            for="body_post"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Contenido:</label
          >
          <textarea
            v-model="formData.body"
            id="body_post"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe contenido"
          ></textarea>
        </div>

        <div class="mb-5">
          <label for="users" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Autor:</label
          >
          <select
            v-model="formData.user_id"
            id="users"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled selected>Seleccione un autor</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="mb-5">
          <label
            for="categories"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Categorias:</label
          >
          <select
            v-model="formData.category_id"
            id="categories"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled selected>Seleccione una categoria</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="mb -5">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="isToggled" />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Publicado</span>
          </label>
        </div>

        <div class="flex justify-end mt-5">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {{ !editMode ? 'Crear' : 'Actualizar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
