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
                <q-icon name="add" size="sm" @click="prompt = true">
                    <q-dialog v-model="prompt" persistent>
                        <q-card style="min-width: 350px">
                            <q-card-section>
                                <div class="text-h6">Source URL</div>
                            </q-card-section>

                            <q-card-section class="q-pt-none">
                                <q-input
                                    dense
                                    v-model="sourceURL"
                                    autofocus
                                    @keyup.enter="installSource"
                                />
                            </q-card-section>

                            <q-card-actions align="right" class="text-primary">
                                <q-btn
                                    flat
                                    label="Cancel"
                                    v-close-popup
                                    @click="sourceURL = ''"
                                />
                                <q-btn
                                    flat
                                    label="Add Source"
                                    v-close-popup
                                    @click="installSource"
                                />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
                </q-icon>
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

const router = useRouter()

const searchField = ref('')
const tabs = ref(0)

const store = MangaStore()

const prompt = ref(false)
const sourceURL = ref('https://thenetsky.github.io/extensions-generic/nepnep')

//@ts-expect-error api
const data = await api.getSources()
console.log(data)

store.sources = data

console.log(store.sources)

async function installSource() {
    prompt.value = false
    //@ts-expect-error api
    const response = await api.installSource(sourceURL.value)
    console.log(response)
    sourceURL.value = ''
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
    router.push({ path: `/source/${store.currentSource.id}` })
    // router.push({ path: 'source/MangaLife' })
}
</script>
