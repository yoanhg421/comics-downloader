<template>
    <Suspense>
        <router-view />
        <template #fallback>
            <LoadingScreen />
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import LoadingScreen from './components/LoadingScreen.vue'
</script>
