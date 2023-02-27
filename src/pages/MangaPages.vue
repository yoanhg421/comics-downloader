<template>
    <q-img v-for="page in store.pages" :key="page" :src="page" loading="lazy" />
</template>
<script setup lang="ts">
import { MangaStore } from '../stores/manga-store'
const store = MangaStore()
</script>
