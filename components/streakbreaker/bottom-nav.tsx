'use client';

import { motion } from 'framer-motion';
import { Flame, Users, Newspaper, UserPlus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppState } from '@/lib/store';
import { Screen } from '@/lib/types';

const tabs: { id: Screen; label: string; icon: typeof Flame }[] = [
  { id: 'today', label: 'Today', icon: Flame },
  { id: 'react', label: 'React', icon: Users },
  { id: 'feed', label: 'Feed', icon: Newspaper },
  { id: 'friends', label: 'Friends', icon: UserPlus },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { currentScreen, setCurrentScreen, state } = useAppState();
  const notificationCount = state.notifications.filter(n => !n.isRead).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/80 backdrop-blur-xl border-t border-white/5">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  isActive ? 'text-lime' : 'text-muted-foreground'
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
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-lime rounded-full"
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
