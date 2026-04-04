import { FeedPost, Receipt, Notification, FriendGroup, DuoPairing } from '../types';
import { mockUsers, getUserById, currentDemoUser } from './users';
import { tasks, getRandomTask, realms } from './tasks';

const generateReceipt = (taskId: string, userId: string, imageUrl?: string): Receipt => {
  const captions = [
    'Did it. No regrets.',
    'This one felt weird but in a good way.',
    'Proof or it didn\'t happen.',
    'Honestly surprised myself.',
    'More fun than expected.',
    'Chaos achieved.',
    'Would recommend.',
    'The looks I got...',
    'First time for everything.',
    'Not my comfort zone, but here we are.',
    'The things I do for this app.',
    'Actually proud of this one.',
  ];

  return {
    id: `receipt-${taskId}-${userId}`,
    taskId,
    userId,
    imageUrl,
    caption: captions[Math.floor(Math.random() * captions.length)],
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
    reactions: [],
    imInCount: Math.floor(Math.random() * 15),
    chainCount: Math.floor(Math.random() * 8),
  };
};

const receiptImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=400&h=400&fit=crop',
];

export const generateMockFeed = (): FeedPost[] => {
  const posts: FeedPost[] = [];
  
  mockUsers.slice(0, 10).forEach((user, index) => {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    const receipt = generateReceipt(
      task.id, 
      user.id, 
      receiptImages[index % receiptImages.length]
    );
    
    posts.push({
      id: `post-${user.id}-${task.id}`,
      user,
      task,
      receipt,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 2),
      trendingScore: Math.floor(Math.random() * 100),
      copiedBy: mockUsers
        .slice(0, Math.floor(Math.random() * 5))
        .map(u => u.id),
    });
  });

  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const generateReactionDeck = (): FeedPost[] => {
  return generateMockFeed().slice(0, 8);
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'friend-picked',
    title: 'Maya picked your task',
    body: 'She chose "Ask the server to surprise you" for you. Prepare yourself.',
    userId: 'user-1',
    createdAt: new Date(Date.now() - 1800000),
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'reaction',
    title: '3 people hit Let\'s gooo',
    body: 'Leo, Priya, and Jay reacted to your receipt',
    createdAt: new Date(Date.now() - 3600000),
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'im-in',
    title: 'Leo is in on your task',
    body: '"Mystery order" is spreading. 4 people have copied it.',
    userId: 'user-2',
    createdAt: new Date(Date.now() - 7200000),
    isRead: false,
  },
  {
    id: 'notif-4',
    type: 'duo-assigned',
    title: 'Duo partner assigned',
    body: 'You and Priya are duo partners this week. Realm: Social.',
    userId: 'user-3',
    createdAt: new Date(Date.now() - 14400000),
    isRead: true,
  },
  {
    id: 'notif-5',
    type: 'invite-reward',
    title: 'Invite reward unlocked',
    body: 'Sam joined! You earned 1 reroll.',
    userId: 'user-5',
    createdAt: new Date(Date.now() - 28800000),
    isRead: true,
  },
  {
    id: 'notif-6',
    type: 'trending',
    title: 'Your task is trending',
    body: '"Bold colors" is catching on in your circle.',
    createdAt: new Date(Date.now() - 43200000),
    isRead: true,
  },
  {
    id: 'notif-7',
    type: 'task-stolen',
    title: 'Someone stole your move',
    body: 'Zoe copied "Solo dine" from your feed.',
    userId: 'user-6',
    createdAt: new Date(Date.now() - 57600000),
    isRead: true,
  },
  {
    id: 'notif-8',
    type: 'badge-earned',
    title: 'New badge: Friend Bait',
    body: 'You\'ve had 10 tasks friend-picked!',
    createdAt: new Date(Date.now() - 86400000),
    isRead: true,
  },
  {
    id: 'notif-9',
    type: 'reaction',
    title: 'Alex hit "Could do more"',
    body: 'Fair. It was a pretty mild task.',
    userId: 'user-7',
    createdAt: new Date(Date.now() - 100800000),
    isRead: true,
  },
  {
    id: 'notif-10',
    type: 'im-in',
    title: '2 more joined your chain',
    body: 'Jordan and Riley are in on "Voice only".',
    createdAt: new Date(Date.now() - 115200000),
    isRead: true,
  },
];

export const mockFriendGroups: FriendGroup[] = [
  {
    id: 'group-1',
    name: 'The Chaos Crew',
    members: ['current-user', 'user-1', 'user-2', 'user-3', 'user-4'],
    createdAt: new Date(Date.now() - 86400000 * 30),
    weeklyDuoPairings: [],
    topRealms: ['Food', 'Social', 'Tiny Chaos'],
    tasksCompletedThisWeek: 23,
  },
  {
    id: 'group-2',
    name: 'Midnight Study Club',
    members: ['user-5', 'user-6'],
    createdAt: new Date(Date.now() - 86400000 * 45),
    weeklyDuoPairings: [],
    topRealms: ['Campus', 'Communication', 'Place'],
    tasksCompletedThisWeek: 12,
  },
  {
    id: 'group-3',
    name: 'Bold Movers',
    members: ['user-7', 'user-8', 'user-9'],
    createdAt: new Date(Date.now() - 86400000 * 20),
    weeklyDuoPairings: [],
    topRealms: ['Comfort Zone', 'Style', 'Tiny Chaos'],
    tasksCompletedThisWeek: 18,
  },
  {
    id: 'group-4',
    name: 'Campus Explorers',
    members: ['user-10', 'user-11', 'user-12'],
    createdAt: new Date(Date.now() - 86400000 * 60),
    weeklyDuoPairings: [],
    topRealms: ['Campus', 'Social', 'Food'],
    tasksCompletedThisWeek: 15,
  },
];

export const mockDuoPairings: DuoPairing[] = [
  {
    id: 'duo-1',
    userId1: 'current-user',
    userId2: 'user-3',
    sharedRealm: 'Social',
    isCompleted: false,
    completedBy: [],
    weekOf: new Date(),
  },
  {
    id: 'duo-2',
    userId1: 'user-1',
    userId2: 'user-2',
    sharedRealm: 'Food',
    isCompleted: true,
    completedBy: ['user-1', 'user-2'],
    weekOf: new Date(),
  },
  {
    id: 'duo-3',
    userId1: 'user-4',
    userId2: 'user-5',
    sharedRealm: 'Style',
    isCompleted: false,
    completedBy: ['user-4'],
    weekOf: new Date(),
  },
];

export const getCurrentDuoPairing = (): DuoPairing | undefined => {
  return mockDuoPairings.find(
    duo => duo.userId1 === 'current-user' || duo.userId2 === 'current-user'
  );
};

export const getDuoPartner = (): User | undefined => {
  const pairing = getCurrentDuoPairing();
  if (!pairing) return undefined;
  const partnerId = pairing.userId1 === 'current-user' ? pairing.userId2 : pairing.userId1;
  return getUserById(partnerId);
};

export const getTodayRealm = (): typeof realms[number] => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return realms[dayOfYear % realms.length];
};

export const friendPickNotes = [
  'This one\'s perfect for you.',
  'I chose chaos.',
  'Trust me on this one.',
  'You can do better than mild.',
  'Time to step up.',
  'This has your name on it.',
  'No rerolls allowed.',
  'I believe in you. Sort of.',
  'This is going to be good.',
  'You asked for it.',
];

export const getRandomFriendPickNote = (): string => {
  return friendPickNotes[Math.floor(Math.random() * friendPickNotes.length)];
};
