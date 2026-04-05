'use client';

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Camera, MessageSquare, Sparkles, Zap, Users } from 'lucide-react';
import { Task } from '@/lib/types';
import { RealmBadge } from './realm-card';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  showFullDetails?: boolean;
  isSelected?: boolean;
  className?: string;
}

const vibeStyles = {
  'Mild': { bg: 'bg-lime/10', text: 'text-lime', border: 'border-lime/30' },
  'Bold': { bg: 'bg-coral/10', text: 'text-coral', border: 'border-coral/30' },
  'Unhinged': { bg: 'bg-violet/10', text: 'text-violet', border: 'border-violet/30' },
};

const riskLabels = {
  'low': { label: 'Low key', color: 'text-lime' },
  'medium': { label: 'Some looks', color: 'text-coral' },
  'high': { label: 'Main character', color: 'text-violet' },
};

const chainLabels = {
  'low': 'Niche appeal',
  'medium': 'Could spread',
  'high': 'Chain potential',
};

export function TaskCard({ task, onClick, showFullDetails = false, isSelected, className }: TaskCardProps) {
  const vibeStyle = vibeStyles[task.vibe];
  const riskInfo = riskLabels[task.socialRisk];

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border bg-card p-4 transition-all',
        vibeStyle.border,
        isSelected && 'ring-2 ring-primary',
        onClick && 'cursor-pointer hover:bg-card/80',
        className
      )}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      layout
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <RealmBadge realm={task.realm} className="mb-2" />
          <h3 className="font-semibold text-lg leading-tight">{task.title}</h3>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-lg text-xs font-medium',
          vibeStyle.bg,
          vibeStyle.text
        )}>
          {task.vibe}
        </span>
      </div>

      {showFullDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {task.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{task.timeEstimate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className={cn('w-4 h-4', riskInfo.color)} />
              <span className={riskInfo.color}>{riskInfo.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {task.proofTypeSuggestion === 'photo' ? (
                <Camera className="w-4 h-4 text-muted-foreground" />
              ) : (
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="capitalize">{task.proofTypeSuggestion} proof</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className={cn('w-4 h-4', task.chainPotential === 'high' ? 'text-primary' : 'text-muted-foreground')} />
              <span>{chainLabels[task.chainPotential]}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.canBeFriendPicked && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-xs">
                <Users className="w-3 h-3" />
                Friend-pickable
              </span>
            )}
            {task.canBeDuo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-xs">
                <Sparkles className="w-3 h-3" />
                Duo-ready
              </span>
            )}
          </div>
        </motion.div>
      )}

      {!showFullDetails && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}
    </motion.div>
  );
}

export function TaskCardCompact({ task, onClick }: { task: Task; onClick?: () => void }) {
  const vibeStyle = vibeStyles[task.vibe];

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl border bg-card p-3 transition-all',
        vibeStyle.border,
        'hover:bg-card/80'
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{task.shortLabel || task.title}</p>
          <p className="text-xs text-muted-foreground">{task.timeEstimate}</p>
        </div>
        <span className={cn(
          'shrink-0 px-2 py-0.5 rounded text-xs font-medium',
          vibeStyle.bg,
          vibeStyle.text
        )}>
          {task.vibe}
        </span>
      </div>
    </motion.button>
  );
}
