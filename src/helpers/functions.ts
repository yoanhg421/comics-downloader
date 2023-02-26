import { MangaStore } from './../stores/manga-store'

import { cloneDeep } from 'lodash'
import { HomeSection, TagSection } from 'paperback-extensions-common'
import { MangaSource } from './models'
import { da } from 'date-fns/locale'

const store = MangaStore()

export async function getSources() {
    //@ts-expect-error api
    const resp: MangaSource[] = await api.getSources()
    // console.log(data)
    const data = {}

    resp.forEach((source) => {
        data[source.id] = source
    })

    // console.log(obj)

    // store.sources = resp
    store.sources2 = data
}

export async function loadSource() {
    try {
        // @ts-expect-error api
        console.log(await api.loadSource(cloneDeep(store.currentSource)))
    } catch (error) {}
}

export async function getSectionsAndTags(sourceId: string) {
    try {
        if (!store.sources2[sourceId].tagsData) {
            // @ts-expect-error api
            store.sources2[sourceId].tagsData = await api.getTags()
        }

        // const tagsData: TagSection[] =
        //     // @ts-expect-error api
        //     store.sources2[sourceId].tagsData ?? (await api.getTags())

        // store.sourceTags = tagsData
    } catch (error) {}

    try {
        if (!store.sources2[sourceId].homeSections) {
            // store.homeSections = store.sources2[sourceId].tagsData
            // @ts-expect-error api
            const sectionsData: HomeSection[] = await api.getHomeSections()
            let prevId = ''
            store.sources2[sourceId].homeSections = sectionsData.filter(
                (section: HomeSection) => {
                    if (section.id === prevId) return
                    prevId = section.id
                    return section
                }
            )
        } else {
        }
        // const sectionsData: HomeSection[] =
        //     //@ts-expect-error api
        //     store.sources2[sourceId].tagsData ?? (await api.getHomeSections())
        // let prevId = ''
        // store.homeSections = sectionsData.filter((section: HomeSection) => {
        //     if (section.id === prevId) return
        //     prevId = section.id
        //     return section
        // })
    } catch (error) {}
}
