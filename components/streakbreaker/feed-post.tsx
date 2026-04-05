'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Rocket, Clock, TrendingUp, MoreHorizontal } from 'lucide-react';
import { FeedPost as FeedPostType } from '@/lib/types';
import { UserAvatar, UserAvatarStack } from './user-avatar';
import { RealmBadge } from './realm-card';
import { mockUsers } from '@/lib/data/users';
import { cn } from '@/lib/utils';

interface FeedPostProps {
  post: FeedPostType;
  onImIn?: () => void;
}

export function FeedPost({ post, onImIn }: FeedPostProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const copiers = post.copiedBy
    .map(id => mockUsers.find(u => u.id === id))
    .filter(Boolean) as typeof mockUsers;

  return (
    <motion.article
      className="bg-card border border-border rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={post.user} size="md" />
          <div>
            <p className="font-semibold">@{post.user.username}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RealmBadge realm={post.task.realm} className="text-[10px]" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Task info */}
      <div className="px-4 pb-3">
        <h3 className="font-bold text-lg">{post.task.title}</h3>
      </div>

      {/* Receipt image */}
      {post.receipt.imageUrl && (
        <div className="aspect-square relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.receipt.imageUrl}
            alt="Receipt"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Caption */}
      <div className="p-4">
        <p className="text-muted-foreground">&quot;{post.receipt.caption}&quot;</p>
      </div>

      {/* Chain indicator */}
      {copiers.length > 0 && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet" />
          <UserAvatarStack users={copiers} max={3} size="xs" />
          <span className="text-sm text-violet">
            {copiers.length} {copiers.length === 1 ? 'person is' : 'people are'} in
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-lime transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.receipt.reactions.length + Math.floor(Math.random() * 20)}</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
          </button>
        </div>
        
        <motion.button
          onClick={onImIn}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet/20 text-violet font-medium text-sm hover:bg-violet/30 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <Rocket className="w-4 h-4" />
          I&apos;m in
        </motion.button>
      </div>
    </motion.article>
  );
}

export function FeedSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-secondary" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-secondary rounded mb-2" />
          <div className="h-3 w-16 bg-secondary rounded" />
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="h-5 w-3/4 bg-secondary rounded" />
      </div>
      <div className="aspect-square bg-secondary" />
      <div className="p-4">
        <div className="h-4 w-full bg-secondary rounded" />
      </div>
    </div>
  );
}
