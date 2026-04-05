'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ThumbsDown, ThumbsUp, Rocket, Clock, Users } from 'lucide-react';
import { FeedPost } from '@/lib/types';
import { UserAvatar } from './user-avatar';
import { RealmBadge } from './realm-card';
import { MiniStats } from './stats-display';
import { cn } from '@/lib/utils';

interface SwipeCardProps {
  post: FeedPost;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isTop?: boolean;
}

export function SwipeCard({ post, onSwipe, isTop = false }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateZ = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Directional indicators
  const leftOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const upOpacity = useTransform(y, [-150, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = 500;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      setExitY(-500);
      onSwipe('up');
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      setExitX(500);
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      setExitX(-500);
      onSwipe('left');
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
    <motion.div
      className={cn(
        'absolute w-full aspect-[3/4] rounded-3xl overflow-hidden bg-card border border-border shadow-2xl swipe-card',
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      )}
      style={{ x, y, rotateZ, opacity }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 20 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 20,
        x: exitX,
        ...(exitY !== 0 && { y: exitY }),
      }}
      exit={{
        x: exitX,
        y: exitY || 0,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Direction indicators */}
      <motion.div
        className="absolute top-8 left-8 z-20 px-4 py-2 rounded-xl bg-coral/90 text-background font-bold text-lg rotate-[-15deg]"
        style={{ opacity: leftOpacity }}
      >
        <div className="flex items-center gap-2">
          <ThumbsDown className="w-5 h-5" />
          Could do more
        </div>
      </motion.div>
      
      <motion.div
        className="absolute top-8 right-8 z-20 px-4 py-2 rounded-xl bg-lime/90 text-background font-bold text-lg rotate-[15deg]"
        style={{ opacity: rightOpacity }}
      >
        <div className="flex items-center gap-2">
          Let&apos;s gooo
          <ThumbsUp className="w-5 h-5" />
        </div>
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 rounded-xl bg-violet/90 text-foreground font-bold text-xl"
        style={{ opacity: upOpacity }}
      >
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          I&apos;m in
        </div>
      </motion.div>

      {/* Receipt image */}
      <div className="absolute inset-0">
        {post.receipt.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.receipt.imageUrl}
            alt="Receipt"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-card flex items-center justify-center">
            <p className="text-6xl opacity-20">📝</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* User info */}
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar user={post.user} size="lg" />
          <div className="flex-1">
            <p className="font-semibold text-lg">@{post.user.username}</p>
            <MiniStats currentRun={post.user.currentRun} influenceScore={post.user.influenceScore} />
          </div>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(post.createdAt)}
          </span>
        </div>

        {/* Task info */}
        <div className="space-y-2">
          <RealmBadge realm={post.task.realm} />
          <h3 className="font-bold text-xl">{post.task.title}</h3>
          <p className="text-muted-foreground">&quot;{post.receipt.caption}&quot;</p>
          
          {post.copiedBy.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-violet pt-2">
              <Users className="w-4 h-4" />
              <span>{post.copiedBy.length} people are in</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
