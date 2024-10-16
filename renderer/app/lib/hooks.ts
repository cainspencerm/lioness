import { Rule } from "@main/types/Rule"
import useSWR from "swr"
import { rulesApi } from "./electron"

export function useRules() {
  const fetcher = () => rulesApi.getRules()

  const { data, isLoading, error, mutate } = useSWR("get-rules", fetcher)

  return {
    rules: data as Rule[],
    isLoading,
    isError: error,
    mutate,
  }
}
