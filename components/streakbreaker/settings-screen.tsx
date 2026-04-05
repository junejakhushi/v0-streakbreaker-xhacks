"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Smartphone,
  Volume2,
  Eye,
  Share2,
  Heart,
  MessageSquare,
  Trash2,
} from "lucide-react"
import { useAppState } from "@/lib/store"

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {title}
      </h3>
      <div className="bg-surface-1 rounded-2xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </div>
  )
}

interface SettingsRowProps {
  icon: React.ReactNode
  label: string
  value?: string
  toggle?: boolean
  toggleValue?: boolean
  onToggle?: (value: boolean) => void
  onClick?: () => void
  destructive?: boolean
}

function SettingsRow({
  icon,
  label,
  value,
  toggle,
  toggleValue,
  onToggle,
  onClick,
  destructive,
}: SettingsRowProps) {
  return (
    <button
      onClick={toggle ? () => onToggle?.(!toggleValue) : onClick}
      className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5 ${
        destructive ? "text-red-400" : ""
      }`}
    >
      <div className={`${destructive ? "text-red-400" : "text-muted-foreground"}`}>
        {icon}
      </div>
      <span className="flex-1 font-medium">{label}</span>
      {toggle ? (
        <div
          className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
            toggleValue ? "bg-lime" : "bg-surface-2"
          }`}
        >
          <motion.div
            className="w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ x: toggleValue ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      ) : value ? (
        <span className="text-sm text-muted-foreground">{value}</span>
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  )
}

interface SettingsScreenProps {
  onBack: () => void
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { resetApp } = useAppState()
  const [settings, setSettings] = useState({
    pushNotifications: true,
    sounds: true,
    haptics: true,
    darkMode: true,
    privateProfile: false,
    showActivity: true,
    friendReactions: true,
    streakReminders: true,
  })

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleLogout = () => {
    resetApp()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-surface-1 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow
            icon={<Bell className="w-5 h-5" />}
            label="Push Notifications"
            toggle
            toggleValue={settings.pushNotifications}
            onToggle={(v) => updateSetting("pushNotifications", v)}
          />
          <SettingsRow
            icon={<Volume2 className="w-5 h-5" />}
            label="Sounds"
            toggle
            toggleValue={settings.sounds}
            onToggle={(v) => updateSetting("sounds", v)}
          />
          <SettingsRow
            icon={<Smartphone className="w-5 h-5" />}
            label="Haptics"
            toggle
            toggleValue={settings.haptics}
            onToggle={(v) => updateSetting("haptics", v)}
          />
          <SettingsRow
            icon={<Heart className="w-5 h-5" />}
            label="Friend Reactions"
            toggle
            toggleValue={settings.friendReactions}
            onToggle={(v) => updateSetting("friendReactions", v)}
          />
          <SettingsRow
            icon={<MessageSquare className="w-5 h-5" />}
            label="Streak Reminders"
            toggle
            toggleValue={settings.streakReminders}
            onToggle={(v) => updateSetting("streakReminders", v)}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow
            icon={settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            label="Dark Mode"
            toggle
            toggleValue={settings.darkMode}
            onToggle={(v) => updateSetting("darkMode", v)}
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy">
          <SettingsRow
            icon={<Lock className="w-5 h-5" />}
            label="Private Profile"
            toggle
            toggleValue={settings.privateProfile}
            onToggle={(v) => updateSetting("privateProfile", v)}
          />
          <SettingsRow
            icon={<Eye className="w-5 h-5" />}
            label="Show Activity Status"
            toggle
            toggleValue={settings.showActivity}
            onToggle={(v) => updateSetting("showActivity", v)}
          />
          <SettingsRow
            icon={<Share2 className="w-5 h-5" />}
            label="Data Sharing"
            onClick={() => {}}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<Globe className="w-5 h-5" />}
            label="Language"
            value="English"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help & Support"
            onClick={() => {}}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Account Actions">
          <SettingsRow
            icon={<LogOut className="w-5 h-5" />}
            label="Log Out"
            onClick={handleLogout}
          />
          <SettingsRow
            icon={<Trash2 className="w-5 h-5" />}
            label="Delete Account"
            destructive
            onClick={() => {}}
          />
        </SettingsSection>

        {/* App Info */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>Streakbreaker v1.0.0</p>
          <p className="mt-1">Break routines. Build connections.</p>
        </div>
      </div>
    </div>
  )
}
