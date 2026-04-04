'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Trophy, Plus, Bell, ChevronRight, Sparkles, UserPlus } from 'lucide-react';
import { User, FriendGroup, DuoPairing, Notification, Realm } from '@/lib/types';
import { UserAvatar, UserAvatarStack, UserRow } from './user-avatar';
import { RealmCard, RealmBadge } from './realm-card';
import { mockFriendGroups, mockDuoPairings, mockNotifications } from '@/lib/data/feed';
import { mockUsers, getUserById } from '@/lib/data/users';
import { cn } from '@/lib/utils';

interface FriendsScreenProps {
  currentUser: User;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export function FriendsScreen({ currentUser, notifications, onMarkRead }: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<'group' | 'notifications'>('group');
  
  const friendGroup = mockFriendGroups.find(g => g.id === currentUser.friendGroup) || mockFriendGroups[0];
  const groupMembers = friendGroup.members
    .map(id => getUserById(id))
    .filter(Boolean) as User[];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Friends</h1>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 p-1 rounded-xl bg-secondary">
          <button
            onClick={() => setActiveTab('group')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'group'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Group
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors relative',
              activeTab === 'notifications'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Bell className="w-4 h-4 inline mr-1" />
            Activity
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-coral text-background">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'group' ? (
          <motion.div
            key="group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4"
          >
            <GroupTab 
              friendGroup={friendGroup} 
              groupMembers={groupMembers}
              currentUserId={currentUser.id}
            />
          </motion.div>
        ) : (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4"
          >
            <NotificationsTab 
              notifications={notifications}
              onMarkRead={onMarkRead}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GroupTab({ 
  friendGroup, 
  groupMembers,
  currentUserId,
}: { 
  friendGroup: FriendGroup;
  groupMembers: User[];
  currentUserId: string;
}) {
  const duoPairings = mockDuoPairings.filter(
    d => d.userId1 === currentUserId || d.userId2 === currentUserId
  );

  return (
    <div className="space-y-6">
      {/* Group header */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{friendGroup.name}</h2>
            <p className="text-sm text-muted-foreground">
              {groupMembers.length} members
            </p>
          </div>
          <UserAvatarStack users={groupMembers} max={4} size="sm" />
        </div>
        
        {/* Group stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-lime">{friendGroup.tasksCompletedThisWeek}</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-coral">{duoPairings.length}</p>
            <p className="text-xs text-muted-foreground">Duo pairs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet">3</p>
            <p className="text-xs text-muted-foreground">Trends</p>
          </div>
        </div>
      </div>

      {/* Weekly duo */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Weekly Duo Challenge</h3>
        <DuoCard />
      </div>

      {/* Top realms */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Realms This Week</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {friendGroup.topRealms.map((realm, index) => (
            <div key={realm} className="flex flex-col items-center gap-1 shrink-0">
              <RealmCard realm={realm} size="md" showLabel={false} />
              <span className="text-xs text-muted-foreground">{realm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Members</h3>
        <div className="space-y-2">
          {groupMembers.map((member) => (
            <UserRow
              key={member.id}
              user={member}
              showStats
              rightElement={
                member.currentRun >= 10 ? (
                  <span className="text-xs text-coral flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Hot streak
                  </span>
                ) : null
              }
            />
          ))}
        </div>
      </div>

      {/* Mini trends */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Trending Tasks</h3>
        <div className="space-y-3">
          {[
            { task: 'Order something you can\'t pronounce', realm: 'Food' as const, count: 5 },
            { task: 'Compliment a stranger genuinely', realm: 'Social' as const, count: 4 },
            { task: 'Say yes to the next thing', realm: 'Tiny Chaos' as const, count: 3 },
          ].map((trend, i) => (
            <motion.div
              key={i}
              className="p-3 rounded-xl bg-card border border-border flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center text-violet font-bold text-sm">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{trend.task}</p>
                <RealmBadge realm={trend.realm} className="text-[10px]" />
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                {trend.count} in
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invite CTA */}
      <motion.button
        className="w-full p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        Invite friends to earn rerolls
      </motion.button>
    </div>
  );
}

function DuoCard() {
  const partner = mockUsers[2]; // Priya
  
  return (
    <motion.div
      className="p-4 rounded-2xl bg-gradient-to-br from-violet/20 to-violet/5 border border-violet/30"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <UserAvatar user={partner} size="lg" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-background" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold">Paired with @{partner.username}</p>
          <p className="text-sm text-muted-foreground">Shared realm: Social</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">1/2 completed</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-violet rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded-xl bg-background/50 flex items-center gap-3">
        <RealmCard realm="Social" size="sm" showLabel={false} />
        <div className="flex-1">
          <p className="text-sm font-medium">Compliment a stranger genuinely</p>
          <p className="text-xs text-muted-foreground">Your turn to complete</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

function NotificationsTab({ 
  notifications, 
  onMarkRead 
}: { 
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'friend-picked': return '🎯';
      case 'reaction': return '🔥';
      case 'im-in': return '🚀';
      case 'duo-assigned': return '👥';
      case 'invite-reward': return '🎁';
      case 'trending': return '📈';
      case 'task-stolen': return '😏';
      case 'badge-earned': return '🏆';
      default: return '📬';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map((notification, i) => (
          <motion.button
            key={notification.id}
            onClick={() => !notification.isRead && onMarkRead(notification.id)}
            className={cn(
              'w-full p-4 rounded-2xl text-left transition-all',
              notification.isRead
                ? 'bg-card border border-border'
                : 'bg-primary/5 border border-primary/20'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.body}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}
