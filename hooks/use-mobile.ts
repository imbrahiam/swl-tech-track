"use client"

import * as React from "react"

const QUERY = "(max-width: 767px)"

export function useIsMobile() {
  return React.useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(QUERY)
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
