import { SearchRequest } from 'paperback-extensions-common'
import {
    HomeSection,
    Manga,
    MangaTile,
    PagedResults,
    TagSection,
    Chapter,
} from 'paperback-extensions-common'
import { defineStore } from 'pinia'
import { LocationQueryValue } from 'vue-router'
import { MangaSource } from '../helpers/models'

export const MangaStore = defineStore('mangaStore', {
    state: () => ({
        isBusy: false,
        // sources: [] as MangaSource[],
        currentSource: {} as any,
        homeSections: [] as HomeSection[],
        MangaDetails: {} as Manga,
        MangaChapters: [] as Chapter[],
        currentSection: {} as HomeSection,
        sourceTags: {} as TagSection[],
        searchResults: {} as PagedResults,
        viewMore: [] as MangaTile[],
        pagedResults: {} as PagedResults,
        sources2: {} as any,
        currentQuery: {} as LocationQueryValue | LocationQueryValue[],
        pages: [] as string[],
    }),
})
