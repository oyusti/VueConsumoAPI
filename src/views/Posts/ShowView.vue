<script setup>
import { onMounted, ref } from 'vue'
import { usePostStore } from '@/stores/posts'
import { useRoute } from 'vue-router'

const postStore = usePostStore()
const route = useRoute()
const post = ref(null)

onMounted(async () => (post.value = await postStore.getPost(route.params.id)))
console.log(post)
</script>

<template>
  <main>
    <div v-if="post">
      <div>
        <h2>{{ post.title }}</h2>
      </div>
    </div>
    <div v-else>
      <h2>Page not Found</h2>
    </div>
  </main>
</template>
