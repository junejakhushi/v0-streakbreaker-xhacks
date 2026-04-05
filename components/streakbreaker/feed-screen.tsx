'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FeedPost, FeedSkeleton } from './feed-post';
import { useAppState } from '@/lib/store';

export function FeedScreen() {
  const { state, reactToPost } = useAppState();
  const posts = state.feed || [];
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Feed</h1>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-sm">
          <Sparkles className="w-4 h-4" />
          For You
        </button>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-4">
        {posts.length === 0 ? (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeedPost
                post={post}
                onImIn={() => reactToPost(post.id, 'im-in')}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
