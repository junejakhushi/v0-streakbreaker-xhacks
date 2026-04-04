"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AppStateProvider, useAppState } from "@/lib/store"
import { LandingPage } from "@/components/streakbreaker/landing-page"
import { Onboarding } from "@/components/streakbreaker/onboarding"
import { TodayScreen } from "@/components/streakbreaker/today-screen"
import { FeedScreen } from "@/components/streakbreaker/feed-screen"
import { ReactScreen } from "@/components/streakbreaker/react-screen"
import { FriendsScreen } from "@/components/streakbreaker/friends-screen"
import { ProfileScreen } from "@/components/streakbreaker/profile-screen"
import { NotificationsScreen } from "@/components/streakbreaker/notifications-screen"
import { SettingsScreen } from "@/components/streakbreaker/settings-screen"
import { BottomNav } from "@/components/streakbreaker/bottom-nav"

function AppContent() {
  const { 
    currentUser, 
    currentScreen, 
    setCurrentScreen, 
    isOnboarding, 
    setIsOnboarding,
    hasSeenLanding,
    setHasSeenLanding 
  } = useAppState()

  // Show landing page for first-time visitors
  if (!hasSeenLanding) {
    return (
      <LandingPage 
        onGetStarted={() => {
          setHasSeenLanding(true)
        }} 
      />
    )
  }

  // Show onboarding if user hasn't completed it
  if (isOnboarding || !currentUser) {
    return (
      <Onboarding 
        onComplete={(data) => {
          // The completeOnboarding function handles setting up the user
          // For now, we just mark onboarding as complete
          setIsOnboarding(false)
          setCurrentScreen("today")
        }} 
      />
    )
  }

  // Check for settings or notifications overlay screens
  const showSettings = currentScreen === "settings"
  const showNotifications = currentScreen === "notifications"
  const showProfile = currentScreen === "profile"

  // Main app screens
  const mainScreens = ["today", "feed", "react", "friends"] as const

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <SettingsScreen onBack={() => setCurrentScreen("profile")} />
            </motion.div>
          ) : showNotifications ? (
            <motion.div
              key="notifications"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <div className="pb-20">
                <NotificationsScreen />
              </div>
            </motion.div>
          ) : (
            <>
              {currentScreen === "today" && (
                <motion.div
                  key="today"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TodayScreen />
                </motion.div>
              )}
              {currentScreen === "feed" && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FeedScreen />
                </motion.div>
              )}
              {currentScreen === "react" && (
                <motion.div
                  key="react"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ReactScreen />
                </motion.div>
              )}
              {currentScreen === "friends" && (
                <motion.div
                  key="friends"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FriendsScreen />
                </motion.div>
              )}
              {currentScreen === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProfileScreen 
                    onOpenSettings={() => setCurrentScreen("settings")}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - always visible in main app */}
      <BottomNav />
    </div>
  )
}

export default function Home() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  )
}
