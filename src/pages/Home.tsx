import { useState } from 'react';
import { useFamilyTree } from '@/contexts/FamilyTreeContext';
import { FamilyTreeView } from '@/components/FamilyTreeView';
import { OnboardingModal } from '@/components/OnboardingModal';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RotateCcw, Download, TreeDeciduous, LayoutGrid, GitBranch, Shield, Lock, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { sampleFamilies } from '@/data/sampleFamilies';
import heroImage from '@/assets/hero-family.jpg';
import treeLogo from '@/assets/tree-logo.png';

const SAMPLE_FAMILY_IMAGES = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/jJkAjIoSnhSkbSIp.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/dEuAuyLiahNPDSmf.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663102836837/zhxUHoWGgMGawUtY.png',
];

type ViewMode = 'list' | 'tree';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Home() {
  const { tree, isLoading, clearTree, importTree } = useFamilyTree();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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
      <div className="min-h-screen flex items-center justify-center bg-heritage">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <img src={treeLogo} alt="" className="w-16 h-16 opacity-40" />
          <p className="text-editorial text-xl text-muted-foreground">Loading your legacy...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-heritage">
      {/* Decorative grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-5 lg:py-6 px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={treeLogo} alt="Heritage Tree" className="w-8 h-8 lg:w-9 lg:h-9" />
              <div>
                <h1 className="text-editorial text-lg lg:text-xl tracking-wide text-foreground">
                  {tree?.name || 'Heritage Tree'}
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5 hidden sm:block">
                  Preserve What Matters
                </p>
              </div>
            </div>

            {tree ? (
              <div className="flex items-center gap-1">
                <div className="glass-subtle rounded-lg p-1 flex items-center mr-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}
                    className={`h-8 px-3 ${viewMode === 'list' ? 'bg-background/80 shadow-sm' : 'text-muted-foreground'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setViewMode('tree')}
                    className={`h-8 px-3 ${viewMode === 'tree' ? 'bg-background/80 shadow-sm' : 'text-muted-foreground'}`}>
                    <GitBranch className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleExport} className="text-muted-foreground hover:text-foreground h-9 px-3">
                  <Download className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Export</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-destructive h-9 px-3">
                  <RotateCcw className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Start Over</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowOnboarding(true)}
                className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-body transition-elegant"
              >
                Get Started
              </Button>
            )}
          </div>
        </motion.header>

        {/* Thin gold ornament line under header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="h-px ornament-line" />
        </div>

        {tree ? (
          /* === TREE VIEW === */
          <main className="px-6 lg:px-12 pb-20 pt-8">
            <div className="max-w-7xl mx-auto">
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                <GlassCard variant="subtle" className="mb-10 lg:mb-12 p-5 inline-flex items-center gap-8 shadow-heritage">
                  <div className="text-center px-4">
                    <p className="text-3xl lg:text-4xl text-editorial text-foreground">{Object.keys(tree.members).length}</p>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1 font-sans font-medium">Members</p>
                  </div>
                  <div className="w-px h-12 ornament-line" style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--gold) / 0.4), transparent)' }} />
                  <div className="text-center px-4">
                    <p className="text-3xl lg:text-4xl text-editorial text-foreground">{new Set(Object.values(tree.members).map(m => m.relationToRoot)).size}</p>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1 font-sans font-medium">Relations</p>
                  </div>
                </GlassCard>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
                <FamilyTreeView />
              </motion.div>
            </div>
          </main>
        ) : (
          /* === LANDING PAGE === */
          <main>
            {/* Hero Section */}
            <section className="px-6 lg:px-12 pt-8 lg:pt-12 pb-16 lg:pb-24">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"
                >
                  {/* Left: Editorial copy */}
                  <div className="order-2 lg:order-1 text-center lg:text-left">
                    <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="mb-5">
                      <span className="heritage-badge text-[10px] uppercase tracking-[0.18em] text-gold-dark font-sans font-medium">
                        <Heart className="w-3 h-3" />
                        Trusted by Families Worldwide
                      </span>
                    </motion.div>

                    <motion.h2
                      variants={fadeUp}
                      transition={{ duration: 0.7 }}
                      className="text-editorial text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.08] mb-6 text-foreground"
                    >
                      Every Family Has
                      <br />
                      <span className="text-editorial-italic text-accent">a Story Worth Keeping</span>
                    </motion.h2>

                    <motion.p
                      variants={fadeUp}
                      transition={{ duration: 0.7 }}
                      className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 font-body"
                    >
                      Build a beautiful, living record of your family — from the grandparents who shaped you
                      to the children who carry your name forward. Start with a single memory and watch your heritage unfold.
                    </motion.p>

                    <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
                      className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
                    >
                      <Button
                        onClick={() => setShowOnboarding(true)}
                        className="h-13 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-body transition-elegant shadow-heritage group"
                      >
                        Begin Your Family Tree
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>

                    {/* Trust signals */}
                    <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
                      className="flex flex-wrap items-center gap-5 justify-center lg:justify-start"
                    >
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Shield className="w-3.5 h-3.5 text-gold-dark" />
                        <span className="text-xs font-sans">100% Private</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-gold-dark" />
                        <span className="text-xs font-sans">Data Stays Local</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3.5 h-3.5 text-gold-dark" />
                        <span className="text-xs font-sans">Free Forever</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right: Hero image with editorial frame */}
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2"
                  >
                    <div className="relative">
                      {/* Gold corner accents */}
                      <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-gold/30 rounded-tl-sm z-10" />
                      <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-gold/30 rounded-tr-sm z-10" />
                      <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-gold/30 rounded-bl-sm z-10" />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-gold/30 rounded-br-sm z-10" />

                      <GlassCard variant="subtle" className="p-1.5 shadow-heritage overflow-hidden glow-gold">
                        <img
                          src={heroImage}
                          alt="A multigenerational family sharing warm moments together"
                          className="w-full h-auto rounded-md object-cover"
                        />
                      </GlassCard>

                      {/* Floating stat badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 glass-strong rounded-xl p-4 shadow-heritage"
                      >
                        <p className="text-2xl text-editorial text-foreground">12k+</p>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans">Trees Created</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Ornamental divider */}
            <div className="max-w-xs mx-auto flex items-center gap-4 py-2">
              <div className="flex-1 h-px ornament-line" />
              <img src={treeLogo} alt="" className="w-6 h-6 opacity-30" />
              <div className="flex-1 h-px ornament-line" />
            </div>

            {/* Sample Families Section */}
            <section className="px-6 lg:px-12 py-16 lg:py-24">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <span className="heritage-badge text-[10px] uppercase tracking-[0.2em] text-gold-dark font-sans font-medium mb-4 inline-flex">
                    <Sparkles className="w-3 h-3" />
                    Explore Examples
                  </span>
                  <h3 className="text-editorial text-3xl lg:text-4xl text-foreground mt-4 mb-3">
                    Discover Sample Families
                  </h3>
                  <p className="text-base text-muted-foreground max-w-md mx-auto font-body">
                    Click any family below to instantly explore a pre-built tree and see the platform in action
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-5 lg:gap-8">
                  {sampleFamilies.map((sample, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                    >
                      <GlassCard
                        variant="default"
                        hover
                        className="p-0 h-full cursor-pointer group overflow-hidden shadow-heritage"
                        onClick={() => handleLoadSample(i)}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={SAMPLE_FAMILY_IMAGES[i]}
                            alt={sample.name}
                            className="w-full h-full object-cover transition-luxury group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-elegant" />
                        </div>
                        <div className="p-5 lg:p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-editorial text-xl text-foreground group-hover:text-accent transition-elegant">
                              {sample.name}
                            </h4>
                            <span className="heritage-badge text-[9px] uppercase tracking-wider text-gold-dark font-sans">
                              {Object.keys(sample.data.members).length}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed font-body">
                            {sample.description}
                          </p>
                          <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-1.5">
                            <span className="text-xs text-accent font-sans font-medium group-hover:text-foreground transition-elegant">
                              Explore this family
                            </span>
                            <ArrowRight className="w-3 h-3 text-accent group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Heritage Tree — Trust & Features */}
            <section className="px-6 lg:px-12 py-16 lg:py-24">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-14"
                >
                  <h3 className="text-editorial text-3xl lg:text-4xl text-foreground mb-3">
                    Why Families <span className="text-editorial-italic text-accent">Trust Us</span>
                  </h3>
                  <p className="text-base text-muted-foreground max-w-lg mx-auto font-body">
                    Built with care, designed with intention — your family's story deserves nothing less
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                  {[
                    {
                      icon: Heart,
                      title: 'Start With You',
                      description: 'Your family tree begins with your own story — your name, your memories. Then it grows as you add the people who shaped your life.',
                    },
                    {
                      icon: Shield,
                      title: 'Completely Private',
                      description: 'Every piece of data stays on your device. No accounts, no tracking, no cloud storage. Your family\'s story belongs only to you.',
                    },
                    {
                      icon: Users,
                      title: 'Built for Generations',
                      description: 'Add family members as you remember them — parents, grandparents, cousins. Export and share with loved ones whenever you\'re ready.',
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                    >
                      <GlassCard variant="subtle" className="p-7 lg:p-8 h-full shadow-frost group hover:shadow-heritage transition-luxury text-center">
                        <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center bg-accent/10 text-accent group-hover:bg-accent/20 transition-elegant">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-editorial text-xl mb-3 text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-body">
                          {feature.description}
                        </p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 lg:px-12 py-16 lg:py-20">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <GlassCard variant="strong" className="p-10 lg:p-14 shadow-heritage relative overflow-hidden">
                    {/* Gold accent corners */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-gold/20" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/20" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold/20" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-gold/20" />

                    <img src={treeLogo} alt="" className="w-14 h-14 mx-auto mb-6 opacity-50" />
                    <h3 className="text-editorial text-3xl lg:text-4xl text-foreground mb-4">
                      Your Legacy Begins Today
                    </h3>
                    <p className="text-base text-muted-foreground max-w-md mx-auto mb-8 font-body leading-relaxed">
                      Every great family tree starts with a single name. Take the first step in preserving your family's story for generations to come.
                    </p>
                    <Button
                      onClick={() => setShowOnboarding(true)}
                      className="h-13 px-10 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-body transition-elegant shadow-heritage group"
                    >
                      Create Your Tree — It's Free
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </GlassCard>
                </motion.div>
              </div>
            </section>
          </main>
        )}

        {/* Footer */}
        <footer className="py-8 lg:py-10 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-px ornament-line mb-8" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={treeLogo} alt="" className="w-6 h-6 opacity-40" />
                <p className="text-xs text-muted-foreground font-sans">
                  Heritage Tree — Your data never leaves your browser
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] font-sans uppercase tracking-wider">Private & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  );
}
