export type Vibe = 'Mild' | 'Bold' | 'Unhinged';

export type Realm = 
  | 'Food'
  | 'Place'
  | 'Social'
  | 'Communication'
  | 'Style'
  | 'Tiny Chaos'
  | 'Campus'
  | 'Comfort Zone';

export type SocialRisk = 'low' | 'medium' | 'high';
export type TimeEstimate = '< 5 min' | '5-15 min' | '15-30 min' | '30+ min';
export type ProofType = 'photo' | 'text' | 'either';

export interface Task {
  id: string;
  realm: Realm;
  title: string;
  description: string;
  vibe: Vibe;
  socialRisk: SocialRisk;
  timeEstimate: TimeEstimate;
  proofTypeSuggestion: ProofType;
  canBeFriendPicked: boolean;
  canBeDuo: boolean;
  tags: string[];
  chainPotential: 'low' | 'medium' | 'high';
  shortLabel?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  vibe: Vibe;
  currentRun: number;
  tasksCompleted: number;
  realmsExplored: Realm[];
  influenceScore: number;
  rerolls: number;
  friends: string[];
  badges: Badge[];
  topRealms: Realm[];
  knownFor: string[];
  isVerified: boolean;
  friendGroup?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface Receipt {
  id: string;
  taskId: string;
  userId: string;
  imageUrl?: string;
  caption: string;
  witnessTagId?: string;
  createdAt: Date;
  reactions: Reaction[];
  imInCount: number;
  chainCount: number;
}

export interface Reaction {
  id: string;
  userId: string;
  type: 'lets-go' | 'could-do-more' | 'im-in';
  createdAt: Date;
}

export interface FriendGroup {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
  weeklyDuoPairings: DuoPairing[];
  topRealms: Realm[];
  tasksCompletedThisWeek: number;
}

export interface DuoPairing {
  id: string;
  userId1: string;
  userId2: string;
  sharedRealm?: Realm;
  sharedTask?: Task;
  isCompleted: boolean;
  completedBy: string[];
  weekOf: Date;
}

export interface Notification {
  id: string;
  type: 
    | 'friend-picked'
    | 'reaction'
    | 'im-in'
    | 'duo-assigned'
    | 'invite-reward'
    | 'trending'
    | 'task-stolen'
    | 'badge-earned';
  title: string;
  body: string;
  userId?: string;
  createdAt: Date;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export interface FeedPost {
  id: string;
  user: User;
  task: Task;
  receipt: Receipt;
  createdAt: Date;
  trendingScore?: number;
  copiedBy: string[];
}

export interface AppState {
  currentUser: User;
  todayRealm: Realm;
  selectedTask: Task | null;
  taskSelectionMode: 'none' | 'feeling-lucky' | 'pick-own' | 'friend-pick';
  friendPickStatus: 'selecting' | 'pending' | 'received' | null;
  friendPicker?: User;
  friendPickNote?: string;
  savedTasks: Task[];
  reactionDeck: FeedPost[];
  notifications: Notification[];
  feed: FeedPost[];
}

export interface OnboardingState {
  step: number;
  vibe?: Vibe;
  favoriteRealms: Realm[];
  username: string;
  avatar?: string;
  friendGroupAction: 'create' | 'join' | null;
  friendGroupName?: string;
  isVerified: boolean;
}

export type Screen = 
  | 'today' 
  | 'feed' 
  | 'react' 
  | 'friends' 
  | 'profile' 
  | 'notifications' 
  | 'settings';
