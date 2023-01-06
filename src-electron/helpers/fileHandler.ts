import fs from '@supercharge/fs'
import fsp from 'fs/promises'
import zipper from 'zip-local'

import async from 'async'
import axios from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'

import ProgressBar from 'electron-progressbar'

import { pipeline } from 'stream/promises'

import path from 'path'

import glob from 'glob'

import imgToPDF from 'image-to-pdf'
import { DownloadRequest } from '../../interfaces/comics-downloader'
import _ from 'lodash'
import { shell } from 'electron'


// export async function loadSources(sourcesFolder: string) {
//     const sources = glob.sync(sourcesFolder + '/**/*.js')
//     console.log(sources)
// }

let progressBar: ProgressBar;

export async function getChapterDetails(callback: CallableFunction) {


    await async.eachSeries(
        [1, 2, 3], async (ch) => {
            await callback(ch)
        })


}


export async function downloadfFiles(data: DownloadRequest) {
    const tempDir = await fs.tempDir()
    console.log('*******', tempDir)
    //console.log('*******', data)


    const downloadDir = path.join(fs.homeDir('Downloads'), 'Comics')

    const tempSavePath = path.join(tempDir, data.manga.titles[0])


    const lastChapter = _.last(data.chapters)

    //console.log(data.chapters)




    let nameString: string

    if (data.chapters.length == 1) {
        nameString = `${data.manga.titles[0]}_Vol_${data.chapters[0].volume ?? 'unknown'}_Chapter_${data.chapters[0].chapNum ?? 'unknown'}  - ${data.manga.author}`
    } else {
        nameString = `${data.manga.titles[0]}_Vol_${data.chapters[0].volume ?? 'unknown'}_${lastChapter?.volume ?? 'unknown'}_Chapter_${data.chapters[0].chapNum ?? 'unknown'}_${lastChapter!.chapNum ?? 'unknown'}  - ${data.manga.author}`
    }




    await fs.ensureDir(downloadDir)
    await fs.ensureDir(tempSavePath)


    //Progress Bar
    progressBar = new ProgressBar({
        indeterminate: false,
        text: 'Preparing data...',
        detail: 'Wait...',
        maxValue: data.chapters.length == 1 ? data.chapterDetails[0].pages.length : data.chapterDetails.length,
    })

    progressBar
        .on('completed', function () {
            console.info('completed...')
            progressBar.detail = 'Download completed. Exiting...'
        })
        .on('aborted', function (value: string) {
            console.info(`aborted... ${value}`)
        })
        .on('progress', function (value: string) {
            progressBar.detail = `Downloading ${data.chapters.length == 1 ? 'pages' : 'chapters'} ${value} out of ${progressBar.getOptions().maxValue}...`
        })

    // Promise

    await async.eachSeries(data.chapters, async (chapter) => {
        const chapterIndex = data.chapters.indexOf(chapter)

        const subDir = path.join(tempSavePath, `Volume - ${chapter?.volume ?? 'unknown'}`, `Chapter - ${chapter?.chapNum ?? 'unknown'}`)

        await fs.ensureDir(subDir)

        if (data.chapters.length > 1)
            progressBar.value += 1

        await async.mapLimit(
            data.chapterDetails[chapterIndex].pages,
            10,
            async (page: string) => {
                const imageName = page.split('/').pop() ?? ''
                const imagePath = path.join(subDir, imageName)

                const writer = fs.createWriteStream(imagePath)
                try {
                    axiosRetry(axios, { retries: 5, retryDelay: exponentialDelay })
                    const resp = await axios.get(page, {
                        responseType: 'stream'
                    })
                    await pipeline(resp.data, writer)
                } catch (err) {
                    console.log(err)
                    // progressBar.close()
                    // return Promise.reject(err)

                }
                if (data.chapters.length == 1)
                    progressBar.value += 1
                return Promise.resolve(true)
            })

    })


    //Progress Bar
    progressBar = new ProgressBar({
        indeterminate: true,
        text: 'Compressing Files..',
        detail: 'Wait...',

    })
    console.log(tempDir)
    if (data.cbr)
        await generateCBR(
            tempSavePath,
            path.join(downloadDir, `${nameString}.cbz`)
        )
    else
        await generatePDF(
            tempSavePath,
            path.join(downloadDir, `${nameString}.pdf`)
        )

    await fs.removeDir(tempDir)

    shell.openPath(downloadDir)

    return true
}

export async function generatePDF(tempSaveDir: string, savePath: string) {


    const pages: Buffer[] = []

    const files = glob.sync(tempSaveDir + '/**/*.@(jpg|jpeg|png)')

    for (const file of files) {
        const buffer = await fsp.readFile(file)
        pages.push(buffer)
    }

    imgToPDF(pages, imgToPDF.sizes.A4).pipe(fs.createWriteStream(savePath))
    progressBar.setCompleted()

}

export async function generateCBR(tempSaveDir: string, savePath: string) {


    zipper.zip(tempSaveDir, (error, zipped) => {
        if (!error) {
            zipped.compress().save(savePath)
            progressBar.setCompleted()
        } else {
            console.log(error)
            progressBar.close()
        }
    })

}

