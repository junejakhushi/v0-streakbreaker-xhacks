'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dice6, Users, RotateCcw, Camera, ArrowRight, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task, Realm, User } from '@/lib/types';
import { RealmCard, RealmBadge } from './realm-card';
import { TaskCard } from './task-card';
import { StatsRow } from './stats-display';
import { UserAvatar, UserAvatarStack, UserRow } from './user-avatar';
import { ReceiptComposer } from './receipt-composer';
import { mockUsers } from '@/lib/data/users';
import { getRandomTask, getFriendPickOptions, getTasksByRealm } from '@/lib/data/tasks';
import { getRandomFriendPickNote } from '@/lib/data/feed';
import { cn } from '@/lib/utils';
import { useAppState } from '@/lib/store';

type FlowState = 
  | 'idle'
  | 'feeling-lucky'
  | 'pick-own'
  | 'friend-pick-select'
  | 'friend-pick-pending'
  | 'friend-pick-received'
  | 'task-selected'
  | 'receipt';

export function TodayScreen() {
  const { state, submitReceipt, setCurrentScreen } = useAppState();
  const { todayRealm, currentUser } = state;
  
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [friendNote, setFriendNote] = useState<string>('');
  const [rerollsUsed, setRerollsUsed] = useState(0);
  
  const availableRerolls = currentUser.rerolls - rerollsUsed;
  const friends = currentUser.friends
    .map(id => mockUsers.find(u => u.id === id))
    .filter(Boolean) as User[];

  const handleFeelingLucky = () => {
    const task = getRandomTask(todayRealm, currentUser.vibe);
    setSelectedTask(task);
    setFlowState('feeling-lucky');
  };

  const handleReroll = () => {
    if (availableRerolls <= 0) return;
    const task = getRandomTask(todayRealm, currentUser.vibe);
    setSelectedTask(task);
    setRerollsUsed(prev => prev + 1);
  };

  const handlePickOwn = () => {
    setFlowState('pick-own');
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setFlowState('task-selected');
  };

  const handleFriendPickSelect = () => {
    setFlowState('friend-pick-select');
  };

  const handleSelectFriend = (friend: User) => {
    setSelectedFriend(friend);
    setFlowState('friend-pick-pending');
    
    // Simulate friend picking
    setTimeout(() => {
      const options = getFriendPickOptions(todayRealm);
      const picked = options[Math.floor(Math.random() * options.length)];
      setSelectedTask(picked);
      setFriendNote(getRandomFriendPickNote());
      setFlowState('friend-pick-received');
    }, 2500);
  };

  const handleAcceptTask = () => {
    setFlowState('receipt');
  };

  const handleSubmitReceipt = (caption: string) => {
    submitReceipt(caption);
    setSelectedTask(null);
    setSelectedFriend(null);
    setFriendNote('');
    setFlowState('idle');
  };

  const handleBack = () => {
    if (flowState === 'receipt') {
      setFlowState('task-selected');
    } else if (flowState === 'task-selected' || flowState === 'feeling-lucky' || flowState === 'friend-pick-received') {
      setSelectedTask(null);
      setSelectedFriend(null);
      setFlowState('idle');
    } else if (flowState === 'pick-own' || flowState === 'friend-pick-select') {
      setFlowState('idle');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <AnimatePresence mode="wait">
        {/* Idle State - Main Today View */}
        {flowState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Realm</p>
                <h1 className="text-2xl font-bold">{todayRealm}</h1>
              </div>
              <button 
                onClick={() => setCurrentScreen('notifications')}
                className="relative p-2 rounded-full hover:bg-surface-1 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {state.notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />
                )}
              </button>
            </div>

            {/* Realm Card */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <RealmCard realm={todayRealm} size="lg" showLabel={false} />
              </motion.div>
              <p className="text-muted-foreground mt-4">Today feels suspiciously predictable.</p>
            </div>

            {/* Stats */}
            <div className="mb-8 p-4 rounded-2xl bg-surface-1 border border-white/5">
              <StatsRow
                currentRun={currentUser.currentRun}
                tasksCompleted={currentUser.tasksCompleted}
                influenceScore={currentUser.influenceScore}
                rerolls={availableRerolls}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={handleFeelingLucky}
                className="w-full p-4 rounded-2xl bg-lime/20 border border-lime/30 text-left transition-all hover:bg-lime/30"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lime/30 flex items-center justify-center">
                    <Dice6 className="w-6 h-6 text-lime" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Feeling Lucky</p>
                    <p className="text-sm text-muted-foreground">Let fate decide your task</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-lime" />
                </div>
              </motion.button>

              <motion.button
                onClick={handlePickOwn}
                className="w-full p-4 rounded-2xl bg-surface-1 border border-white/5 text-left transition-all hover:bg-surface-2"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Pick My Own</p>
                    <p className="text-sm text-muted-foreground">Browse tasks in this realm</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.button>

              <motion.button
                onClick={handleFriendPickSelect}
                className="w-full p-4 rounded-2xl bg-violet/20 border border-violet/30 text-left transition-all hover:bg-violet/30"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-violet" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Ask a Friend to Pick</p>
                    <p className="text-sm text-muted-foreground">Let chaos choose for you</p>
                  </div>
                  <UserAvatarStack users={friends.slice(0, 3)} size="xs" />
                </div>
              </motion.button>
            </div>

            {/* Friend Activity */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Friends active today</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {friends.slice(0, 6).map((friend) => (
                  <div key={friend.id} className="flex flex-col items-center gap-1 shrink-0">
                    <UserAvatar user={friend} size="md" showRing />
                    <span className="text-xs text-muted-foreground">@{friend.username.split('.')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Feeling Lucky Result */}
        {flowState === 'feeling-lucky' && selectedTask && (
          <TaskRevealScreen
            key="feeling-lucky"
            task={selectedTask}
            rerolls={availableRerolls}
            onReroll={handleReroll}
            onAccept={handleAcceptTask}
            onBack={handleBack}
            tagline="This one might spread."
          />
        )}

        {/* Pick Own - Task Browser */}
        {flowState === 'pick-own' && (
          <TaskBrowserScreen
            key="pick-own"
            realm={todayRealm}
            onSelect={handleSelectTask}
            onBack={handleBack}
          />
        )}

        {/* Friend Pick - Select Friend */}
        {flowState === 'friend-pick-select' && (
          <FriendSelectScreen
            key="friend-select"
            friends={friends}
            onSelect={handleSelectFriend}
            onBack={handleBack}
          />
        )}

        {/* Friend Pick - Pending */}
        {flowState === 'friend-pick-pending' && selectedFriend && (
          <FriendPickPendingScreen
            key="friend-pending"
            friend={selectedFriend}
            realm={todayRealm}
          />
        )}

        {/* Friend Pick - Received */}
        {flowState === 'friend-pick-received' && selectedTask && selectedFriend && (
          <TaskRevealScreen
            key="friend-received"
            task={selectedTask}
            friend={selectedFriend}
            friendNote={friendNote}
            onAccept={handleAcceptTask}
            onBack={handleBack}
            tagline="Your friend chose chaos for you."
          />
        )}

        {/* Task Selected */}
        {flowState === 'task-selected' && selectedTask && (
          <TaskRevealScreen
            key="task-selected"
            task={selectedTask}
            onAccept={handleAcceptTask}
            onBack={handleBack}
            tagline="Looks like a good fit."
          />
        )}

        {/* Receipt Composer */}
        {flowState === 'receipt' && selectedTask && (
          <motion.div
            key="receipt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-6"
          >
            <ReceiptComposer
              task={selectedTask}
              onSubmit={handleSubmitReceipt}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-screens
function TaskRevealScreen({
  task,
  friend,
  friendNote,
  rerolls,
  onReroll,
  onAccept,
  onBack,
  tagline,
}: {
  task: Task;
  friend?: User;
  friendNote?: string;
  rerolls?: number;
  onReroll?: () => void;
  onAccept: () => void;
  onBack: () => void;
  tagline: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-6"
    >
      <button
        onClick={onBack}
        className="mb-6 p-2 rounded-full hover:bg-surface-1 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {friend && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-violet/10 border border-violet/30">
          <UserAvatar user={friend} size="md" />
          <div>
            <p className="font-medium">@{friend.username} picked this for you</p>
            {friendNote && (
              <p className="text-sm text-muted-foreground italic">&quot;{friendNote}&quot;</p>
            )}
          </div>
        </div>
      )}

      <p className="text-muted-foreground mb-4">{tagline}</p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <TaskCard task={task} showFullDetails />
      </motion.div>

      {onReroll && rerolls !== undefined && (
        <motion.button
          onClick={onReroll}
          disabled={rerolls <= 0}
          className={cn(
            'w-full mt-4 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors',
            rerolls > 0 
              ? 'bg-surface-1 hover:bg-surface-2 text-foreground'
              : 'bg-surface-1/50 text-muted-foreground cursor-not-allowed'
          )}
          whileTap={rerolls > 0 ? { scale: 0.98 } : undefined}
        >
          <RotateCcw className="w-4 h-4" />
          {rerolls > 0 ? `Reroll (${rerolls} left)` : 'No rerolls left'}
        </motion.button>
      )}

      <Button
        onClick={onAccept}
        size="lg"
        className="w-full mt-4 rounded-xl bg-lime text-background hover:bg-lime/90"
      >
        <Camera className="w-5 h-5 mr-2" />
        Accept & Post Receipt
      </Button>
    </motion.div>
  );
}

function TaskBrowserScreen({
  realm,
  onSelect,
  onBack,
}: {
  realm: Realm;
  onSelect: (task: Task) => void;
  onBack: () => void;
}) {
  const tasks = getTasksByRealm(realm);
  const [filter, setFilter] = useState<'all' | 'Mild' | 'Bold' | 'Unhinged'>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.vibe === filter);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold">Pick a task</h2>
          <p className="text-sm text-muted-foreground">{realm} realm</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'Mild', 'Bold', 'Unhinged'].map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v as typeof filter)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0',
              filter === v 
                ? 'bg-lime text-background'
                : 'bg-surface-1 text-foreground hover:bg-surface-2'
            )}
          >
            {v === 'all' ? 'All vibes' : v}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onSelect(task)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FriendSelectScreen({
  friends,
  onSelect,
  onBack,
}: {
  friends: User[];
  onSelect: (friend: User) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold">Ask a friend</h2>
          <p className="text-sm text-muted-foreground">They&apos;ll pick from 3 options</p>
        </div>
      </div>

      <div className="space-y-2">
        {friends.map((friend) => (
          <UserRow
            key={friend.id}
            user={friend}
            onClick={() => onSelect(friend)}
            showStats
            rightElement={
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            }
          />
        ))}
      </div>
    </motion.div>
  );
}

function FriendPickPendingScreen({
  friend,
  realm,
}: {
  friend: User;
  realm: Realm;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <UserAvatar user={friend} size="xl" />
      </motion.div>
      
      <h2 className="text-2xl font-bold mt-6 mb-2">@{friend.username} is choosing...</h2>
      <p className="text-muted-foreground">
        They&apos;re picking from 3 tasks in the <RealmBadge realm={realm} /> realm
      </p>

      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-violet"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
