"use client"

export const { getRules, getRule, addRule, modifyRule, deleteRule } = (() => {
  try {
    return window["electronAPI"]
  } catch (e) {
    return {}
  }
})()
