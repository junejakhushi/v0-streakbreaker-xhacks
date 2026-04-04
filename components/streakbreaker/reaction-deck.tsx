'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsDown, ThumbsUp, Rocket, Sparkles } from 'lucide-react';
import { FeedPost } from '@/lib/types';
import { SwipeCard } from './swipe-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReactionDeckProps {
  posts: FeedPost[];
  onReact: (postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => void;
  onEmpty?: () => void;
}

export function ReactionDeck({ posts, onReact, onEmpty }: ReactionDeckProps) {
  const [deck, setDeck] = useState(posts);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (deck.length === 0) return;
    
    const currentPost = deck[0];
    const reaction = direction === 'left' 
      ? 'could-do-more' 
      : direction === 'right' 
        ? 'lets-go' 
        : 'im-in';
    
    setLastAction(direction === 'left' ? '👀 Could do more' : direction === 'right' ? '🔥 Let\'s gooo' : '🚀 I\'m in!');
    setTimeout(() => setLastAction(null), 1500);
    
    onReact(currentPost.id, reaction);
    setDeck(prev => prev.slice(1));
    
    if (deck.length === 1 && onEmpty) {
      onEmpty();
    }
  };

  const handleButtonAction = (action: 'left' | 'right' | 'up') => {
    handleSwipe(action);
  };

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-lime" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold mb-2">All caught up!</h3>
        <p className="text-muted-foreground">
          You&apos;ve reacted to all your friends&apos; receipts. Check back later for more.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Last action feedback */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-card border border-border"
          >
            <span className="font-medium">{lastAction}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack */}
      <div className="relative w-full max-w-sm aspect-[3/4] mx-auto">
        <AnimatePresence>
          {deck.slice(0, 3).map((post, index) => (
            <SwipeCard
              key={post.id}
              post={post}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Counter */}
      <div className="mt-6 mb-4 text-sm text-muted-foreground">
        {deck.length} receipt{deck.length !== 1 ? 's' : ''} left
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6">
        <motion.button
          onClick={() => handleButtonAction('left')}
          className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center text-coral border-2 border-coral/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ThumbsDown className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={() => handleButtonAction('up')}
          className="w-16 h-16 rounded-full bg-violet/20 flex items-center justify-center text-violet border-2 border-violet/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Rocket className="w-7 h-7" />
        </motion.button>
        
        <motion.button
          onClick={() => handleButtonAction('right')}
          className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center text-lime border-2 border-lime/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ThumbsUp className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-6 flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="text-coral">←</span> Could do more
        </span>
        <span className="flex items-center gap-1">
          <span className="text-violet">↑</span> I&apos;m in
        </span>
        <span className="flex items-center gap-1">
          Let&apos;s gooo <span className="text-lime">→</span>
        </span>
      </div>
    </div>
  );
}
