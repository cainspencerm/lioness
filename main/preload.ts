import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import { Rule } from "./types/Rule"

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

// Expose the API for selecting a file or directory
contextBridge.exposeInMainWorld("electronAPI", {
  selectPath: () => ipcRenderer.invoke("select-path"),
  getRules: () => ipcRenderer.invoke("get-rules"),
  getRule: (id: string) => ipcRenderer.invoke("get-rule", id),
  addRule: (rule: Rule) => ipcRenderer.invoke("add-rule", rule),
  modifyRule: (rule: Rule) => ipcRenderer.invoke("modify-rule", rule),
  deleteRule: (id: string) => ipcRenderer.invoke("delete-rule", id),
})

contextBridge.exposeInMainWorld("ipc", handler)

export type IpcHandler = typeof handler
