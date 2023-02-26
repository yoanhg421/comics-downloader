<template>
    <q-page v-if="store.isBusy">
        <LoadingScreen />
    </q-page>
    <q-page v-else class="q-pa-md">
        <div class="row justify-end">
            <q-btn-dropdown flat no-caps rounded label="Tags">
                <div class="q-pa-md">
                    <TagSection :source-id="props.sourceId" />
                </div>
            </q-btn-dropdown>
        </div>
        <div
            v-for="section in store.sources2[props.sourceId].homeSections"
            :key="section.id"
        >
            <HomeSectionVue v-if="section.items?.length" :section="section" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import HomeSectionVue from '../components/HomeSection.vue'
import { MangaStore } from '../stores/manga-store'
import TagSection from '../components/TagSection.vue'

import { watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingScreen from '../components/LoadingScreen.vue'
import { MangaSource } from '../helpers/models'

import { loadSource, getSectionsAndTags } from '../helpers/functions'

// const jsonData = 'file://MangaSources/MangaLife/source.js'

// const imageData = 'file://MangaSources/MangaLife/includes/icon.png'

// const resp = await axios.get(jsonData)
// console.log(resp.data)

// const mangaSource = await import(
//     'https://thenetsky.github.io/extensions-generic/nepnep/MangaLife/source.js'
// )
const props = defineProps({
    sourceId: {
        type: String,
        required: true,
    },
})
console.log(props.sourceId)
const store = MangaStore()
const route = useRoute()

watch(
    () => route.params.sourceId,
    async function (old) {
        store.isBusy = true
        console.log(old)
        const result: MangaSource | undefined = store.sources2[props.sourceId]

        if (result != undefined) store.currentSource = result
        // console.log(source)
        await loadSource()

        await getSectionsAndTags(props.sourceId)
        store.isBusy = false
    }
)

await loadSource()
await getSectionsAndTags(props.sourceId)
</script>

<style lang="sass"></style>
