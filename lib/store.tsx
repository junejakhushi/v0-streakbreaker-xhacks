'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppState, Task, Realm, User, FeedPost, OnboardingState, Vibe, Screen } from './types';
import { currentDemoUser, mockUsers, getUserById } from './data/users';
import { getTodayRealm, generateMockFeed, generateReactionDeck, mockNotifications, getRandomFriendPickNote } from './data/feed';
import { getRandomTask, getFriendPickOptions, tasks } from './data/tasks';

interface AppStateContextType {
  // App-level state
  currentUser: User | null;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  isOnboarding: boolean;
  setIsOnboarding: (value: boolean) => void;
  hasSeenLanding: boolean;
  setHasSeenLanding: (value: boolean) => void;
  
  // Core state
  state: AppState;
  onboarding: OnboardingState;
  
  // Onboarding
  updateOnboarding: (updates: Partial<OnboardingState>) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  completeOnboarding: (userData: Partial<User>) => void;
  
  // Task actions
  selectTask: (task: Task) => void;
  clearSelectedTask: () => void;
  feelingLucky: () => void;
  useReroll: () => boolean;
  startFriendPick: (friend: User) => void;
  receiveFriendPick: (task: Task, note?: string) => void;
  submitReceipt: (caption: string, imageUrl?: string) => void;
  
  // Social actions
  reactionDeck: FeedPost[];
  reactToPost: (postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => void;
  saveTask: (task: Task) => void;
  removeFromDeck: (postId: string) => void;
  markNotificationRead: (id: string) => void;
  
  // User actions
  updateUser: (updates: Partial<User>) => void;
  resetApp: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // App-level state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('today');
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  
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

  const completeOnboarding = useCallback((userData: Partial<User>) => {
    const newUser: User = {
      ...currentDemoUser,
      id: 'user-1',
      username: userData.username || onboarding.username || 'user',
      displayName: userData.displayName || userData.username || onboarding.username || 'User',
      avatar: userData.avatar || onboarding.avatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${Date.now()}`,
      vibe: userData.vibe || onboarding.vibe || 'Bold',
      topRealms: onboarding.favoriteRealms.length >= 3 
        ? onboarding.favoriteRealms.slice(0, 3) as [Realm, Realm, Realm]
        : ['Social', 'Creative', 'Adventure'] as [Realm, Realm, Realm],
    };
    setCurrentUser(newUser);
    setState(prev => ({ ...prev, currentUser: newUser }));
    setIsOnboarding(false);
  }, [onboarding]);

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
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        currentRun: prev.currentRun + 1,
        influenceScore: prev.influenceScore + 10,
      } : null);
    }
  }, [currentUser]);

  const reactToPost = useCallback((postId: string, reaction: 'lets-go' | 'could-do-more' | 'im-in') => {
    setState(prev => {
      const post = prev.reactionDeck.find(p => p.id === postId);
      
      if (reaction === 'im-in' && post) {
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
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser]);

  const resetApp = useCallback(() => {
    setCurrentUser(null);
    setIsOnboarding(true);
    setHasSeenLanding(false);
    setOnboarding({
      step: 0,
      vibe: undefined,
      favoriteRealms: [],
      username: '',
      avatar: undefined,
      friendGroupAction: null,
      friendGroupName: undefined,
      isVerified: false,
    });
    setState({
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
    });
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        currentScreen,
        setCurrentScreen,
        isOnboarding,
        setIsOnboarding,
        hasSeenLanding,
        setHasSeenLanding,
        state,
        onboarding,
        updateOnboarding,
        nextOnboardingStep,
        prevOnboardingStep,
        completeOnboarding,
        selectTask,
        clearSelectedTask,
        feelingLucky,
        useReroll,
        startFriendPick,
        receiveFriendPick,
        submitReceipt,
        reactToPost,
        reactionDeck: state.reactionDeck,
        saveTask,
        removeFromDeck,
        markNotificationRead,
        updateUser,
        resetApp,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Export aliases for compatibility
export { AppStateProvider, useAppState };
export const useStore = useAppState;
export const StoreProvider = AppStateProvider;
