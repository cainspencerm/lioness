import { z } from "zod"

export const Rule = z.object({
  name: z.string(),
  directory: z.string(),
  fileNames: z.array(z.string()),
  fileTypes: z.array(z.string()),
})

export type Rule = z.infer<typeof Rule>

export interface RulesContextType {
  rules: Rule[]
  addRule: (rule: Rule) => void
  modifyRule: (index: number, newRule: Rule) => void
  deleteRule: (index: number) => void
}
