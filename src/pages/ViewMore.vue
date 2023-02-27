<template>
    <q-page padding>
        <p class="text-h6 text-center text-weight-bold">
            {{ route.query.title }}
        </p>
        <div class="row justify-center q-gutter-md">
            <MangaTileVue
                v-for="manga in store.viewMore"
                :key="manga.id"
                :manga="manga"
            />
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import MangaTileVue from '../components/MangaTile.vue'
import { MangaStore } from '../stores/manga-store'
import { useRoute } from 'vue-router'
import { cloneDeep } from 'lodash'

const store = MangaStore()
const route = useRoute()

const source = cloneDeep(store.currentSource)

//@ts-expect-error api
store.viewMore = await window.api.viewMore(route.params.section)
</script>
