
import Stream from '@supercharge/streams'

import { app } from 'electron'
import axios from 'axios'
import fs from '@supercharge/fs'
import path from 'path'
import async from 'async'

import { store } from './Store'

const sourceName = 'source.js'
const versioning = 'versioning.json'
const sourcesDir = path.join(app.getPath('userData'), 'MangaSources')



export async function getSourceDetails(sourceId: string) {
    return store.get(sourceId)
}

export async function getInstalledSources() {
    return await store.allSources()
}


export async function installSource(baseUrl: string) {

    try {

        await fs.ensureDir(sourcesDir)
        const api = axios.create({
            baseURL: baseUrl
        })
        const response = await api.get(versioning)
        const json = response.data

        downloadSourceFiles(api, json)

        async.map(json.sources, (source => {

            store.set(source.id, source)

        }))

        return true
    } catch (err) {
        console.log(err)
        return false
    }


}

async function downloadSourceFiles(api: any, json: any) {
    await async.map(json.sources, async (source: any) => {


        try {
            const filePath = `${source.id}/${sourceName}`
            const iconPath = `${source.id}/includes/${source.icon}`
            const savePath = path.join(sourcesDir, filePath)
            const iconSavePath = path.join(sourcesDir, iconPath)

            await fs.ensureFile(iconSavePath)

            const response = await api.get(filePath)
            await fs.writeFile(savePath, response.data)

            const iconResponse = await api.get(iconPath, { responseType: 'stream' })
            await Stream(
                iconResponse.data
            ).into(fs.createWriteStream(iconSavePath))

            console.log(savePath)
            return Promise.resolve()
        }
        catch (err) {
            console.log(err)
            return Promise.reject()
        }

    })
}
async function deleteSource(sourceId) {
    const sourceDirPath = path.join(sourcesDir, sourceId)
    fs.removeDir(sourceDirPath)
    store.delete(sourceId)
}
