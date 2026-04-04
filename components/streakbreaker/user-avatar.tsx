'use client';

import { motion } from 'framer-motion';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface UserAvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showVerified?: boolean;
  showRing?: boolean;
  ringColor?: string;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const verifiedSizes = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export function UserAvatar({ user, size = 'md', showVerified = true, showRing = false, ringColor, className }: UserAvatarProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <motion.div
        className={cn(
          'relative rounded-full overflow-hidden bg-secondary',
          sizeClasses[size],
          showRing && 'ring-2',
          ringColor || 'ring-primary'
        )}
        whileHover={{ scale: 1.05 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatar}
          alt={user.username}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {showVerified && user.isVerified && (
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 bg-cyan rounded-full p-0.5',
          size === 'xs' && '-bottom-0 -right-0'
        )}>
          <CheckCircle2 className={cn(verifiedSizes[size], 'text-background')} />
        </div>
      )}
    </div>
  );
}

interface UserRowProps {
  user: User;
  onClick?: () => void;
  showStats?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

export function UserRow({ user, onClick, showStats = false, rightElement, className }: UserRowProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
        onClick && 'hover:bg-secondary cursor-pointer',
        className
      )}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <UserAvatar user={user} size="md" />
      <div className="flex-1 text-left min-w-0">
        <p className="font-medium text-sm truncate">@{user.username}</p>
        {showStats && (
          <p className="text-xs text-muted-foreground">
            {user.currentRun} day run · {user.influenceScore} influence
          </p>
        )}
      </div>
      {rightElement}
    </motion.button>
  );
}

export function UserAvatarStack({ users, max = 4, size = 'sm' }: { users: User[]; max?: number; size?: 'xs' | 'sm' | 'md' }) {
  const displayed = users.slice(0, max);
  const remaining = users.length - max;

  const offsetClasses = {
    xs: '-ml-2',
    sm: '-ml-3',
    md: '-ml-4',
  };

  return (
    <div className="flex items-center">
      {displayed.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            'relative rounded-full ring-2 ring-background',
            index > 0 && offsetClasses[size]
          )}
          style={{ zIndex: displayed.length - index }}
        >
          <UserAvatar user={user} size={size} showVerified={false} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={cn(
          'flex items-center justify-center rounded-full bg-secondary text-xs font-medium ring-2 ring-background',
          offsetClasses[size],
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
