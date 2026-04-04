"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Heart, MessageCircle, Users, Zap, Flame, Trophy, X, Check, ChevronRight } from "lucide-react"
import { UserAvatar } from "./user-avatar"
import { mockUsers } from "@/lib/data/users"

interface Notification {
  id: string
  type: "reaction" | "friend_request" | "streak" | "achievement" | "nudge" | "comment"
  userId?: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "reaction",
    userId: "2",
    message: "loved your cold plunge receipt",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    type: "friend_request",
    userId: "5",
    message: "wants to be your friend",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    actionable: true,
  },
  {
    id: "3",
    type: "streak",
    message: "You're on a 7-day streak! Keep breaking routines.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "4",
    type: "nudge",
    userId: "3",
    message: "nudged you: \"do something chaotic today\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
  },
  {
    id: "5",
    type: "achievement",
    message: "New badge unlocked: Night Owl - completed 5 tasks after midnight",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: "6",
    type: "comment",
    userId: "4",
    message: "commented on your receipt: \"this is insane 😂\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
  {
    id: "7",
    type: "reaction",
    userId: "6",
    message: "and 3 others reacted to your karaoke moment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
]

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "reaction":
      return <Heart className="w-4 h-4 text-coral" />
    case "friend_request":
      return <Users className="w-4 h-4 text-violet" />
    case "streak":
      return <Flame className="w-4 h-4 text-lime" />
    case "achievement":
      return <Trophy className="w-4 h-4 text-amber-400" />
    case "nudge":
      return <Zap className="w-4 h-4 text-cyan" />
    case "comment":
      return <MessageCircle className="w-4 h-4 text-sky-400" />
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />
  }
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleFriendRequest = (id: string, accept: boolean) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-coral/20 text-coral rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Complete tasks and interact with friends to see activity here
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => {
                const user = notification.userId
                  ? mockUsers.find(u => u.id === notification.userId)
                  : null

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-4 rounded-2xl transition-colors ${
                      notification.read
                        ? "bg-surface-1"
                        : "bg-surface-2 border border-white/5"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {user ? (
                          <div className="relative">
                            <UserAvatar user={user} size="md" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-1 flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          {user && (
                            <span className="font-semibold">{user.displayName} </span>
                          )}
                          <span className={notification.read ? "text-muted-foreground" : ""}>
                            {notification.message}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>

                        {/* Action buttons for friend requests */}
                        {notification.actionable && notification.type === "friend_request" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleFriendRequest(notification.id, true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-lime text-background text-sm font-medium rounded-full hover:bg-lime/90 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleFriendRequest(notification.id, false)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-1 text-muted-foreground text-sm font-medium rounded-full hover:bg-surface-2 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dismiss / Navigate */}
                      {!notification.actionable && (
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-coral" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
