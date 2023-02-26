<template>
    <div class="row justify-between">
        <p class="text-h6 text-weight-bold">{{ props.section.title }}</p>
        <div class="self-center">
            <q-btn
                v-if="props.section.view_more"
                flat
                rounded
                size="sm"
                label="View More"
                @click="viewMore()"
            />
        </div>
    </div>
    <div class="row q-mb-lg">
        <div class="col col-shrink self-center">
            <q-icon name="chevron_left" size="md" />
        </div>
        <div class="col">
            <q-scroll-area style="height: 16rem" :visible="false">
                <div class="row no-wrap q-gutter-md q-pa-sm">
                    <div v-for="manga in props.section.items" :key="manga.id">
                        <MangaTile :manga="manga" />
                    </div>
                </div>
            </q-scroll-area>
        </div>
        <div class="col col-shrink self-center">
            <q-icon name="chevron_right" size="md" />
        </div>
    </div>
</template>

<script lang="ts" setup>
// import { MangaStore } from '../stores/manga-store'
import MangaTile from '../components/MangaTile.vue'
import { useRouter } from 'vue-router'
// import { HomeSection } from 'paperback-extensions-common'
// import { cloneDeep } from 'lodash'

// const store = MangaStore()
const router = useRouter()

// const source = cloneDeep(store.currentSource)

const props = defineProps({
    section: {
        type: Object,
        required: true,
    },
})

async function viewMore() {
    router.push({
        name: 'more',
        query: { title: props.section.title },
        params: { section: props.section.id },
    })
}
</script>

<style lang="scss" scoped></style>
