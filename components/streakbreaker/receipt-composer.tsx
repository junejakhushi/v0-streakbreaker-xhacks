'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Type, X, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/lib/types';
import { RealmBadge } from './realm-card';
import { cn } from '@/lib/utils';

interface ReceiptComposerProps {
  task: Task;
  onSubmit: (caption: string, imageUrl?: string) => void;
  onBack: () => void;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
];

export function ReceiptComposer({ task, onSubmit, onBack }: ReceiptComposerProps) {
  const [proofType, setProofType] = useState<'photo' | 'text'>(
    task.proofTypeSuggestion === 'text' ? 'text' : 'photo'
  );
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const canSubmit = caption.length > 0 && (proofType === 'text' || selectedImage);

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      setTimeout(() => {
        onSubmit(caption, selectedImage || undefined);
      }, 1500);
    }, 1000);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-lime" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold mb-2"
        >
          Receipt posted!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground"
        >
          Your friends can now react to your move.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center gap-2 text-sm text-violet"
        >
          <Sparkles className="w-4 h-4" />
          <span>+10 influence earned</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold">Post your receipt</h2>
          <p className="text-sm text-muted-foreground">Prove you did the thing</p>
        </div>
      </div>

      {/* Task preview */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <RealmBadge realm={task.realm} className="mb-2" />
        <p className="font-semibold">{task.title}</p>
      </div>

      {/* Proof type toggle */}
      {task.proofTypeSuggestion === 'either' && (
        <div className="flex gap-2">
          <button
            onClick={() => setProofType('photo')}
            className={cn(
              'flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors',
              proofType === 'photo'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            )}
          >
            <Camera className="w-5 h-5" />
            Photo
          </button>
          <button
            onClick={() => setProofType('text')}
            className={cn(
              'flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors',
              proofType === 'text'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            )}
          >
            <Type className="w-5 h-5" />
            Text only
          </button>
        </div>
      )}

      {/* Photo upload */}
      {proofType === 'photo' && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select a demo image (in real app, you&apos;d upload your own):
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {sampleImages.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  selectedImage === img
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border hover:border-muted-foreground'
                )}
                whileTap={{ scale: 0.95 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Sample ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>

          {/* Upload button (demo) */}
          <button className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground transition-colors flex items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-5 h-5" />
            Upload your own (demo)
          </button>
        </div>
      )}

      {/* Caption */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Caption</label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="How did it go?"
          className="min-h-[100px] resize-none rounded-xl"
          maxLength={280}
        />
        <p className="text-xs text-muted-foreground text-right">
          {caption.length}/280
        </p>
      </div>

      {/* Preview */}
      {(selectedImage || caption) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-card border border-border"
        >
          <p className="text-sm text-muted-foreground mb-3">Preview</p>
          
          {selectedImage && (
            <div className="aspect-square rounded-xl overflow-hidden mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {caption && (
            <p className="text-foreground">&quot;{caption}&quot;</p>
          )}
        </motion.div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        size="lg"
        className="w-full rounded-xl bg-lime text-background hover:bg-lime/90"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
            Posting...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Post Receipt
          </>
        )}
      </Button>
    </div>
  );
}
