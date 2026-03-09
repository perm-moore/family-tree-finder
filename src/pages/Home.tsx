import { useState } from 'react';
import { useFamilyTree } from '@/contexts/FamilyTreeContext';
import { FamilyTreeView } from '@/components/FamilyTreeView';
import { OnboardingModal } from '@/components/OnboardingModal';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RotateCcw, Download, Upload, TreeDeciduous, LayoutGrid, GitBranch, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { sampleFamilies } from '@/data/sampleFamilies';

const HERO_IMAGE = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/PumEuHeXizRJUDfI.png';

const SAMPLE_FAMILY_IMAGES = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/jJkAjIoSnhSkbSIp.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/dEuAuyLiahNPDSmf.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/zhxUHoWGgMGawUtY.png',
];

type ViewMode = 'list' | 'tree';

export default function Home() {
  const { tree, isLoading, clearTree, importTree } = useFamilyTree();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const needsOnboarding = !isLoading && !tree;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will delete your entire family tree.')) {
      clearTree();
      toast.success('Family tree cleared');
    }
  };

  const handleExport = () => {
    if (!tree) return;

    const data = JSON.stringify(tree, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tree.name.replace(/\s+/g, '-').toLowerCase()}-family-tree.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Family tree exported');
  };

  const handleLoadSample = (index: number) => {
    const sample = sampleFamilies[index];
    if (sample) {
      importTree(sample.data);
      toast.success(`Loaded ${sample.name}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-editorial text-xl text-muted-foreground"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(40 20% 97%) 0%, hsl(35 18% 94%) 25%, hsl(40 20% 97%) 50%, hsl(38 15% 95%) 75%, hsl(40 20% 97%) 100%)',
        }}
      />

      {/* Subtle radial accent */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 20%, hsla(0, 15%, 87%, 0.4) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6 lg:py-8 px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TreeDeciduous className="w-5 h-5 text-muted-foreground/70" strokeWidth={1.5} />
              <h1 className="text-editorial text-lg lg:text-xl tracking-wide text-foreground/80">
                {tree?.name || 'Family Tree'}
              </h1>
            </div>

            {tree && (
              <div className="flex items-center gap-1">
                <div className="glass-subtle rounded-lg p-1 flex items-center mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-8 px-3 ${viewMode === 'list' ? 'bg-background/80 shadow-sm' : 'text-muted-foreground'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('tree')}
                    className={`h-8 px-3 ${viewMode === 'tree' ? 'bg-background/80 shadow-sm' : 'text-muted-foreground'}`}
                  >
                    <GitBranch className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  className="text-muted-foreground hover:text-foreground h-9 px-3"
                >
                  <Download className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Export</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-destructive h-9 px-3"
                >
                  <RotateCcw className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Start Over</span>
                </Button>
              </div>
            )}
          </div>
        </motion.header>

        {/* Tree content or welcome state */}
        {tree ? (
          <main className="px-6 lg:px-12 pb-20">
            <div className="max-w-7xl mx-auto">
              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard variant="subtle" className="mb-10 lg:mb-12 p-4 inline-flex items-center gap-6">
                  <div className="text-center px-4">
                    <p className="text-2xl lg:text-3xl text-editorial text-foreground/90">
                      {Object.keys(tree.members).length}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                      Members
                    </p>
                  </div>
                  <div className="w-px h-10 bg-border/30" />
                  <div className="text-center px-4">
                    <p className="text-2xl lg:text-3xl text-editorial text-foreground/90">
                      {new Set(Object.values(tree.members).map(m => m.relationToRoot)).size}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                      Generations
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Tree visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FamilyTreeView />
              </motion.div>
            </div>
          </main>
        ) : (
          <main className="px-6 lg:px-12 pb-20">
            <div className="max-w-5xl mx-auto">
              {/* Hero section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[55vh]"
              >
                {/* Left: Text content */}
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6 text-foreground/90"
                  >
                    Preserve Your
                    <br />
                    <span className="text-editorial-italic text-foreground/70">Family Story</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
                  >
                    Begin with what you remember. Build your family tree one memory at a time,
                    starting from you and branching outward through generations.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                  >
                    <Button
                      onClick={() => setShowOnboarding(true)}
                      className="h-12 px-8 bg-foreground/90 text-background hover:bg-foreground text-base transition-elegant"
                    >
                      Begin Your Tree
                    </Button>
                  </motion.div>
                </div>

                {/* Right: Hero image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="order-1 lg:order-2"
                >
                  <GlassCard variant="subtle" className="p-2 lg:p-3 shadow-frost-lg overflow-hidden">
                    <img
                      src={HERO_IMAGE}
                      alt="Three generations of women - grandmother, mother, and daughter"
                      className="w-full h-auto rounded-md object-cover"
                    />
                  </GlassCard>
                </motion.div>
              </motion.div>

              {/* Sample Families Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-16 lg:mt-20"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent-foreground/60" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Explore Examples
                    </span>
                  </div>
                  <h3 className="text-editorial text-2xl lg:text-3xl text-foreground/90">
                    Try a Sample Family
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    See how the platform works with pre-built family trees
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
                  {sampleFamilies.map((sample, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    >
                      <GlassCard
                        variant="default"
                        hover
                        className="p-0 h-full cursor-pointer group overflow-hidden"
                        onClick={() => handleLoadSample(i)}
                      >
                        {/* Family image */}
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={SAMPLE_FAMILY_IMAGES[i]}
                            alt={sample.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        {/* Card content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-editorial text-lg text-foreground/90 group-hover:text-foreground transition-elegant">
                              {sample.name}
                            </h4>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 px-2 py-0.5 rounded-full bg-muted/30">
                              {Object.keys(sample.data.members).length} members
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {sample.description}
                          </p>
                          <div className="mt-4 pt-3 border-t border-border/20">
                            <span className="text-xs text-accent-foreground/60 group-hover:text-foreground/70 transition-elegant">
                              Click to load →
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16 lg:mt-20"
              >
                {[
                  {
                    title: 'Start With You',
                    description: 'Your family tree begins with your own story, then grows as you add the people you remember.',
                  },
                  {
                    title: 'Simple & Private',
                    description: 'All data stays in your browser. No accounts, no cloud storage — just you and your memories.',
                  },
                  {
                    title: 'Build Over Time',
                    description: "Add family members as you remember them. There's no rush — your tree grows with you.",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  >
                    <GlassCard variant="subtle" className="p-6 h-full">
                      <h3 className="text-editorial text-lg mb-2 text-foreground/90">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="py-6 lg:py-8 px-6 lg:px-12 border-t border-border/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground/70">
              Your data is stored locally in your browser
            </p>
            <p className="text-xs text-muted-foreground/50 text-editorial-italic">
              Family Tree
            </p>
          </div>
        </footer>
      </div>

      {/* Onboarding modal */}
      <OnboardingModal
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
}
