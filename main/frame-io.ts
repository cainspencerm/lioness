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

  return expiration !== undefined && expiration > Date.now()
}

export async function maintainToken() {
  const store = new Store({
    name: "frame-io",
  })

  const expiration = store.get("expiration", undefined) as number | undefined
  if (expiration === undefined) {
    return
  }

  // If the token is within a week of expiration, refresh it
  const weekFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000
  if (expiration < weekFromNow) {
    const refresh_token = store.get("refresh_token") as string

    if (refresh_token) {
      const response = await refreshToken(refresh_token)

      if (response) {
        const { access_token, refresh_token, expires_in } = response

        store.set("access_token", access_token)
        store.set("refresh_token", refresh_token)
        store.set("expiration", Date.now() + expires_in * 1000)
      }
    }
  }
}

async function getAccessToken() {
  await maintainToken()

  const store = new Store({
    name: "frame-io",
  })

  return store.get("access_token") as string
}

export async function getAccounts() {
  const accessToken = await getAccessToken()

  const response = await axios
    .get(process.env.FRAME_IO_API_URL + "/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((e: AxiosError) => {
      console.error("Error getting accounts:", e.response)
      return null
    })

  if (!response) {
    return null
  }

  return response.data
}

export async function getTeams(accountId: string) {
  const accessToken = await getAccessToken()

  const response = await axios
    .get(process.env.FRAME_IO_API_URL + "/teams", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        account_id: accountId,
      },
    })
    .catch((e: AxiosError) => {
      console.error("Error getting teams:", e.response)
      return null
    })

  if (!response) {
    return null
  }

  return response.data
}

export async function getProjects(teamId: string) {
  const accessToken = await getAccessToken()
  const response = await axios.get(process.env.FRAME_IO_API_URL + "/projects", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      team_id: teamId,
    },
  })

  return response.data
}
