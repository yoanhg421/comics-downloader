<template>
    <q-page v-if="store.isBusy">
        <LoadingScreen />
    </q-page>
    <q-page v-else class="q-pa-md">
        <div v-for="section in store.homeSections" :key="section.id">
            <HomeSectionVue v-if="section.items?.length" :section="section" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import HomeSectionVue from '../components/HomeSection.vue'
import { MangaStore } from '../stores/manga-store'

import { watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingScreen from '../components/LoadingScreen.vue'
import { MangaSource } from '../helpers/models'

import { loadSource, getSectionsAndTags } from '../helpers/functions'

const store = MangaStore()
const route = useRoute()

watch(
    () => route.params.sourceId,
    async function (old) {
        store.isBusy = true
        console.log(old)
        const result: MangaSource | undefined = store.sources.find(
            (source) => source.id == old
        )

        if (result != undefined) store.currentSource = result
        // console.log(source)
        await loadSource()

        await getSectionsAndTags()
        store.isBusy = false
    }
)

await loadSource()
await getSectionsAndTags()
</script>

<style lang="sass"></style>
