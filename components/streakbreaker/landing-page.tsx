'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Sparkles, CheckCircle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
}

const stats = [
  { value: '47', label: 'Active campuses' },
  { value: '2.4k', label: 'Tasks completed today' },
  { value: '12k+', label: 'Users in demo' },
];

const steps = [
  { icon: '🎲', title: 'Realm', description: 'Get assigned a daily vibe category' },
  { icon: '✨', title: 'Task', description: 'Choose your pattern-breaking move' },
  { icon: '📸', title: 'Receipt', description: 'Post proof of your chaos' },
  { icon: '🔥', title: 'React', description: 'Judge your friends, spread the vibes' },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-lime/20 blur-[100px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-violet/20 blur-[100px]"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-coral/10 blur-[120px]"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Name */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-lime via-cyan to-violet bg-clip-text text-transparent">
                Streak
              </span>
              <span className="text-foreground">breaker</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The social anti-routine game.
            <br />
            <span className="text-foreground">Break patterns. Start chains.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-lime text-background hover:bg-lime/90 rounded-full px-8 py-6 text-lg font-semibold glow-lime"
            >
              Enter Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Device mockup */}
        <motion.div
          className="relative z-10 mt-16 w-full max-w-xs mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="relative rounded-[2.5rem] border-4 border-secondary bg-card p-2 shadow-2xl">
            <div className="aspect-[9/16] rounded-[2rem] bg-background overflow-hidden">
              {/* Fake app screen */}
              <div className="p-4 h-full flex flex-col">
                <div className="text-center mb-4">
                  <span className="text-xs text-muted-foreground">Today&apos;s Realm</span>
                  <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet/20">
                    <span className="text-2xl">👋</span>
                    <span className="font-semibold text-violet">Social</span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-3">
                  <motion.div
                    className="p-3 rounded-xl bg-card border border-border"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-xs text-muted-foreground mb-1">Feeling Lucky</p>
                    <p className="text-sm font-medium">Compliment a stranger genuinely</p>
                  </motion.div>
                  
                  <div className="p-3 rounded-xl bg-lime/10 border border-lime/30">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-coral" />
                      <span className="text-sm">7 day run</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute -left-8 top-1/4 px-3 py-1.5 rounded-lg bg-coral/90 text-background text-xs font-medium shadow-lg"
            animate={{ y: [0, -10, 0], rotate: [-5, -5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🔥 Let&apos;s gooo
          </motion.div>
          
          <motion.div
            className="absolute -right-8 top-1/2 px-3 py-1.5 rounded-lg bg-violet/90 text-foreground text-xs font-medium shadow-lg"
            animate={{ y: [0, 10, 0], rotate: [5, 5, 5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            🚀 I&apos;m in
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-lg mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="p-6 rounded-2xl bg-lime/10 border border-lime/30">
              <Zap className="w-8 h-8 text-lime mb-3" />
              <h3 className="font-semibold mb-1">Daily realms</h3>
              <p className="text-sm text-muted-foreground">New category, new chaos potential</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-coral/10 border border-coral/30">
              <Users className="w-8 h-8 text-coral mb-3" />
              <h3 className="font-semibold mb-1">Friend picks</h3>
              <p className="text-sm text-muted-foreground">Let friends choose your fate</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-violet/10 border border-violet/30">
              <Sparkles className="w-8 h-8 text-violet mb-3" />
              <h3 className="font-semibold mb-1">Weekly duos</h3>
              <p className="text-sm text-muted-foreground">Paired challenges with friends</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-cyan/10 border border-cyan/30">
              <CheckCircle className="w-8 h-8 text-cyan mb-3" />
              <h3 className="font-semibold mb-1">Campus verified</h3>
              <p className="text-sm text-muted-foreground">Trust signals built in</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to break the streak?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands already disrupting their daily patterns.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-lime text-background hover:bg-lime/90 rounded-full px-8 py-6 text-lg font-semibold"
          >
            Start Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
