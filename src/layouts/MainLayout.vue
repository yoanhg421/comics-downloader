<template>
    <q-layout view="hHh lpR fFf">
        <q-header bordered class="bg-white text-black" height-hint="200">
            <q-toolbar>
                <!-- <q-toolbar-title> Comics Downloader </q-toolbar-title> -->
                <q-input
                    class="q-ma-sm col-grow"
                    rounded
                    outlined
                    dense
                    type="search"
                    color="grey-8"
                    v-model="searchField"
                    placeholder="search"
                    @keydown.enter="search"
                >
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn-dropdown flat no-caps rounded label="Tags">
                    <div class="q-pa-md">
                        <TagSection />
                    </div>
                </q-btn-dropdown>

                <q-btn flat round dense icon="settings" @click="openSettings" />
            </q-toolbar>

            <q-tabs align="left" v-model="tabs">
                <q-route-tab
                    v-for="source in store.sources"
                    :key="source.id"
                    :to="`/source/${source.id}`"
                    :label="source.name"
                />
            </q-tabs>
        </q-header>

        <q-page-container>
            <Suspense>
                <router-view />
                <template #fallback>
                    <LoadingScreen />
                </template>
            </Suspense>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TagSection from '../components/TagSection.vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import { useRouter } from 'vue-router'
import { MangaStore } from '../stores/manga-store'
import { getSources, loadSource } from '../helpers/functions'

const searchField = ref('')

const router = useRouter()

const tabs = ref(0)

const store = MangaStore()

// async function getSources(params:type) {
// 	//@ts-expect-error api
// 	const data = await api.getSources()
// 	// console.log(data)

// 	store.sources = data
// }
await getSources()

// console.log(store.sources)

function openSettings() {
    router.push({ name: 'settings' })
}

async function search() {
    // // @ts-expect-error
    // const response: PagedResults = await window.api.searchRequest(query)

    // store.searchResultMangas = response.results
    router.push({
        name: 'results',
        query: { title: searchField.value },
    })

    searchField.value = ''
}
if (store.sources.length > 0 && store.currentSource.id == undefined) {
    store.currentSource = store.sources[0]
    // const keys = Object.keys(store.sources)
    router.replace({ path: `/source/${store.currentSource.id}` })
    // router.push({ path: 'source/MangaLife' })
}
</script>
