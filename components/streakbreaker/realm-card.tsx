'use client';

import { motion } from 'framer-motion';
import { Realm } from '@/lib/types';
import { realmIcons } from '@/lib/data/tasks';
import { cn } from '@/lib/utils';

interface RealmCardProps {
  realm: Realm;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const realmStyles: Record<Realm, { bg: string; glow: string; text: string }> = {
  'Food': { bg: 'bg-coral/20', glow: 'glow-coral', text: 'text-coral' },
  'Place': { bg: 'bg-cyan/20', glow: 'glow-cyan', text: 'text-cyan' },
  'Social': { bg: 'bg-violet/20', glow: 'glow-violet', text: 'text-violet' },
  'Communication': { bg: 'bg-lime/20', glow: 'glow-lime', text: 'text-lime' },
  'Style': { bg: 'bg-coral/20', glow: 'glow-coral', text: 'text-coral' },
  'Tiny Chaos': { bg: 'bg-violet/20', glow: 'glow-violet', text: 'text-violet' },
  'Campus': { bg: 'bg-cyan/20', glow: 'glow-cyan', text: 'text-cyan' },
  'Comfort Zone': { bg: 'bg-lime/20', glow: 'glow-lime', text: 'text-lime' },
};

export function RealmCard({ realm, isSelected, onClick, size = 'md', showLabel = true }: RealmCardProps) {
  const styles = realmStyles[realm] || { bg: 'bg-muted/20', glow: '', text: 'text-muted-foreground' };
  const icon = realmIcons[realm] || '?';
  
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2',
        onClick && 'cursor-pointer'
      )}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl flex items-center justify-center transition-all',
          sizeClasses[size],
          styles.bg,
          isSelected && styles.glow,
          isSelected && 'ring-2 ring-primary'
        )}
        animate={isSelected ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 0.3 }}
      >
        <span className={cn(iconSizes[size])}>{icon}</span>
        
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
      
      {showLabel && (
        <span className={cn(
          'text-xs font-medium text-center',
          isSelected ? styles.text : 'text-muted-foreground'
        )}>
          {realm}
        </span>
      )}
    </motion.button>
  );
}

export function RealmBadge({ realm, className }: { realm: Realm; className?: string }) {
  const styles = realmStyles[realm] || { bg: 'bg-muted/20', glow: '', text: 'text-muted-foreground' };
  const icon = realmIcons[realm] || '?';
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
      styles.bg,
      styles.text,
      className
    )}>
      <span className="text-sm">{icon}</span>
      {realm}
    </span>
  );
}
