<template>
    <div
        v-for="tagSection in store.sourceTags"
        :key="tagSection.id"
        class="q-mb-lg"
    >
        <q-item-label class="text-weight-bold q-pb-md">
            {{ tagSection.label }}
        </q-item-label>
        <div class="row">
            <q-chip
                v-for="tag in tagSection.tags"
                :key="tag.id"
                clickable
                @click="
                    router.push({
                        name: 'results',
                        query: { tagId: tag.id, tagLabel: tag.label },
                    })
                "
            >
                {{ tag.label }}
            </q-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MangaStore } from '../stores/manga-store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = MangaStore()

// console.log(store.sourceTags)
</script>

<style lang="scss" scoped></style>
