import path from "path"
import { app, dialog, ipcMain } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import {
  initialize,
  addRule,
  modifyRule,
  deleteRule,
  getAllRules,
  getSingleRule,
} from "./rules-management/rules-service"

const isProd = process.env.NODE_ENV === "production"

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
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

  if (isProd) {
    await mainWindow.loadURL("app://./")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.webContents.openDevTools()
  }

  await initialize()
})()

app.on("window-all-closed", () => {
  app.quit()
})

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`)
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

// Handle rules
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
