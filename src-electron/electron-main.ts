

import { app, BrowserWindow, nativeTheme, ipcMain, Menu, session } from 'electron';
import path from 'path';
import os from 'os';

import cheerio from 'cheerio'

import { downloadfFiles } from './helpers/fileHandler'

import async from 'async'
import ProgressBar from 'electron-progressbar'
// import fs from 'node:fs/promises'
import { store } from './helpers/Store'

import playwright from 'playwright';







import { APIWrapper, Chapter, Source } from 'paperback-extensions-common'
// import { Mangasee } from './nepnep/Mangasee/Mangasee'
import { DownloadRequest } from '../interfaces/comics-downloader'
import { installSource, getInstalledSources } from './helpers/sourceHandler';


// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(
            path.join(app.getPath('userData'), 'DevTools Extensions')
        );
    }
} catch (_) { }

let mainWindow: BrowserWindow | undefined;


function createWindow() {
    /**
     * Initial window options
     */

    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
        // maxWidth: 600,
        // minWidth: 600,
        width: 720,
        maximizable: false,
        height: 800,
        useContentSize: true,

        webPreferences: {
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD ?? ''),
        },
    });




    mainWindow.loadURL(process.env.APP_URL ?? '');

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools();

    }
    // else {
    //     // we're on production; no access to devtools pls
    //     mainWindow.webContents.on('devtools-opened', () => {
    //         mainWindow?.webContents.closeDevTools();

    //     });
    // }




    mainWindow.on('closed', () => {
        mainWindow = undefined;
    });




}

app.whenReady().then(createWindow);



app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === undefined) {
        createWindow();
    }
});

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54'



// import { MangaLife, MangaLife, MangaLife, MangaLife, MangaLife } from './nepnep/MangaLife/MangaLife'

// Handle Source

// const source = new MangaLife(cheerio)
let source: Source

const wrapper = new APIWrapper()


// const dir = '/Users/yoanherrera/Projects/Node/nepnep'
// const sources = glob.sync(dir + '/**/*.js')
// const versioning = glob.sync(dir + '/**/*.json')
// console.log(sources)

function setUserAgent(baseUrl: string) {
    const filter = {
        urls: ['https://*/*', 'http://*/*'],
    };
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {

        const url = new URL(baseUrl);
        details.requestHeaders['Origin'] = url.origin;
        details.requestHeaders['Referer'] = url.origin;
        // details.requestHeaders['UserAgent'] = userAgent
        details.requestHeaders['User-Agent'] = userAgent

        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
}


async function loadSource(src: any) {


    setUserAgent(src.websiteBaseURL)

    const mangaSource: Source = await import(store.getSourcePath(src.id))
    const source = new mangaSource[src.id](cheerio)

    return source

}


ipcMain.handle('changeSource', async (_, sourceId) => {
    try {
        source = await loadSource(sourceId)
        return true
    } catch (err) {
        return false
    }
})


// const source = new sourceClass(cheerio)
ipcMain.handle('sources', async () => {
    return await getInstalledSources()

    // return JSON.parse(await fs.readFile(versioning[0], 'utf8'))
})

ipcMain.handle('get/sections', async () => {

    return await wrapper.getHomePageSections(source)
})
ipcMain.handle('get/details', async (_, mangaId) => {

    return await wrapper.getMangaDetails(source, mangaId)
})
ipcMain.handle('get/chapters', async (_, mangaId) => {

    return await wrapper.getChapters(source, mangaId)
})
ipcMain.handle('get/chapter/details', async (_, mangaId, chapters: Chapter[]) => {

    const progressBar = new ProgressBar({
        indeterminate: true,
        text: 'Getting Chapter Data ...',
        detail: 'Wait...',
    })


    const result = await async.mapLimit(
        chapters, 5, async (ch: Chapter) => {
            return await wrapper.getChapterDetails(source, mangaId, ch.id ?? 'unknown')
        })
    progressBar.setCompleted()
    console.log(result
    )
    return result
    // return await wrapper.getChapterDetails(source, mangaId, chapterId ?? 'unknown')
})
ipcMain.handle('search', async (_, query, metadata) => {

    return await wrapper.searchRequest(source, query, metadata)
})
ipcMain.handle('getTags', async () => {

    return await wrapper.getTags(source)
})

ipcMain.handle('download/chapter', async (_, data: DownloadRequest) => {
    return await downloadfFiles(data)
})

ipcMain.handle('view-more', async (_, section) => {

    return await wrapper.getViewMoreItems(source, section, undefined, 1)
})

ipcMain.handle('install-source', async (_, baseUrl) => {

    return await installSource(baseUrl)
})
