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
    return (
        store.pagedResults.metadata?.done ||
        store.pagedResults.metadata?.manga?.length <= 100
    )
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

try {
    if (store.currentQuery && store.currentQuery != route.query.tagId) {
        console.log(route.query)
        //@ts-expect-error api
        const response: PagedResults = await api.searchRequest(query)
        // console.log(response)
        store.pagedResults = response
        store.currentQuery = route.query.tagId
    }
} catch (error) {}

// console.log(store.searchResults)

async function onLoadId(index, done) {
    // store.pagedResults.results.push(
    //     store.pagedResults.metadata.manga.splice(100, 100)
    // )
    try {
        if (store.pagedResults.metadata.page) {
            const page = store.pagedResults.metadata?.page

            //@ts-expect-error api
            const response = await api.searchRequest(query, { page })
            if (response.results?.length == 0) {
                store.pagedResults.metadata.done = true
            } else {
                store.pagedResults.metadata.done = false

                store.pagedResults.results.push(...response.results)
                store.pagedResults.metadata = response.metadata
                console.log('********', response)
            }
            done()
        } else if (store.pagedResults.metadata?.manga?.length > 100) {
            setTimeout(() => {
                // console.log(store.pagedResults.metadata.manga.splice(100, 100))
                store.pagedResults.results.push(
                    ...store.pagedResults.metadata.manga.splice(100, 100)
                )
                done()
            }, 100)
        }
    } catch (error) {
        store.pagedResults.metadata.done = true
    }
    // console.log(store.pagedResults)
}
</script>

<style lang="scss" scoped></style>
