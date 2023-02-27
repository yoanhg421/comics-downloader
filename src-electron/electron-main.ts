import {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  protocol,
  session,
} from "electron";
import path from "path";
import os from "os";

import cheerio from "cheerio";

import { downloadfFiles } from "./helpers/fileHandler";

import async from "async";
import ProgressBar from "electron-progressbar";
import { store } from "./helpers/Store";

import { APIWrapper, Chapter, Source } from "paperback-extensions-common";

import { DownloadRequest } from "../interfaces/comics-downloader";
import {
  installSource,
  getInstalledSources,
  removeSource,
} from "./helpers/sourceHandler";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    maxWidth: 720,
    minWidth: 720,
    width: 720,
    maximizable: false,
    height: 800,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

// const source = new MangaLife(cheerio)
let source: Source;

const wrapper = new APIWrapper();

async function loadSource(src: any) {
  // setUserAgent(src.websiteBaseURL)

  const mangaSource: Source = await import(store.getSourcePath(src.id));
  // console.log(mangaSource)
  //@ts-ignore
  const source = new mangaSource[src.id](cheerio);
  // console.log(source)

  return source;
}

ipcMain.handle("changeSource", async (_, sourceId) => {
  try {
    source = await loadSource(sourceId);
    return true;
  } catch (err) {
    return false;
  }
});

// const source = new sourceClass(cheerio)
ipcMain.handle("sources", async () => {
  return await getInstalledSources();

  // return JSON.parse(await fs.readFile(versioning[0], 'utf8'))
});

ipcMain.handle("get/sections", async () => {
  return await wrapper.getHomePageSections(source);
});
ipcMain.handle("get/details", async (_, mangaId) => {
  return await wrapper.getMangaDetails(source, mangaId);
});
ipcMain.handle("get/chapters", async (_, mangaId) => {
  return await wrapper.getChapters(source, mangaId);
});
ipcMain.handle(
  "get/chapter/details",
  async (_, mangaId, chapters: Chapter[]) => {
    const progressBar = new ProgressBar({
      indeterminate: true,
      text: "Getting Chapter Data ...",
      detail: "Wait...",
      browserWindow: {
        parent: mainWindow,
      },
    });

    const result = await async.mapLimit(chapters, 5, async (ch: Chapter) => {
      return await wrapper.getChapterDetails(
        source,
        mangaId,
        ch.id ?? "unknown"
      );
    });
    progressBar.setCompleted();
    // console.log(result)
    return result;
    // return await wrapper.getChapterDetails(source, mangaId, chapterId ?? 'unknown')
  }
);
ipcMain.handle("search", async (_, query, metadata) => {
  return await wrapper.searchRequest(source, query, metadata);
});
ipcMain.handle("getTags", async () => {
  return await wrapper.getTags(source);
});

ipcMain.handle("download/chapter", async (_, data: DownloadRequest) => {
  return await downloadfFiles(data, mainWindow!);
});

ipcMain.handle("view-more", async (_, section) => {
  console.log(section);
  return await wrapper.getViewMoreItems(source, section, undefined, 1);
});

ipcMain.handle("install-source", async (_, baseUrl) => {
  return await installSource(baseUrl);
});

ipcMain.handle("remove/source", async (_, sourceId: string) => {
  return removeSource(sourceId);
});
