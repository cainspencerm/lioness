import { Rule } from "@main/types/Rule"
import useSWR from "swr"

export function useRules() {
  const fetcher = () => window["electronAPI"].getRules()

  const { data, isLoading, error, mutate } = useSWR("get-rules", fetcher)

  return {
    rules: data as Rule[],
    isLoading,
    isError: error,
    mutate,
  }
}
