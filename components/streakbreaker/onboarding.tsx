'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Vibe, Realm } from '@/lib/types';
import { RealmCard } from './realm-card';
import { realms } from '@/lib/data/tasks';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  vibe: Vibe;
  favoriteRealms: Realm[];
  username: string;
  avatar: string;
  friendGroupAction: 'create' | 'join';
  friendGroupName?: string;
  isVerified: boolean;
}

const vibes: { value: Vibe; label: string; description: string; emoji: string }[] = [
  { value: 'Mild', label: 'Mild', description: 'Gentle pattern breaks. Low stakes, high consistency.', emoji: '🌱' },
  { value: 'Bold', label: 'Bold', description: 'Noticeable moves. Some social risk, good stories.', emoji: '⚡' },
  { value: 'Unhinged', label: 'Unhinged', description: 'Main character energy. High chaos, legendary receipts.', emoji: '🔥' },
];

const avatarSeeds = ['Alex', 'Jordan', 'Sam', 'Riley', 'Casey', 'Morgan', 'Drew', 'Quinn'];

const TOTAL_STEPS = 7;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [favoriteRealms, setFavoriteRealms] = useState<Realm[]>([]);
  const [username, setUsername] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(avatarSeeds[0]);
  const [friendGroupAction, setFriendGroupAction] = useState<'create' | 'join' | null>(null);
  const [friendGroupName, setFriendGroupName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const toggleRealm = (realm: Realm) => {
    setFavoriteRealms(prev =>
      prev.includes(realm)
        ? prev.filter(r => r !== realm)
        : prev.length < 3 ? [...prev, realm] : prev
    );
  };

  const handleComplete = () => {
    if (!vibe) return;
    const finalUsername = username || `breaker${Math.floor(Math.random() * 10000)}`;
    onComplete({
      vibe,
      favoriteRealms,
      username: finalUsername,
      avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarSeed}`,
      friendGroupAction: friendGroupAction || 'join',
      friendGroupName,
      isVerified,
    });
  };

  const simulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return vibe !== null;
      case 2: return favoriteRealms.length >= 1;
      case 3: return username.length >= 3;
      case 4: return true;
      case 5: return friendGroupAction !== null;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-primary' : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <OnboardingStep key="welcome">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-lime/20 flex items-center justify-center mb-8"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-12 h-12 text-lime" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-4">Welcome to Streakbreaker</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
                  The social anti-routine game. Let&apos;s get you set up in less than a minute.
                </p>
              </div>
            </OnboardingStep>
          )}

          {/* Step 1: Choose vibe */}
          {step === 1 && (
            <OnboardingStep key="vibe">
              <h2 className="text-2xl font-bold mb-2">Choose your vibe</h2>
              <p className="text-muted-foreground mb-8">This affects the intensity of tasks you&apos;ll see.</p>
              
              <div className="space-y-4">
                {vibes.map((v) => (
                  <motion.button
                    key={v.value}
                    onClick={() => setVibe(v.value)}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all',
                      vibe === v.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{v.emoji}</span>
                      <div>
                        <p className="font-semibold text-lg">{v.label}</p>
                        <p className="text-sm text-muted-foreground">{v.description}</p>
                      </div>
                      {vibe === v.value && (
                        <CheckCircle2 className="w-6 h-6 text-primary ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </OnboardingStep>
          )}

          {/* Step 2: Choose realms */}
          {step === 2 && (
            <OnboardingStep key="realms">
              <h2 className="text-2xl font-bold mb-2">Pick your favorite realms</h2>
              <p className="text-muted-foreground mb-8">Choose 1-3 categories you&apos;re drawn to.</p>
              
              <div className="grid grid-cols-4 gap-4">
                {realms.map((realm) => (
                  <RealmCard
                    key={realm}
                    realm={realm}
                    isSelected={favoriteRealms.includes(realm)}
                    onClick={() => toggleRealm(realm)}
                    size="md"
                  />
                ))}
              </div>
              
              <p className="text-center text-sm text-muted-foreground mt-6">
                {favoriteRealms.length}/3 selected
              </p>
            </OnboardingStep>
          )}

          {/* Step 3: Username */}
          {step === 3 && (
            <OnboardingStep key="username">
              <h2 className="text-2xl font-bold mb-2">Create your handle</h2>
              <p className="text-muted-foreground mb-8">This is how friends will find you.</p>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
                  placeholder="yourname"
                  className="pl-8 h-14 text-lg rounded-xl"
                  maxLength={20}
                />
              </div>
              
              {username.length > 0 && username.length < 3 && (
                <p className="text-sm text-coral mt-2">Username must be at least 3 characters</p>
              )}
            </OnboardingStep>
          )}

          {/* Step 4: Avatar */}
          {step === 4 && (
            <OnboardingStep key="avatar">
              <h2 className="text-2xl font-bold mb-2">Choose your look</h2>
              <p className="text-muted-foreground mb-8">Pick an avatar that fits your energy.</p>
              
              <div className="flex justify-center mb-8">
                <motion.div
                  className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary"
                  key={avatarSeed}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarSeed}`}
                    alt="Avatar"
                    className="w-full h-full"
                  />
                </motion.div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {avatarSeeds.map((seed) => (
                  <motion.button
                    key={seed}
                    onClick={() => setAvatarSeed(seed)}
                    className={cn(
                      'w-16 h-16 rounded-full overflow-hidden transition-all',
                      avatarSeed === seed ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                    )}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`}
                      alt={seed}
                      className="w-full h-full"
                    />
                  </motion.button>
                ))}
              </div>
            </OnboardingStep>
          )}

          {/* Step 5: Friend group */}
          {step === 5 && (
            <OnboardingStep key="friends">
              <h2 className="text-2xl font-bold mb-2">Join or create a group</h2>
              <p className="text-muted-foreground mb-8">Friend groups make everything better.</p>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => setFriendGroupAction('join')}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left transition-all',
                    friendGroupAction === 'join'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-cyan" />
                    <div>
                      <p className="font-semibold">Join The Chaos Crew</p>
                      <p className="text-sm text-muted-foreground">Demo group with 4 active members</p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => setFriendGroupAction('create')}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left transition-all',
                    friendGroupAction === 'create'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-violet" />
                    <div>
                      <p className="font-semibold">Create a new group</p>
                      <p className="text-sm text-muted-foreground">Start fresh with your friends</p>
                    </div>
                  </div>
                </motion.button>
              </div>
              
              {friendGroupAction === 'create' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <Input
                    value={friendGroupName}
                    onChange={(e) => setFriendGroupName(e.target.value)}
                    placeholder="Group name"
                    className="h-12 rounded-xl"
                  />
                </motion.div>
              )}
            </OnboardingStep>
          )}

          {/* Step 6: Verification */}
          {step === 6 && (
            <OnboardingStep key="verify">
              <h2 className="text-2xl font-bold mb-2">Verify your campus</h2>
              <p className="text-muted-foreground mb-8">Optional, but adds a trust badge to your profile.</p>
              
              <div className="space-y-4">
                {!isVerified ? (
                  <motion.button
                    onClick={simulateVerification}
                    disabled={isVerifying}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all',
                      'border-cyan/30 bg-cyan/10 hover:bg-cyan/20'
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-8 h-8 text-cyan" />
                      <div className="flex-1">
                        <p className="font-semibold">Verify with .edu email</p>
                        <p className="text-sm text-muted-foreground">
                          {isVerifying ? 'Verifying...' : 'Tap to simulate verification'}
                        </p>
                      </div>
                      {isVerifying && (
                        <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </motion.button>
                ) : (
                  <motion.div
                    className="w-full p-4 rounded-2xl border border-lime/30 bg-lime/10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-lime" />
                      <div>
                        <p className="font-semibold text-lime">Verified!</p>
                        <p className="text-sm text-muted-foreground">Your profile now has a trust badge</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <button
                  onClick={() => setStep(TOTAL_STEPS - 1)}
                  className="w-full p-4 text-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </OnboardingStep>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 flex items-center gap-4">
        {step > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={prevStep}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <Button
          size="lg"
          onClick={step === TOTAL_STEPS - 1 ? handleComplete : nextStep}
          disabled={!canProceed()}
          className="flex-1 rounded-full bg-primary text-primary-foreground"
        >
          {step === TOTAL_STEPS - 1 ? 'Start Breaking Streaks' : 'Continue'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function OnboardingStep({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
