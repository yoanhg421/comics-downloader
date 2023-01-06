<template>
    <q-page class="q-pa-md">
        <q-infinite-scroll
            @load="onLoadId"
            :offset="0"
            :disable="scrollDisabled"
            scroll-target="#target"
        >
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                </div>
            </template>
            <p class="text-h6 text-center text-weight-bold">
                {{
                    route.query.title &&
                    route.query.author &&
                    route.query.taglabel
                }}
            </p>

            <div class="row target justify-center q-gutter-sm">
                <MangaTile
                    v-for="manga in store.pagedResults.results"
                    :key="manga.id"
                    :manga="manga"
                />
            </div>
        </q-infinite-scroll>
    </q-page>
</template>

<script setup lang="ts">
import MangaTile from '../components/MangaTile.vue'
import { MangaStore } from '../stores/manga-store'
import { useRoute } from 'vue-router'
import { PagedResults, SearchRequest, Tag } from 'paperback-extensions-common'
import { computed } from 'vue'
import { cloneDeep } from 'lodash'

const store = MangaStore()
const route = useRoute()

const source = cloneDeep(store.currentSource)

let query: SearchRequest = {
    title: undefined,
    parameters: {
        author: [],
    },
    includedTags: [],
}

const scrollDisabled = computed(() => {
    return store.pagedResults.metadata.manga.length <= 100
})

if (route.query.tagId && route.query.tagLabel) {
    console.log(route.query.tagId)
    query.includedTags?.push({
        id: route.query.tagId,
        label: route.query.taglabel,
    } as Tag)
}

if (route.query.title) {
    query.title = route.query.title as string
}
if (route.query.author) {
    query.parameters.author.push(route.query.author as string)
}
//@ts-expect-error api
const response: PagedResults = await api.searchRequest(source, query)
store.pagedResults = response

// console.log(store.searchResults)

function onLoadId(index, done) {
    // store.pagedResults.results.push(
    //     store.pagedResults.metadata.manga.splice(100, 100)
    // )

    if (store.pagedResults.metadata.manga.length > 100) {
        setTimeout(() => {
            // console.log(store.pagedResults.metadata.manga.splice(100, 100))
            store.pagedResults.results.push(
                ...store.pagedResults.metadata.manga.splice(100, 100)
            )
            done()
        }, 100)
    }
    console.log(store.pagedResults)
}
</script>

<style lang="scss" scoped></style>
