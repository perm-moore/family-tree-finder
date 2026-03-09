import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, UserPlus, Trash2, Edit2, Check, X } from 'lucide-react';

interface HeaderProps {
  treeName: string;
  memberCount: number;
  onAddMember: () => void;
  onExport: () => void;
  onClear: () => void;
  onRename: (name: string) => void;
}

export const Header = ({
  treeName,
  memberCount,
  onAddMember,
  onExport,
  onClear,
  onRename,
}: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(treeName);

  const handleSave = () => {
    if (editedName.trim()) {
      onRename(editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(treeName);
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/90 backdrop-blur-md">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            {/* Ornamental crest icon */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <path d="M24 4 L28 14 L38 14 L30 20 L33 30 L24 24 L15 30 L18 20 L10 14 L20 14 Z" 
                  fill="hsl(var(--gold-accent))" opacity="0.15" />
                <path d="M24 8 L26.5 15 L34 15 L28 19.5 L30 27 L24 22.5 L18 27 L20 19.5 L14 15 L21.5 15 Z" 
                  stroke="hsl(var(--gold-accent))" strokeWidth="0.75" fill="none" />
                <circle cx="24" cy="18" r="4" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" fill="hsl(var(--gold-accent))" opacity="0.1" />
                <path d="M20 36 Q24 32 28 36" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" fill="none" />
                <path d="M16 40 Q24 34 32 40" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-9 w-56 font-display text-lg"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-medium tracking-wide text-foreground">
                    {treeName}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-40 hover:opacity-100 transition-opacity"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-3 mt-0.5">
                <div className="h-px w-8 ornament-line" />
                <p className="text-sm text-muted-foreground font-body tracking-wider uppercase" style={{ fontSize: '0.7rem' }}>
                  {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                </p>
                <div className="h-px w-8 ornament-line" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={onAddMember} 
              className="gap-2 gold-gradient text-foreground border-0 shadow-md hover:shadow-lg transition-all font-display tracking-wide"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Member</span>
            </Button>
            <Button 
              onClick={onExport} 
              variant="outline" 
              className="gap-2 border-border/60 hover:border-accent/50 font-display tracking-wide"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            {memberCount > 0 && (
              <Button onClick={onClear} variant="ghost" size="icon" className="text-destructive opacity-60 hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
