
import { DownloadRequest } from '../interfaces/comics-downloader'
/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { SearchRequest } from 'paperback-extensions-common'

import { ipcRenderer, contextBridge } from 'electron'

const WINDOW_API = {
    getHomeSections: (source: any) => ipcRenderer.invoke('get/sections', source),
    getTags: (source: any) => ipcRenderer.invoke('getTags', source),
    getMangaDetails: (source: any, mangaId: string) => ipcRenderer.invoke('get/details', source, mangaId),
    getMangaChapters: (source: any, mangaId: string) => ipcRenderer.invoke('get/chapters', source, mangaId),
    getMangaChapterDetails: (source: any, mangaId: string, chapterId: string) => ipcRenderer.invoke('get/chapter/details', source, mangaId, chapterId),
    downloadChapter: (source: any, data: DownloadRequest) => ipcRenderer.invoke('download/chapter', source, data),
    viewMore: (source: any, section: string) => ipcRenderer.invoke('view-more', source, section),
    searchRequest: (source: any, query: SearchRequest, metadata: any) => ipcRenderer.invoke('search', source, query, metadata),
    getSources: () => ipcRenderer.invoke('sources'),
    installSource: (baseUrl: string) => ipcRenderer.invoke('install-source', baseUrl),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)


