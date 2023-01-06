<template>
    <q-page>
        <q-img
            :src="store.MangaDetails.image ?? 'https://i.imgur.com/GYUxEX8.png'"
            fit="cover"
            height="900px"
            position="0 0"
        >
            <div
                class="absolute-full text-black column justify-end"
                style=""
            ></div>

            <template v-slot:error>
                <q-img
                    src="https://i.imgur.com/GYUxEX8.png"
                    fit="cover"
                    class=""
                    height="900px"
                    position="0 0"
                >
                    <div
                        class="absolute-full text-black column justify-end"
                        style=""
                    ></div>
                </q-img>
            </template>
        </q-img>

        <div class="manga-details">
            <div class="q-pa-lg">
                <p class="text-h4 text-weight-bold">
                    {{ store.MangaDetails.titles[0] }}
                </p>
                <div class="row items-end q-gutter-sm q-mb-md">
                    <div class="text-weight-bold text-body1">
                        {{ getStatusString }}
                    </div>

                    <q-icon name="person" size="sm" />
                    <span
                        @click="
                            getAuthorResults(store.MangaDetails.author ?? '')
                        "
                        >{{ store.MangaDetails.author }}</span
                    >
                </div>
                <p class="text-body1">{{ store.MangaDetails.desc }}</p>

                <div
                    v-if="store.MangaDetails.tags"
                    class="row q-pa-none q-ma-none"
                >
                    <q-chip
                        v-for="tag in (store.MangaDetails.tags![0].tags as Tag[])"
                        :key="tag.id"
                        clickable
                        @click="getTagResults(tag)"
                    >
                        {{ tag.label }}
                    </q-chip>
                </div>
            </div>

            <div class="q-pa-lg download-buttons bg-white">
                <p class="text-body1 text-weight-bold text-center">
                    Download Options
                </p>
                <div class="colum content-center">
                    <div class="row justify-around q-mb-md">
                        <div>
                            PDF
                            <q-toggle v-model="format" color="primary" />
                            CBZ
                        </div>
                        <div>
                            Download All
                            <q-toggle v-model="downloadRange" color="primary" />
                            Range Download
                        </div>
                    </div>
                    <div class="row justify-around q-pb-md">
                        <div
                            v-if="downloadRange"
                            class="row justify-between q-gutter-md"
                        >
                            <q-input
                                type="number"
                                v-model="rangeFrom"
                                min="1"
                                :max="store.MangaChapters.length - 1"
                                style="width: 100px"
                                label="From:"
                                dense
                            />
                            <q-input
                                type="number"
                                v-model="rangeTo"
                                min="2"
                                :max="store.MangaChapters.length"
                                style="width: 100px"
                                label="To:"
                                dense
                            />
                            <q-btn
                                label="Download"
                                @click="downloadRangeChapters"
                            ></q-btn>
                        </div>
                        <div v-else>
                            <q-btn
                                label="Download"
                                @click="downloadAllChapters"
                            ></q-btn>
                        </div>
                    </div>
                </div>
            </div>

            <q-list separator padding>
                <q-item
                    clickable
                    @click="downloadChapter(chapter)"
                    v-for="chapter in store.MangaChapters"
                    :key="chapter.id"
                >
                    <q-item-section>
                        <q-item-label overline
                            >Vol. {{ chapter.volume ?? 'unknown' }} Ch.
                            {{ chapter.chapNum ?? 'unknown' }}</q-item-label
                        >
                        <q-item-label caption>{{
                            chapter.langCode.toUpperCase()
                        }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        <q-item-label caption>{{
                            formatDistanceToNowStrict(chapter.time!)
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import { MangaStore } from '../stores/manga-store'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { DownloadRequest, MangaStatus } from '../helpers/models'
import { formatDistanceToNowStrict } from 'date-fns'
import { Chapter, ChapterDetails, Tag } from 'paperback-extensions-common'
import { clone, cloneDeep, slice } from 'lodash'

const store = MangaStore()
const route = useRoute()
const router = useRouter()

const format = ref(true)
const downloadRange = ref(false)

const rangeFrom = ref<number>(1)
const rangeTo = ref<number>(2)

const source = cloneDeep(store.currentSource)

const getStatusString = computed(() => {
    switch (store.MangaDetails.status) {
        case MangaStatus.ONGOING:
            return 'Ongoing'
        case MangaStatus.ABANDONED:
            return 'Abandoned'
        case MangaStatus.COMPLETED:
            return 'Completed'
        case MangaStatus.HIATUS:
            return 'Hiatus'
        default:
            return 'Unkown'
    }
})

function getTagResults(tag: Tag) {
    // console.log(tag)
    // let temp: Tag
    let finalTag: Tag | undefined

    store.sourceTags.find((cat) => {
        if (cat.label == store.MangaDetails.tags![0].label) {
            let temp = cat.tags.find((t) => t.label === tag.label)

            finalTag = temp
        }
    })
    // console.log(finalTag)

    if (finalTag != undefined) {
        router.push({
            name: 'results',
            query: { tagId: finalTag.id, tagLabel: finalTag.label },
        })
    }
}

function getAuthorResults(author: string) {
    router.push({
        name: 'results',
        query: {
            author,
        },
    })
}

console.log(route.query.mangaId)
//@ts-expect-error api
store.MangaDetails = await window.api.getMangaDetails(
    source,
    route.query.mangaId
)
//@ts-expect-error api
store.MangaChapters = await window.api.getMangaChapters(
    source,
    route.query.mangaId
)

console.log(store.MangaDetails)

async function downloadChapter(chapter: Chapter) {
    // @ts-expect-error api
    const chapterDetails: ChapterDetails[] = await api.getMangaChapterDetails(
        source,
        route.query.mangaId,
        [clone(chapter)]
    )

    sendDownloadRequest([chapter], chapterDetails)
}

async function downloadRangeChapters() {
    if (!store.MangaChapters) return

    const range: Chapter[] = slice(
        cloneDeep(store.MangaChapters),
        rangeFrom.value - 1,
        rangeTo.value
    )

    console.log(range)
    //@ts-expect-error api
    const chapterDetails: ChapterDetails[] = await api.getMangaChapterDetails(
        source,
        route.query.mangaId,
        range
    )

    //store.chapterDetails = chapterDetails

    sendDownloadRequest(range, chapterDetails)
}

async function downloadAllChapters() {
    if (!store.MangaChapters) return

    //@ts-expect-error api
    const chapterDetails: ChapterDetails[] = await api.getMangaChapterDetails(
        source,
        route.query.mangaId,
        cloneDeep(store.MangaChapters)
    )

    // store.chapterDetails = chapterDetails

    sendDownloadRequest(null, chapterDetails)
}

async function sendDownloadRequest(
    chapter: Chapter[] | null = null,
    chapterDetails: ChapterDetails[]
) {
    const options: DownloadRequest = {
        manga: cloneDeep(store.MangaDetails),
        chapters:
            chapter != null
                ? cloneDeep(chapter)
                : cloneDeep(store.MangaChapters),
        chapterDetails: cloneDeep(chapterDetails),
        cbr: format.value,
    }
    // @ts-expect-error api
    const data = await api.downloadChapter(source, options)
    console.log(data)
}
</script>

<style lang="sass">
.download-buttons
    position: sticky
    top: 3rem
    z-index: 100
    border-bottom: 2px solid $grey-4
.manga-details
    position: relative
    margin-top: -400px
.q-img__content > div
    background: rgb(2,0,36)
    background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 60%)
.chapter-input
    max-width: 3rem
</style>
