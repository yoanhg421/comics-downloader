<template>
    <q-layout view="hHh Lpr fFf">
        <!-- Be sure to play with the Layout demo on docs -->

        <!-- (Optional) The Header -->
        <q-header bordered class="bg-white text-black" height-hint="200">
            <q-toolbar>
                <q-btn
                    flat
                    rounded
                    icon="chevron_left"
                    @click="$router.back()"
                    label="Back"
                />
            </q-toolbar>
        </q-header>

        <q-page-container>
            <!-- This is where pages get injected -->
            <Suspense>
                <router-view />
                <template #fallback>
                    <LoadingScreen />
                </template>
            </Suspense>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import LoadingScreen from '../components/LoadingScreen.vue'
</script>
