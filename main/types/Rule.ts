import { z } from "zod"

export const Rule = z.object({
  id: z.string(),
  name: z.string(),
  directory: z.string(),
  filters: z.array(z.string()),
  projectId: z.string(),
  accountId: z.string(),
})

export type Rule = z.infer<typeof Rule>
