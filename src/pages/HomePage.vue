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
import { HomeSection, TagSection } from 'paperback-extensions-common'
import HomeSectionVue from '../components/HomeSection.vue'
import { MangaStore } from '../stores/manga-store'

import { cloneDeep, isEmpty } from 'lodash'
import { watch, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import LoadingScreen from '../components/LoadingScreen.vue'
import { MangaSource } from '../helpers/models'

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

        //@ts-expect-error api
        const sectionsData: HomeSection[] = await api.getHomeSections(
            cloneDeep(store.currentSource)
        )

        // @ts-expect-error api
        const tagsData: TagSection[] = await api.getTags(
            cloneDeep(store.currentSource)
        )

        let prevId = ''
        store.homeSections = sectionsData.filter((section: HomeSection) => {
            if (section.id === prevId) return
            prevId = section.id
            return section
        })

        store.sourceTags = tagsData

        store.isBusy = false
    }
)
// onBeforeMount(() => {
//     store.isBusy = true
// })

// store.currentSource = store.sources[0]
//@ts-expect-error api
const sectionsData: HomeSection[] = await api.getHomeSections(
    cloneDeep(store.currentSource)
)

// @ts-expect-error api
const tagsData: TagSection[] = await api.getTags(cloneDeep(store.currentSource))

let prevId = ''
store.homeSections = sectionsData.filter((section: HomeSection) => {
    if (section.id === prevId) return
    prevId = section.id
    return section
})

store.sourceTags = tagsData
store.isBusy = false
console.log(tagsData)
</script>

<style lang="sass"></style>
