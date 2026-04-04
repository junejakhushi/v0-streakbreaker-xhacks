'use client';

import { motion } from 'framer-motion';
import { Flame, Target, Zap, RotateCcw, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function StatItem({ icon, label, value, color = 'text-foreground', className }: StatItemProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className={cn('w-10 h-10 rounded-xl bg-secondary flex items-center justify-center', color)}>
        {icon}
      </div>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

interface StatsRowProps {
  currentRun: number;
  tasksCompleted: number;
  influenceScore: number;
  rerolls: number;
  className?: string;
}

export function StatsRow({ currentRun, tasksCompleted, influenceScore, rerolls, className }: StatsRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <StatItem
        icon={<Flame className="w-5 h-5" />}
        label="Run"
        value={currentRun}
        color="text-coral"
      />
      <StatItem
        icon={<Target className="w-5 h-5" />}
        label="Done"
        value={tasksCompleted}
        color="text-lime"
      />
      <StatItem
        icon={<Zap className="w-5 h-5" />}
        label="Influence"
        value={influenceScore}
        color="text-violet"
      />
      <StatItem
        icon={<RotateCcw className="w-5 h-5" />}
        label="Rerolls"
        value={rerolls}
        color="text-cyan"
      />
    </div>
  );
}

interface StatsGridProps {
  currentRun: number;
  tasksCompleted: number;
  influenceScore: number;
  rerolls: number;
  friendCount: number;
  badgeCount: number;
  className?: string;
}

export function StatsGrid({ currentRun, tasksCompleted, influenceScore, rerolls, friendCount, badgeCount, className }: StatsGridProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-coral/10"
        whileHover={{ scale: 1.02 }}
      >
        <Flame className="w-6 h-6 text-coral mb-1" />
        <span className="text-2xl font-bold">{currentRun}</span>
        <span className="text-xs text-muted-foreground">Day Run</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-lime/10"
        whileHover={{ scale: 1.02 }}
      >
        <Target className="w-6 h-6 text-lime mb-1" />
        <span className="text-2xl font-bold">{tasksCompleted}</span>
        <span className="text-xs text-muted-foreground">Tasks</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-violet/10"
        whileHover={{ scale: 1.02 }}
      >
        <Zap className="w-6 h-6 text-violet mb-1" />
        <span className="text-2xl font-bold">{influenceScore}</span>
        <span className="text-xs text-muted-foreground">Influence</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-cyan/10"
        whileHover={{ scale: 1.02 }}
      >
        <RotateCcw className="w-6 h-6 text-cyan mb-1" />
        <span className="text-2xl font-bold">{rerolls}</span>
        <span className="text-xs text-muted-foreground">Rerolls</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-secondary"
        whileHover={{ scale: 1.02 }}
      >
        <Users className="w-6 h-6 text-foreground mb-1" />
        <span className="text-2xl font-bold">{friendCount}</span>
        <span className="text-xs text-muted-foreground">Friends</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center p-4 rounded-2xl bg-secondary"
        whileHover={{ scale: 1.02 }}
      >
        <Trophy className="w-6 h-6 text-foreground mb-1" />
        <span className="text-2xl font-bold">{badgeCount}</span>
        <span className="text-xs text-muted-foreground">Badges</span>
      </motion.div>
    </div>
  );
}

export function MiniStats({ currentRun, influenceScore }: { currentRun: number; influenceScore: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex items-center gap-1 text-coral">
        <Flame className="w-4 h-4" />
        {currentRun}
      </span>
      <span className="flex items-center gap-1 text-violet">
        <Zap className="w-4 h-4" />
        {influenceScore}
      </span>
    </div>
  );
}
