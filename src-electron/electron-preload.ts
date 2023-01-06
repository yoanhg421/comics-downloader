
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
    getHomeSections: () => ipcRenderer.invoke('get/sections'),
    loadSource: (sourceId: string) => ipcRenderer.invoke('changeSource', sourceId),
    getTags: () => ipcRenderer.invoke('getTags'),
    getMangaDetails: (mangaId: string) => ipcRenderer.invoke('get/details', mangaId),
    getMangaChapters: (mangaId: string) => ipcRenderer.invoke('get/chapters', mangaId),
    getMangaChapterDetails: (mangaId: string, chapterId: string) => ipcRenderer.invoke('get/chapter/details', mangaId, chapterId),
    downloadChapter: (data: DownloadRequest) => ipcRenderer.invoke('download/chapter', data),
    viewMore: (section: string) => ipcRenderer.invoke('view-more', section),
    searchRequest: (query: SearchRequest, metadata: any) => ipcRenderer.invoke('search', query, metadata),
    getSources: () => ipcRenderer.invoke('sources'),
    installSource: (baseUrl: string) => ipcRenderer.invoke('install-source', baseUrl),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)


