'use client';

import { motion } from 'framer-motion';
import { Flame, Users, Newspaper, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

const tabs = [
  { id: 'today', label: 'Today', icon: Flame },
  { id: 'react', label: 'React', icon: Users },
  { id: 'feed', label: 'Feed', icon: Newspaper },
  { id: 'friends', label: 'Friends', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onTabChange, notificationCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-glass-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {tab.id === 'friends' && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-[10px] font-bold rounded-full flex items-center justify-center text-background">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
