import { Upload } from "../types/Upload"
import initDb from "./init"

export async function getUploads() {
  const db = await initDb()
  return (
    db.data.uploads.map((upload) => {
      if (upload.date) {
        upload.date = new Date(upload.date)
      }
      return upload
    }) ?? []
  )
}

export async function getUpload(id: string) {
  const db = await initDb()
  const upload = db.data.uploads.find((upload) => upload.id === id)
  if (upload && upload.date) {
    upload.date = new Date(upload.date)
  }
  return upload
}

export async function getUploadByPath(path: string) {
  const db = await initDb()
  const upload = db.data.uploads.find((upload) => upload.path === path)
  if (upload && upload.date) {
    upload.date = new Date(upload.date)
  }
  return upload
}

export async function addUpload(upload: Upload) {
  const db = await initDb()
  await db.update(({ uploads }) => uploads.push(upload))
}

export async function modifyUpload(upload: Upload) {
  const db = await initDb()
  await db.update(({ uploads }) => {
    const index = uploads.findIndex((u) => u.id === upload.id)
    uploads[index] = upload
  })
}

export async function deleteUpload(id: string) {
  const db = await initDb()
  await db.update(({ uploads }) => {
    const index = uploads.findIndex((u) => u.id === id)
    uploads.splice(index, 1)
  })
}
