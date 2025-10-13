"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Page error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-8">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  )
}
