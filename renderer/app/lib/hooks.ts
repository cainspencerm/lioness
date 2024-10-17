"use client"

import { Rule } from "@main/types/Rule"
import useSWR from "swr"
import { debugApi, rulesApi, uploadsApi } from "./electron"

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

export function useUploads() {
  const fetcher = () => uploadsApi.getUploads()

  const { data, isLoading, error, mutate } = useSWR("get-uploads", fetcher)

  return {
    uploads: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useLogs() {
  const fetcher = () => debugApi.getLogs()

  const { data, isLoading, error, mutate } = useSWR("get-logs", fetcher)

  return {
    logs: data,
    isLoading,
    isError: error,
    mutate,
  }
}
