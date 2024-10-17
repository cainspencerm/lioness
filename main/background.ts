import dotenv from "dotenv"
import { app, dialog, ipcMain } from "electron"
import serve from "electron-serve"
import path from "path"
import { addLog, getLogs } from "./db/logs"
import {
  addUpload,
  deleteUpload,
  getUpload,
  getUploadByPath,
  getUploads,
  modifyUpload,
} from "./db/uploads"
import {
  connectFrameIo,
  disconnectFrameIo,
  getAccounts,
  getProjects,
  getTeams,
  isConfigured,
  requestFrameIoAuthentication,
} from "./frame-io"
import { createWindow } from "./helpers"
import {
  addRule,
  deleteRule,
  getAllRules,
  getSingleRule,
  initialize,
  modifyRule,
} from "./rules-management/rules-service"

// Keep a global reference of the window object
let mainWindow: Electron.BrowserWindow | null

// Load the .env.local file into Electron's process
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") })

// Set the user data path
const isProd = process.env.NODE_ENV === "production"
if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

// Ensure only one instance of the app is running (Windows)
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// Register the app protocol for deep links
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("lioness", process.execPath, [
      path.resolve(process.argv[1]),
    ])
  } else {
    app.setAsDefaultProtocolClient("lioness")
  }
}

// Handle deep links
app.on("open-url", (event, callingUrl) => {
  event.preventDefault()

  const url = new URL(callingUrl)
  if (url.hostname === "frameio-callback") {
    requestFrameIoAuthentication(url)
  }
})

app.on("second-instance", (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

const initAppWhenReady = async () => {
  await app.whenReady()

  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  if (isProd) {
    await mainWindow.loadURL("app://./")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    // mainWindow.webContents.openDevTools()
  }

  await initialize()
}

// Queue the initializer
initAppWhenReady()

app.on("window-all-closed", () => {
  app.quit()
})

// Handle the file or directory selection
ipcMain.handle("select-path", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory"],
  })

  if (!result.canceled) {
    return result.filePaths[0] // Returns the selected path
  } else {
    return null // User canceled the dialog
  }
})

// Rules management
ipcMain.handle("add-rule", async (event, rule) => {
  await addRule(rule)
})

ipcMain.handle("modify-rule", async (event, rule) => {
  await modifyRule(rule)
})

ipcMain.handle("delete-rule", async (event, id) => {
  await deleteRule(id)
})

ipcMain.handle("get-rules", async () => {
  return await getAllRules()
})

ipcMain.handle("get-rule", async (event, id) => {
  return await getSingleRule(id)
})

// Uploads management
ipcMain.handle("get-uploads", async (event) => {
  return await getUploads()
})

ipcMain.handle("get-upload", async (event, id) => {
  return await getUpload(id)
})

ipcMain.handle("get-upload-by-path", async (event, path) => {
  return await getUploadByPath(path)
})

ipcMain.handle("add-upload", async (event, upload) => {
  await addUpload(upload)
})

ipcMain.handle("modify-upload", async (event, upload) => {
  await modifyUpload(upload)
})

ipcMain.handle("delete-upload", async (event, id) => {
  await deleteUpload(id)
})

// Frame.io API and management
ipcMain.handle("connect-frameio", async () => {
  return await connectFrameIo()
})

ipcMain.handle("disconnect-frameio", async () => {
  return await disconnectFrameIo()
})

ipcMain.handle("is-frameio-connected", async () => {
  return await isConfigured()
})

ipcMain.handle("get-accounts", async () => {
  return await getAccounts()
})

ipcMain.handle("get-teams", async (event, accountId) => {
  return await getTeams(accountId)
})

ipcMain.handle("get-projects", async (event, teamId) => {
  return await getProjects(teamId)
})

// Debugging
ipcMain.handle("get-logs", async () => {
  return await getLogs()
})

ipcMain.handle("add-log", async (event, message) => {
  await addLog(message)
})
