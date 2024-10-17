"use client"

import { Log } from "@main/types/Log"
import { Rule } from "@main/types/Rule"
import { Upload } from "@main/types/Upload"

type RulesAPI = {
  getRules: () => Promise<Rule[]>
  getRule: (id: string) => Promise<Rule>
  addRule: (rule: Rule) => Promise<void>
  modifyRule: (rule: Rule) => Promise<void>
  deleteRule: (id: string) => Promise<void>
}

export const rulesApi: RulesAPI = (() => {
  try {
    return window["electron"].rules
  } catch (e) {
    return {}
  }
})()

type UploadsAPI = {
  getUploads: () => Promise<Upload[]>
  getUpload: (id: string) => Promise<Upload>
  getUploadByPath: (path: string) => Promise<Upload | null>
  addUpload: (upload: Upload) => Promise<void>
  modifyUpload: (upload: Upload) => Promise<void>
  deleteUpload: (id: string) => Promise<void>
}

export const uploadsApi: UploadsAPI = (() => {
  try {
    return window["electron"].uploads
  } catch (e) {
    return {}
  }
})()

type PathAPI = {
  selectPath: () => Promise<string | null>
}

export const pathApi: PathAPI = (() => {
  try {
    return window["electron"].path
  } catch (e) {
    return {}
  }
})()

type FrameIoAPI = {
  getFrameIoToken: () => Promise<string | null>
  setFrameIoToken: (token: string) => Promise<void>
  connectFrameIo: () => Promise<void>
}

export const frameIoApi: FrameIoAPI = (() => {
  try {
    return window["electron"].frameIo
  } catch (e) {
    return {}
  }
})()

type DebugAPI = {
  addLog: (message: string) => Promise<void>
  getLogs: () => Promise<Log[]>
}

export const debugApi: DebugAPI = (() => {
  try {
    return window["electron"].debug
  } catch (e) {
    return {}
  }
})()
