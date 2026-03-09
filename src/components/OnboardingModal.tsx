import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gender, GENDER_LABELS } from '@/types/family';
import { useFamilyTree } from '@/contexts/FamilyTreeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const { initializeTree } = useFamilyTree();

  const [step, setStep] = useState(1);
  const [treeName, setTreeName] = useState('');
  const [yourName, setYourName] = useState('');
  const [gender, setGender] = useState<Gender>('unknown');
  const [birthYear, setBirthYear] = useState('');

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setYourName('');
      setTreeName('');
      setGender('unknown');
      setBirthYear('');
    }, 300);
  };

  const handleNext = () => {
    if (step === 1 && yourName.trim()) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (!yourName.trim()) return;

    initializeTree(
      treeName.trim() || `${yourName}'s Family`,
      yourName.trim(),
      gender,
      birthYear ? parseInt(birthYear) : undefined
    );

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 1 && yourName.trim()) {
      handleNext();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass-strong border-0 shadow-frost-lg max-w-md p-8 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-elegant z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-editorial text-3xl font-light text-foreground/90">
                  Begin Your Story
                </DialogTitle>
                <DialogDescription className="text-editorial-italic text-base mt-3 text-muted-foreground">
                  Every family tree starts with you
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="yourName" className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Your Name
                  </Label>
                  <Input
                    id="yourName"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your name"
                    className="glass-subtle border-0 h-14 text-center text-lg placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!yourName.trim()}
                  className="w-full h-12 bg-foreground/90 text-background hover:bg-foreground text-base transition-elegant"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-editorial text-3xl font-light text-foreground/90">
                  A Few Details
                </DialogTitle>
                <DialogDescription className="text-editorial-italic text-base mt-3 text-muted-foreground">
                  Optional, but helps build your tree
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="treeName" className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Family Tree Name
                  </Label>
                  <Input
                    id="treeName"
                    value={treeName}
                    onChange={(e) => setTreeName(e.target.value)}
                    placeholder={`${yourName}'s Family`}
                    className="glass-subtle border-0 h-11 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Gender
                  </Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                    <SelectTrigger className="glass-subtle border-0 h-11">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-0">
                      {Object.entries(GENDER_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthYear" className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Birth Year
                  </Label>
                  <Input
                    id="birthYear"
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="e.g. 1990"
                    className="glass-subtle border-0 h-11 placeholder:text-muted-foreground/50"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 h-11 bg-foreground/90 text-background hover:bg-foreground transition-elegant"
                  >
                    Create My Tree
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
