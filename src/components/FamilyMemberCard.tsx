import { useFamilyTree } from '@/contexts/FamilyTreeContext';
import { FamilyMember, getRelationDisplayLabel } from '@/types/family';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import { User, Plus } from 'lucide-react';

interface FamilyMemberCardProps {
  member: FamilyMember;
  isRoot?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onAddRelative?: () => void;
  compact?: boolean;
}

export function FamilyMemberCard({
  member,
  isRoot = false,
  isSelected = false,
  onClick,
  onAddRelative,
  compact = false,
}: FamilyMemberCardProps) {
  const getYearDisplay = () => {
    if (!member.birthYear && !member.deathYear) return null;
    if (member.birthYear && member.deathYear) {
      return `${member.birthYear} — ${member.deathYear}`;
    }
    if (member.birthYear) {
      return `b. ${member.birthYear}`;
    }
    return null;
  };

  const yearDisplay = getYearDisplay();

  const getInitials = () => {
    return member.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (compact) {
    return (
      <GlassCard
        variant={isSelected ? 'strong' : 'default'}
        hover
        onClick={onClick}
        className={cn(
          'p-3 min-w-[120px]',
          isRoot && 'ring-1 ring-accent/40',
          isSelected && 'ring-2 ring-foreground/20'
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-muted/30 text-muted-foreground'
          )}>
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-medium">{getInitials()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-editorial text-sm truncate text-foreground/90">{member.name}</p>
            {isRoot && (
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                You
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      variant={isSelected ? 'strong' : 'default'}
      hover
      onClick={onClick}
      className={cn(
        'p-5 min-w-[180px] relative group',
        isRoot && 'ring-1 ring-accent/30 glow-blush',
        isSelected && 'ring-2 ring-foreground/15'
      )}
    >
      {onAddRelative && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddRelative();
          }}
          className={cn(
            'absolute -top-2 -right-2 w-7 h-7 rounded-full',
            'glass-strong shadow-frost',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-elegant',
            'hover:scale-110 hover:shadow-frost-lg',
            'border border-border/30'
          )}
        >
          <Plus className="w-3.5 h-3.5 text-foreground/70" />
        </button>
      )}

      <div className="flex flex-col items-center text-center gap-3">
        {/* Avatar */}
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-muted/20 to-muted/40',
          'ring-1 ring-border/30',
          isRoot && 'ring-accent/40'
        )}>
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg text-muted-foreground/70 text-editorial">
              {getInitials()}
            </span>
          )}
        </div>

        {/* Name */}
        <div>
          <h3 className="text-editorial text-lg leading-tight text-foreground/90">
            {member.name}
          </h3>
          {yearDisplay && (
            <p className="text-editorial-italic text-xs text-muted-foreground mt-0.5">
              {yearDisplay}
            </p>
          )}
        </div>

        {/* Relation badge */}
        <span className={cn(
          'text-[9px] uppercase tracking-[0.15em] text-muted-foreground/80',
          'px-2.5 py-1 rounded-full',
          'bg-gradient-to-r from-muted/20 to-muted/30',
          isRoot && 'bg-gradient-to-r from-accent/20 to-accent/30 text-accent-foreground/70'
        )}>
          {getRelationDisplayLabel(member)}
        </span>
      </div>
    </GlassCard>
  );
}
