"use client"

export type ConsentCategory = "necessary" | "analytics" | "advertising" | "personalization"

export interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  advertising: boolean
  personalization: boolean
}

const CONSENT_COOKIE_NAME = "cookie_consent"
const CONSENT_EXPIRY_DAYS = 365

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null

  const consent = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")[1]

  if (!consent) return null

  try {
    return JSON.parse(decodeURIComponent(consent))
  } catch {
    return null
  }
}

export function setConsentPreferences(preferences: ConsentPreferences): void {
  const expires = new Date()
  expires.setDate(expires.getDate() + CONSENT_EXPIRY_DAYS)

  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`

  // Save to database
  saveConsentToDatabase(preferences)

  // Load scripts based on consent
  loadConsentScripts(preferences)
}

export function hasConsent(category: ConsentCategory): boolean {
  const preferences = getConsentPreferences()
  if (!preferences) return false
  return preferences[category]
}

function saveConsentToDatabase(preferences: ConsentPreferences): void {
  // Generate session ID if not exists
  let sessionId = sessionStorage.getItem("session_id")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem("session_id", sessionId)
  }

  fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      consent: preferences,
    }),
  }).catch(console.error)
}

function loadConsentScripts(preferences: ConsentPreferences): void {
  // Load Google Analytics if analytics consent given
  if (preferences.analytics && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    // Load gtag.js
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag("js", new Date())
    gtag("config", gaId, {
      anonymize_ip: true,
      cookie_flags: "SameSite=Lax;Secure",
    })
  }

  // Load advertising scripts if consent given
  if (preferences.advertising) {
    // Add advertising scripts here (e.g., Google Ads, Facebook Pixel)
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[]
  }
}
