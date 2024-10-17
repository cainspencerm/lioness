import axios from "axios"
import { shell } from "electron"
import Store from "electron-store"
import { v4 as uuidv4 } from "uuid"
import { addLog } from "./rules-management/db"

export async function createAuthUrl() {
  const credentials = new URLSearchParams({
    response_type: "code",
    client_id: process.env.FRAME_IO_CLIENT_ID,
    scope: process.env.FRAME_IO_SCOPE,
    redirect_uri: process.env.FRAME_IO_REDIRECT_URI,
    state: uuidv4(),
  })

  addLog("Creating Frame.io authentication URL")

  const url = new URL(process.env.FRAME_IO_AUTHORIZE_URL + "?" + credentials)

  addLog("Frame.io authentication URL created")

  try {
    addLog("Opening Frame.io authentication page")
    await shell.openExternal(url.toString())
    addLog("Frame.io authentication page opened")
  } catch (e) {
    addLog("Frame.io authentication failed: " + e.message)
  }
}

export async function exchangeCodeForToken(authCode: string) {
  const response = await axios.post(process.env.FRAME_IO_TOKEN_URL, {
    code: authCode,
    client_id: process.env.FRAME_IO_CLIENT_ID,
    grant_type: "authorization_code",
    redirect_uri: process.env.FRAME_IO_REDIRECT_URI,
  })

  const { access_token, refresh_token } = response.data

  const store = new Store({
    name: "frame-io",
  })

  store.set("access_token", access_token)
  store.set("refresh_token", refresh_token)
}

export async function refreshToken() {
  const store = new Store({
    name: "frame-io",
  })

  const refreshToken = store.get("refresh_token")

  const response = await axios.post(process.env.FRAME_IO_TOKEN_URL, {
    refresh_token: refreshToken,
    client_id: process.env.FRAME_IO_CLIENT_ID,
    grant_type: "refresh_token",
  })

  const { access_token, refresh_token: newRefreshToken } = response.data

  store.set("access_token", access_token)
  store.set("refresh_token", newRefreshToken)
}
