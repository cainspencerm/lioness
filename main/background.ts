import { app, dialog, ipcMain, protocol } from "electron"
import serve from "electron-serve"
import path from "path"
import { createAuthUrl } from "./frame-io"
import { createWindow } from "./helpers"
import {
  addLog,
  addUpload,
  deleteUpload,
  getFrameIoToken,
  getLogs,
  getUpload,
  getUploadByPath,
  getUploads,
  modifyUpload,
  setFrameIoToken,
} from "./rules-management/db"
import {
  addRule,
  deleteRule,
  getAllRules,
  getSingleRule,
  initialize,
  modifyRule,
} from "./rules-management/rules-service"

import dotenv from "dotenv"

// Load the .env.local file into Electron's process
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") })

const isProd = process.env.NODE_ENV === "production"

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLine.pop()}`,
    )
  })

  if (isProd) {
    await mainWindow.loadURL("app://./")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    // mainWindow.webContents.openDevTools()
  }

  await initialize()
})()

// Register the app protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("lioness", process.execPath, [
      path.resolve(process.argv[1]),
    ])
  } else {
    app.setAsDefaultProtocolClient("lioness")
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: "lioness", privileges: { secure: true, standard: true } },
])

app.whenReady().then(() => {
  protocol.handle("lioness", async (request) => {
    console.log("Got request")
    const url = new URL(request.url)

    if (url.pathname === "/frameio-callback") {
      const authCode = url.searchParams.get("code")
      if (authCode) {
        // Exchange the authCode for an access token here.
        console.log("Authorization code:", authCode)

        // You can return a success message or redirect the user back to your app's UI.
        return new Response(
          Buffer.from("<h1>Success. You can close this window.</h1>"),
          {
            status: 200,
            headers: {
              "Content-Type": "text/html",
            },
          },
        )
      }
    }
    return new Response(Buffer.from("<h1>Bad Request</h1>"), {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    })
  })
})

app.on("open-url", (event, url) => {
  console.log("Open URL", url)
  dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`)
})

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
  return await createAuthUrl()
})

ipcMain.handle("get-frameio-token", async () => {
  return await getFrameIoToken()
})

ipcMain.handle("set-frameio-token", async (event, token) => {
  await setFrameIoToken(token)
})

// Debugging
ipcMain.handle("get-logs", async () => {
  return await getLogs()
})

ipcMain.handle("add-log", async (event, message) => {
  await addLog(message)
})
