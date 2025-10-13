"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { CookieSettingsModal } from "./cookie-settings-modal"
import { getConsentPreferences, setConsentPreferences, type ConsentPreferences } from "@/lib/consent"

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [bannerText, setBannerText] = useState(
    "We use cookies to enhance your experience and analyze site traffic. By continuing to visit this site you agree to our use of cookies.",
  )

  useEffect(() => {
    // Check if user has already made a choice
    const consent = getConsentPreferences()
    if (!consent) {
      setIsVisible(true)
      loadBannerSettings()
    }
  }, [])

  const loadBannerSettings = async () => {
    try {
      const response = await fetch("/api/cookie-settings")
      const data = await response.json()
      if (data.banner_text) {
        setBannerText(data.banner_text)
      }
    } catch (error) {
      // Use default banner text
      console.log("[v0] Using default cookie banner text")
    }
  }

  const handleAcceptAll = () => {
    setConsentPreferences({
      necessary: true,
      analytics: true,
      advertising: true,
      personalization: true,
    })
    setIsVisible(false)
  }

  const handleDeclineAll = () => {
    setConsentPreferences({
      necessary: true,
      analytics: false,
      advertising: false,
      personalization: false,
    })
    setIsVisible(false)
  }

  const handleSaveSettings = (preferences: ConsentPreferences) => {
    setConsentPreferences(preferences)
    setShowSettings(false)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 text-sm text-white/90 leading-relaxed">
              {bannerText}{" "}
              <a href="/legal/cookies" className="underline hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Button onClick={handleAcceptAll} className="bg-white text-black hover:bg-white/90 font-medium" size="sm">
                Accept All
              </Button>

              <Button
                onClick={handleDeclineAll}
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                size="sm"
              >
                Decline
              </Button>

              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                className="text-white hover:bg-white/10"
                size="sm"
              >
                Settings
              </Button>

              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-8 w-8"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CookieSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} />
    </>
  )
}
