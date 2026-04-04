'use client';

import { useAppState } from '@/lib/store';
import { ReactionDeck } from './reaction-deck';

export function ReactScreen() {
  const { reactionDeck, reactToPost } = useAppState();

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
          posts={reactionDeck}
          onReact={reactToPost}
        />
      </div>
    </div>
  );
}
