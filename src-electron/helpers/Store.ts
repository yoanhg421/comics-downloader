import { MangaSource } from './../../src/helpers/models'
import { app } from 'electron'
import path from 'path'
import fs from '@supercharge/fs'



class Store {

    sourcesDir = path.join(app.getPath('userData'), 'MangaSources')
    path: string
    data: any

    constructor(opts: any) {

        this.path = path.join(this.sourcesDir, opts.storeFile + '.json');

        if (!fs.existsSync(this.path)) {
            fs.ensureFileSync(this.path)
            fs.writeJsonSync(this.path, {})

        }
        // fs.ensureFileSync(this.path)

        this.data = parseDataFile(this.path);

    }
    get(key: string) {
        return this.data[key]
    }

    set(key: string, val: any) {
        this.data[key] = val
        fs.writeJsonSync(this.path, this.data)
    }
    delete(key: string) {

        delete this.data[key]
        fs.writeJsonSync(this.path, this.data)
    }

    async allSources(): Promise<MangaSource[]> {
        const sources = await fs.readJson(this.path)

        return Object.values(sources)
    }

    getSourcePath(sourceId: string) {
        return path.join(this.sourcesDir, sourceId, 'source.js')
    }
}

// async function setupFiles(){

// }

function parseDataFile(filePath: string) {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
        const content = fs.readJsonSync(filePath)

        return content
    } catch (error) {
        // if there was some kind of error, return the passed in defaults instead.
        console.log(error)

    }
}


export const store = new Store({
    storeFile: 'installedSources',
    sourcesFile: 'sourcesArray'




})
