"use client"

import { useEffect, useState } from "react"
import { hasConsent } from "@/lib/consent"

interface AdSlotProps {
  position: "header" | "sidebar" | "inline" | "footer" | "hero"
  className?: string
}

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const [ad, setAd] = useState<any>(null)
  const [hasAdConsent, setHasAdConsent] = useState(false)

  useEffect(() => {
    // Check if user has given advertising consent
    const consent = hasConsent("advertising")
    setHasAdConsent(consent)

    if (consent) {
      loadAd()
    }
  }, [position])

  const loadAd = async () => {
    try {
      const response = await fetch(`/api/ads?position=${position}`)
      const data = await response.json()
      if (data.ad) {
        setAd(data.ad)
        trackImpression(data.ad.id)
      }
    } catch (error) {
      console.error("Error loading ad:", error)
    }
  }

  const trackImpression = async (adId: string) => {
    try {
      await fetch("/api/ads/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_id: adId,
          position,
        }),
      })
    } catch (error) {
      console.error("Error tracking impression:", error)
    }
  }

  const handleClick = async () => {
    if (ad) {
      try {
        await fetch("/api/ads/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ad_id: ad.id,
          }),
        })
      } catch (error) {
        console.error("Error tracking click:", error)
      }
    }
  }

  if (!hasAdConsent) {
    return null
  }

  if (!ad) {
    return null
  }

  return (
    <div className={`ad-slot ad-slot-${position} ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 text-center">Advertisement</div>
      <a
        href={ad.link_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="block hover:opacity-90 transition-opacity"
      >
        {ad.image_url ? (
          <img src={ad.image_url || "/placeholder.svg"} alt={ad.title} className="w-full h-auto" />
        ) : (
          <div className="bg-muted p-6 text-center rounded-lg border">
            <h3 className="font-semibold mb-2">{ad.title}</h3>
            <p className="text-sm text-muted-foreground">{ad.description}</p>
          </div>
        )}
      </a>
    </div>
  )
}
