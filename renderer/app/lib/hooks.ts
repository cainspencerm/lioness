"use client"

import { Rule } from "@main/types/Rule"
import useSWR from "swr"
import { debugApi, frameIoApi, rulesApi, uploadsApi } from "./electron"

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

export function useAccounts() {
  const fetcher = () => frameIoApi.getAccounts()

  const { data, isLoading, error } = useSWR("get-accounts", fetcher)

  return {
    accounts: data,
    isLoading,
    isError: error,
  }
}

export function useTeams(accountId: string) {
  if (!accountId) {
    return {
      teams: [],
      isLoading: false,
      isError: false,
    }
  }

  const fetcher = () => frameIoApi.getTeams(accountId)

  const { data, isLoading, error } = useSWR(["get-teams", accountId], fetcher)

  return {
    teams: data,
    isLoading,
    isError: error,
  }
}

export function useProjects(teamId: string) {
  if (!teamId) {
    return {
      projects: [],
      isLoading: false,
      isError: false,
    }
  }

  const fetcher = () => frameIoApi.getProjects(teamId)

  const { data, isLoading, error } = useSWR(["get-projects", teamId], fetcher)

  return {
    projects: data,
    isLoading,
    isError: error,
  }
}
