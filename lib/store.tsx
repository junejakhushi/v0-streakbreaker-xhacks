'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppState, Task, Realm, User, FeedPost, Notification, OnboardingState, Vibe } from './types';
import { currentDemoUser, mockUsers, getUserById } from './data/users';
import { getTodayRealm, generateMockFeed, generateReactionDeck, mockNotifications, getRandomFriendPickNote } from './data/feed';
import { getRandomTask, getFriendPickOptions, tasks } from './data/tasks';

interface StoreContextType {
  state: AppState;
  onboarding: OnboardingState;
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;
  updateOnboarding: (updates: Partial<OnboardingState>) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  selectTask: (task: Task) => void;
  clearSelectedTask: () => void;
  feelingLucky: () => void;
  useReroll: () => boolean;
  startFriendPick: (friend: User) => void;
  receiveFriendPick: (task: Task, note?: string) => void;
  submitReceipt: (caption: string, imageUrl?: string) => void;
  reactToPost: (postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => void;
  saveTask: (task: Task) => void;
  removeFromDeck: (postId: string) => void;
  markNotificationRead: (id: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isOnboarded, setOnboarded] = useState(false);
  
  const [onboarding, setOnboarding] = useState<OnboardingState>({
    step: 0,
    vibe: undefined,
    favoriteRealms: [],
    username: '',
    avatar: undefined,
    friendGroupAction: null,
    friendGroupName: undefined,
    isVerified: false,
  });

  const [state, setState] = useState<AppState>(() => ({
    currentUser: currentDemoUser,
    todayRealm: getTodayRealm(),
    selectedTask: null,
    taskSelectionMode: 'none',
    friendPickStatus: null,
    friendPicker: undefined,
    friendPickNote: undefined,
    savedTasks: [],
    reactionDeck: generateReactionDeck(),
    notifications: mockNotifications,
    feed: generateMockFeed(),
  }));

  const updateOnboarding = useCallback((updates: Partial<OnboardingState>) => {
    setOnboarding(prev => ({ ...prev, ...updates }));
  }, []);

  const nextOnboardingStep = useCallback(() => {
    setOnboarding(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevOnboardingStep = useCallback(() => {
    setOnboarding(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  }, []);

  const selectTask = useCallback((task: Task) => {
    setState(prev => ({
      ...prev,
      selectedTask: task,
      taskSelectionMode: 'pick-own',
    }));
  }, []);

  const clearSelectedTask = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedTask: null,
      taskSelectionMode: 'none',
      friendPickStatus: null,
      friendPicker: undefined,
      friendPickNote: undefined,
    }));
  }, []);

  const feelingLucky = useCallback(() => {
    const task = getRandomTask(state.todayRealm, state.currentUser.vibe);
    setState(prev => ({
      ...prev,
      selectedTask: task,
      taskSelectionMode: 'feeling-lucky',
    }));
  }, [state.todayRealm, state.currentUser.vibe]);

  const useReroll = useCallback(() => {
    if (state.currentUser.rerolls <= 0) return false;
    
    const task = getRandomTask(state.todayRealm, state.currentUser.vibe);
    setState(prev => ({
      ...prev,
      selectedTask: task,
      currentUser: {
        ...prev.currentUser,
        rerolls: prev.currentUser.rerolls - 1,
      },
    }));
    return true;
  }, [state.currentUser.rerolls, state.todayRealm, state.currentUser.vibe]);

  const startFriendPick = useCallback((friend: User) => {
    setState(prev => ({
      ...prev,
      taskSelectionMode: 'friend-pick',
      friendPickStatus: 'pending',
      friendPicker: friend,
    }));

    // Simulate friend picking after delay
    setTimeout(() => {
      const options = getFriendPickOptions(state.todayRealm);
      const picked = options[Math.floor(Math.random() * options.length)];
      const note = getRandomFriendPickNote();
      
      setState(prev => ({
        ...prev,
        selectedTask: picked,
        friendPickStatus: 'received',
        friendPickNote: note,
      }));
    }, 2500);
  }, [state.todayRealm]);

  const receiveFriendPick = useCallback((task: Task, note?: string) => {
    setState(prev => ({
      ...prev,
      selectedTask: task,
      friendPickStatus: 'received',
      friendPickNote: note,
    }));
  }, []);

  const submitReceipt = useCallback((caption: string, imageUrl?: string) => {
    setState(prev => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        tasksCompleted: prev.currentUser.tasksCompleted + 1,
        currentRun: prev.currentUser.currentRun + 1,
        influenceScore: prev.currentUser.influenceScore + 10,
      },
      selectedTask: null,
      taskSelectionMode: 'none',
    }));
  }, []);

  const reactToPost = useCallback((postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => {
    setState(prev => {
      const post = prev.reactionDeck.find(p => p.id === postId);
      
      if (reaction === 'im-in' && post) {
        // Save the task to user's saved tasks
        return {
          ...prev,
          savedTasks: [...prev.savedTasks, post.task],
          reactionDeck: prev.reactionDeck.filter(p => p.id !== postId),
        };
      }
      
      return {
        ...prev,
        reactionDeck: prev.reactionDeck.filter(p => p.id !== postId),
      };
    });
  }, []);

  const removeFromDeck = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      reactionDeck: prev.reactionDeck.filter(p => p.id !== postId),
    }));
  }, []);

  const saveTask = useCallback((task: Task) => {
    setState(prev => ({
      ...prev,
      savedTasks: [...prev.savedTasks, task],
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      currentUser: { ...prev.currentUser, ...updates },
    }));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        onboarding,
        isOnboarded,
        setOnboarded,
        updateOnboarding,
        nextOnboardingStep,
        prevOnboardingStep,
        selectTask,
        clearSelectedTask,
        feelingLucky,
        useReroll,
        startFriendPick,
        receiveFriendPick,
        submitReceipt,
        reactToPost,
        saveTask,
        removeFromDeck,
        markNotificationRead,
        updateUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
