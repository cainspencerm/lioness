import axios, { AxiosError } from "axios"
import { shell } from "electron"
import Store from "electron-store"
import { v4 as uuidv4 } from "uuid"

export async function connectFrameIo() {
  if (!(await isConfigured())) await createAuthUrl()
}

export async function disconnectFrameIo() {
  const store = new Store({
    name: "frame-io",
  })

  store.delete("access_token")
  store.delete("refresh_token")
  store.delete("expiration")
}

export async function createAuthUrl() {
  const credentials = new URLSearchParams({
    response_type: "code",
    client_id: process.env.FRAME_IO_CLIENT_ID,
    scope: process.env.FRAME_IO_SCOPE,
    redirect_uri: process.env.FRAME_IO_REDIRECT_URI,
    state: uuidv4(),
  })

  const url = new URL(process.env.FRAME_IO_AUTHORIZE_URL + "?" + credentials)

  await shell.openExternal(url.toString())
}

export async function requestFrameIoAuthentication(url: URL): Promise<boolean> {
  const authCode = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const scope = url.searchParams.get("scope")
  const error = url.searchParams.get("error")

  if (error) {
    console.log("Error during authentication:", error)
    return false
  }

  // Exchange the authCode for an access token here.
  const success = await exchangeCodeForToken(authCode, state, scope)

  return success
}

export async function exchangeCodeForToken(
  authCode: string,
  state: string,
  scope: string,
): Promise<boolean> {
  const redirectUri = process.env.FRAME_IO_REDIRECT_URI
  const clientId = process.env.FRAME_IO_CLIENT_ID

  const response = await axios
    .post(
      process.env.FRAME_IO_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
        client_id: clientId,
      }),
    )
    .catch(() => {
      return null
    })

  if (!response) {
    return false
  }

  // Trigger immediate token refresh for extended usage
  const refreshResponse = await refreshToken(response.data.refresh_token)

  if (!refreshResponse) {
    return false
  }

  const { access_token, refresh_token, expires_in } = refreshResponse

  const store = new Store({
    name: "frame-io",
  })

  store.set("access_token", access_token)
  store.set("refresh_token", refresh_token)
  store.set("expiration", Date.now() + expires_in * 1000)

  return true
}

export async function refreshToken(refresh_token: string) {
  const response = await axios
    .post(
      process.env.FRAME_IO_TOKEN_URL,
      {
        refresh_token: refresh_token,
        scope: process.env.FRAME_IO_SCOPE,
        client_id: process.env.FRAME_IO_CLIENT_ID,
        grant_type: "refresh_token",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )
    .catch((e: AxiosError) => {
      console.error("Error refreshing token:", e.response)
      return null
    })

  return response !== null ? response.data : null
}

export async function isConfigured() {
  const store = new Store({
    name: "frame-io",
  })

  const expiration = store.get("expiration", undefined) as number | undefined
  console.log("Expiration:", expiration)
  console.log("Current time:", Date.now())

  return expiration !== undefined && expiration > Date.now()
}
