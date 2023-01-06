<template>
    <q-card
        class="my-card"
        @click="
            router.push({
                name: 'details',
                query: { mangaId: props.manga.id },
            })
        "
    >
        <q-img
            class="manga-image"
            :src="props.manga.image ?? 'https://i.imgur.com/GYUxEX8.png'"
            fit="cover"
            position="0 0"
        >
            <template v-slot:error>
                <q-img
                    src="https://i.imgur.com/GYUxEX8.png"
                    fit="cover"
                    class=""
                    height="900px"
                    position="0 0"
                >
                </q-img>
            </template>
        </q-img>
    </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    manga: {
        type: Object,
        required: true,
    },
})
</script>
<style lang="sass">
.my-card .manga-image
    width: 10rem
    height: 15rem
</style>
