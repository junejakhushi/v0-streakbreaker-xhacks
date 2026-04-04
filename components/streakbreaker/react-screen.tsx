'use client';

import { FeedPost } from '@/lib/types';
import { ReactionDeck } from './reaction-deck';

interface ReactScreenProps {
  posts: FeedPost[];
  onReact: (postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => void;
}

export function ReactScreen({ posts, onReact }: ReactScreenProps) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">React</h1>
        <p className="text-sm text-muted-foreground">
          Judge your friends
        </p>
      </div>

      {/* Deck */}
      <div className="px-4 pt-4">
        <ReactionDeck
          posts={posts}
          onReact={onReact}
        />
      </div>
    </div>
  );
}
