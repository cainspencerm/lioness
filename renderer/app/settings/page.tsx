"use client"

import { Button } from "@nextui-org/react"
import { debugApi, frameIoApi } from "../lib/electron"

export default function Settings() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Settings</h1>
      <h2>Frame.io</h2>
      <p>
        Connect your Frame.io account to access your projects and assets by
        clicking the button below.
      </p>
      <Button
        onClick={async () => {
          frameIoApi
            .connectFrameIo()
            .then(() => {
              debugApi.addLog("Connected to Frame.io")
            })
            .catch((err) => {
              debugApi.addLog(`Error connecting to Frame.io: ${err}`)
            })
        }}
      >
        Connect Frame.io
      </Button>
    </div>
  )
}
