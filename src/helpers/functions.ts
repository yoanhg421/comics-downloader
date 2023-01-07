import { MangaStore } from './../stores/manga-store'

import { cloneDeep } from 'lodash'
import { HomeSection } from 'paperback-extensions-common'

const store = MangaStore()


export async function getSources() {
    //@ts-expect-error api
    const data = await api.getSources()
    // console.log(data)

    store.sources = data
}



export async function loadSource() {
    try {
        // @ts-expect-error api
        console.log(await api.loadSource(cloneDeep(store.currentSource)))
    } catch (error) { }
}

export async function getSectionsAndTags() {
    try {
        // @ts-expect-error api
        const tagsData: TagSection[] = await api.getTags(
        )

        store.sourceTags = tagsData
    } catch (error) { }

    try {
        //@ts-expect-error api
        const sectionsData: HomeSection[] = await api.getHomeSections(
        )
        let prevId = ''
        store.homeSections = sectionsData.filter((section: HomeSection) => {
            if (section.id === prevId) return
            prevId = section.id
            return section
        })
    } catch (error) { }
}
