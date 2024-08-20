<script setup>
/* const isVisible = ref(false) */

import { ref, watch, watchEffect } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const props = defineProps({
  isVisible: Boolean,
  editMode: Boolean,
  categoryData: Object
})

//console.log(props.editMode)

const formData = ref({
  name: '',
  slug: ''
})

// Observa los cambios en categoryData y actualiza formData
watchEffect(() => {
  if (props.editMode && props.categoryData) {
    formData.value = { ...props.categoryData }
  } else {
    formData.value = { name: '', slug: '' }
  }
})

watch(
  () => formData.value.name,
  (newValue) => {
    // Actualiza formData.slug, reemplazando espacios por guiones
    formData.value.slug = newValue.replace(/\s+/g, '-')
  }
)

function defineAction() {
  if (props.editMode) {
    handleUpdate()
  } else {
    handleSubmit()
  }
}
const handleSubmit = async () => {
  try {
    const response = await axios.post('/v1/categories', formData.value)
    console.log(response)
    Swal.fire({
      title: 'Excelente!',
      text: 'Tu registro ha sido creado!',
      icon: 'success'
    })
    emit('updateList')
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

const handleUpdate = async () => {
  try {
    const response = await axios.put('/v1/categories/' + formData.value.id, formData.value)
    console.log(response)
    Swal.fire({
      title: 'Excelente!',
      text: 'Su registro ha sido actualizado!',
      icon: 'success'
    })
    emit('updateList')
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

const emit = defineEmits([
  'update:isVisible',
  'update:editMode',
  'update:categoryData',
  'updateList'
])

function closeModal() {
  /* isVisible.value = false */
  emit('update:isVisible', false)
  emit('update:editMode', null)
  emit('update:categoryData', {})
}
</script>

<template>
  <div class="fixed bg-gray-800 bg-opacity-80 inset-0 grid place-items-center" v-if="isVisible">
    <div class="bg-white relative text-black w-2/5 p-10 rounded-lg">
      <span
        class="absolute h-12 w-12 flex justify-center items-center top-0 right-0 text-5xl cursor-pointer"
        @click="closeModal"
        >&times;</span
      >

      <form @submit.prevent="defineAction()" class="max-w-md mx-auto">
        <h2 class="font-semibold text-3xl mb-8">
          {{ !editMode ? 'Nueva Categoria' : 'Editar Categoria' }}
        </h2>
        <!-- <h2 v-else class="font-semibold text-3xl mb-8">Editar Categoria</h2> -->
        <div class="mb-5">
          <label
            for="name_category"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Nombre:</label
          >
          <input
            v-model="formData.name"
            type="text"
            id="name_category"
            class="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div class="mb-5">
          <label
            for="slug_category"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Slug:</label
          >
          <input
            v-model="formData.slug"
            type="text"
            id="slug_category"
            class="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            readonly
          />
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {{ !editMode ? 'Crear' : 'Actualizar' }}
        </button>
      </form>
    </div>
  </div>
</template>
