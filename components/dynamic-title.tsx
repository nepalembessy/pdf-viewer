"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function DynamicTitle() {
  const pathname = usePathname()

  useEffect(() => {
    let title = "Nepal Embassy India"

    if (pathname.startsWith("/s/")) {
      title = "Nepal Embassy - Travel Document"
    } else if (pathname.startsWith("/admin")) {
      title = "Nepal Embassy Portal"
    }

    document.title = title
  }, [pathname])

  return null
}
