<template>
    <div>
      <h1>Error Page</h1>
      <p>{{ errorMessage }}</p>
      <router-link to="/">Home</router-link>
    </div>
  </template>
<script setup>
import {
	ref,
    onMounted
} from 'vue';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const errorMessage = ref('')

onMounted(() => {
    errorMessage.value = route.query.errorMessage;
})

</script>