<script setup>
import { ref, onMounted, computed, watch } from 'vue'
//import { inject } from 'vue' // inject axios
import CategoryModal from './CategoryModal.vue'
//import CategoryEditModal from './CategoryEditModal.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'

onMounted(() => {
  getData()
})

const categories = ref([])
const isModalVisible = ref(false)
const editMode = ref()
const selectedCategory = ref({})
const route = useRoute()
const router = useRouter()
const pagination_links = ref([])
const search = ref('')
//const isModalEditVisible = ref(false)

const page = computed(() => {
  return parseInt(route.query.page) || 1
})

function showModal(category = null) {
  if (category == null) {
    editMode.value = false
    selectedCategory.value = {}
    isModalVisible.value = true
  } else {
    editMode.value = true
    selectedCategory.value = category
    isModalVisible.value = true
  }
}

function changePage(url) {
  const page = url.split('page=')[1]
  router.replace({ query: { page: page } })
}

watch(page, () => {
  getData()
})

watch(search, () => {
  router.replace({ query: { page: 1 } })
  getData()
})

const getData = async () => {
  //loading = true // Activar el loader
  await axios
    .get('/v1/categories?perPage=7' + '&page=' + page.value + '&filter[name]=' + search.value)
    .then((response) => {
      categories.value = response.data.data
      pagination_links.value = response.data.meta.links
      console.log(pagination_links.value)
    })
}

function deleteCategory(category) {
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
      console.log(selectedCategory.value)
      ;(async () => {
        try {
          const response = await axios.delete('/v1/categories/' + category.id)
          console.log(response)
          Swal.fire({
            title: 'Eliminado!',
            text: 'Tu registro ha sido borrado.',
            icon: 'success'
          })
          getData()
        } catch (error) {
          console.error(error)
        }
      })()
    }
  })
}
</script>

<template>
  <div class="shadow-md rounded-2xl bg-white w-4/5">
    <div class="flex justify-between bg-blue-400 sticky top-0">
      <h1 class="text-3xl text-gray-700 font-semibold my-4 ml-8">Categorias</h1>
      <div>
        <input
          type="text"
          v-model="search"
          class="w-80 h-10 mt-4 me-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-800"
          placeholder="Buscar..."
        />
        <button
          @click="showModal()"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 my-4 mr-8"
        >
          Nuevo
        </button>
      </div>
      <CategoryModal
        v-model:editMode="editMode"
        v-model:isVisible="isModalVisible"
        v-model:categoryData="selectedCategory"
        @updateList="getData"
      />
    </div>
    <table class="w-full text-sm text-center rtl:text-right text-gray-700 dark:text-gray-400 mb-12">
      <thead
        class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3 font-semibold">Id</th>
          <th scope="col" class="px-6 py-3 font-semibold">Nombre</th>
          <th scope="col" class="px-6 py-3 font-semibold">Slug</th>
          <th scope="col" class="px-6 py-3 font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td class="px-6 py-4">
            {{ category.id }}
          </td>
          <td class="px-6 py-4">
            {{ category.name }}
          </td>
          <td class="px-6 py-4">
            {{ category.slug }}
          </td>
          <td class="px-6 py-4">
            <button
              @click="showModal(category)"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Editar
            </button>
            <button
              @click="deleteCategory(category)"
              type="button"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-center mb-12">
      <nav aria-label="Page navigation example">
        <ul class="inline-flex -space-x-px text-sm">
          <li v-for="(pagination_link, key) in pagination_links" :key="key">
            <a
              @click="changePage(pagination_link.url)"
              class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-700 border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
              :class="{
                'pointer-events-none text-gray-200': pagination_link.url == null,
                'bg-blue-500 text-white pointer-events-none': pagination_link.active == true
              }"
              v-html="pagination_link.label"
            ></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
