'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Share2, Award, TrendingUp, Clock, Users, Zap, Target, Flame, RotateCcw } from 'lucide-react';
import { User, Task, Badge } from '@/lib/types';
import { UserAvatar } from './user-avatar';
import { RealmCard, RealmBadge } from './realm-card';
import { StatsGrid } from './stats-display';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
  user: User;
  savedTasks: Task[];
  isCurrentUser?: boolean;
}

export function ProfileScreen({ user, savedTasks, isCurrentUser = true }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');

  const vibeColors = {
    'Mild': 'bg-lime/20 text-lime',
    'Bold': 'bg-coral/20 text-coral',
    'Unhinged': 'bg-violet/20 text-violet',
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          {isCurrentUser && (
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Profile header */}
      <div className="px-4 pb-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <UserAvatar user={user} size="xl" showRing ringColor="ring-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-1">@{user.username}</h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={cn('px-3 py-1 rounded-full text-sm font-medium', vibeColors[user.vibe])}>
            {user.vibe} vibe
          </span>
          {user.isVerified && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan/20 text-cyan">
              Verified
            </span>
          )}
        </div>

        {/* Known for */}
        {user.knownFor.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {user.knownFor.map((trait, i) => (
              <span key={i} className="text-sm text-muted-foreground">
                {i > 0 && '·'} {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <StatsGrid
          currentRun={user.currentRun}
          tasksCompleted={user.tasksCompleted}
          influenceScore={user.influenceScore}
          rerolls={user.rerolls}
          friendCount={user.friends.length}
          badgeCount={user.badges.length}
        />
      </div>

      {/* Top realms */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Realms</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {user.topRealms.map((realm, index) => (
            <div key={realm} className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative">
                <RealmCard realm={realm} size="md" showLabel={false} />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{realm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Badges</h3>
        <div className="grid grid-cols-2 gap-3">
          {user.badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-secondary">
          <button
            onClick={() => setActiveTab('public')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'public'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground'
            )}
          >
            Public Activity
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'private'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground'
            )}
          >
            Friends Only
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'public' ? (
          <PublicActivity user={user} />
        ) : (
          <PrivateActivity user={user} savedTasks={savedTasks} />
        )}
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const rarityColors = {
    common: 'border-border',
    rare: 'border-cyan/50 bg-cyan/5',
    legendary: 'border-violet/50 bg-violet/5',
  };

  return (
    <motion.div
      className={cn(
        'p-4 rounded-2xl border',
        rarityColors[badge.rarity]
      )}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <p className="font-semibold text-sm">{badge.name}</p>
      <p className="text-xs text-muted-foreground">{badge.description}</p>
    </motion.div>
  );
}

function PublicActivity({ user }: { user: User }) {
  // Mock recent receipts
  const mockReceipts = [
    { realm: 'Food' as const, task: 'Order something you can\'t pronounce', time: '2h ago', reactions: 12 },
    { realm: 'Social' as const, task: 'Compliment a stranger genuinely', time: '1d ago', reactions: 23 },
    { realm: 'Style' as const, task: 'Wear something you never wear', time: '2d ago', reactions: 8 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Recent Receipts</h3>
      {mockReceipts.map((receipt, i) => (
        <motion.div
          key={i}
          className="p-4 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start justify-between mb-2">
            <RealmBadge realm={receipt.realm} />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {receipt.time}
            </span>
          </div>
          <p className="font-medium mb-2">{receipt.task}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-lime" />
              {receipt.reactions} reactions
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PrivateActivity({ user, savedTasks }: { user: User; savedTasks: Task[] }) {
  return (
    <div className="space-y-6">
      {/* Duo status */}
      <div className="p-4 rounded-2xl bg-violet/10 border border-violet/30">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-violet" />
          <h3 className="font-semibold">Weekly Duo</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Paired with @priya.sharma this week
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-1/2 bg-violet rounded-full" />
          </div>
          <span className="text-sm font-medium">1/2</span>
        </div>
      </div>

      {/* Saved tasks */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Saved Tasks ({savedTasks.length})
        </h3>
        {savedTasks.length > 0 ? (
          <div className="space-y-3">
            {savedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <RealmBadge realm={task.realm} className="mb-1" />
                    <p className="font-medium text-sm">{task.title}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    task.vibe === 'Mild' && 'bg-lime/10 text-lime',
                    task.vibe === 'Bold' && 'bg-coral/10 text-coral',
                    task.vibe === 'Unhinged' && 'bg-violet/10 text-violet',
                  )}>
                    {task.vibe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No saved tasks yet</p>
            <p className="text-sm">Swipe up on receipts to save tasks!</p>
          </div>
        )}
      </div>
    </div>
  );
}
