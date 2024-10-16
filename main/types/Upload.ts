import { z } from "zod"

export const Upload = z.object({
  id: z.string(),
  ruleId: z.string(), // The ID of the rule that the upload belongs to
  path: z.string(),
  status: z.enum(["pending", "processing", "completed"]),
  date: z.date().optional(),
})

export type Upload = z.infer<typeof Upload>
