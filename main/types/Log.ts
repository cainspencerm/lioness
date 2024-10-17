import { z } from "zod"

export const Log = z.object({
  id: z.string(),
  message: z.string(),
  timestamp: z.number(),
})

export type Log = z.infer<typeof Log>
