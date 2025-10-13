"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { CookiePreferences } from "./cookie-consent-banner"

interface CookieSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: CookiePreferences) => void
}

export function CookieSettingsModal({ isOpen, onClose, onSave }: CookieSettingsModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    advertising: false,
    personalization: false,
  })

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cookie Preferences</DialogTitle>
          <DialogDescription className="text-gray-600">
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Necessary Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="necessary" className="text-base font-semibold cursor-pointer">
                  Necessary Cookies
                </Label>
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded">Always Active</span>
              </div>
              <p className="text-sm text-gray-600">
                Essential for the website to function properly. These cookies enable core functionality such as
                security, network management, and accessibility. They cannot be disabled.
              </p>
            </div>
            <Switch id="necessary" checked={true} disabled className="mt-1" />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer mb-2 block">
                Analytics Cookies
              </Label>
              <p className="text-sm text-gray-600">
                Help us understand how visitors interact with our website by collecting and reporting information
                anonymously. Includes Google Analytics and heatmap tools.
              </p>
            </div>
            <Switch
              id="analytics"
              checked={preferences.analytics}
              onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              className="mt-1"
            />
          </div>

          {/* Advertising Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <Label htmlFor="advertising" className="text-base font-semibold cursor-pointer mb-2 block">
                Advertising Cookies
              </Label>
              <p className="text-sm text-gray-600">
                Used to deliver relevant advertisements and track ad campaign performance. Includes Google Ads and
                partner advertising networks.
              </p>
            </div>
            <Switch
              id="advertising"
              checked={preferences.advertising}
              onCheckedChange={(checked) => setPreferences({ ...preferences, advertising: checked })}
              className="mt-1"
            />
          </div>

          {/* Personalization Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <Label htmlFor="personalization" className="text-base font-semibold cursor-pointer mb-2 block">
                Personalization Cookies
              </Label>
              <p className="text-sm text-gray-600">
                Remember your preferences and settings for a better user experience, such as theme selection and
                language preferences.
              </p>
            </div>
            <Switch
              id="personalization"
              checked={preferences.personalization}
              onCheckedChange={(checked) => setPreferences({ ...preferences, personalization: checked })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-black text-white hover:bg-black/90">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
