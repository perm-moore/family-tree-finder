import { FamilyMember } from '@/types/FamilyMember';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar, Edit, Trash2, UserPlus } from 'lucide-react';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  isCompact?: boolean;
}

export const FamilyMemberCard = ({
  member,
  onEdit,
  onDelete,
  onAddChild,
  isCompact = false,
}: FamilyMemberCardProps) => {
  const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();
  
  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const lifespan = member.birthDate 
    ? `${formatDate(member.birthDate)}${member.deathDate ? ` — ${formatDate(member.deathDate)}` : ''}`
    : null;

  if (isCompact) {
    return (
      <Card className="tree-node border shadow-md hover:shadow-lg transition-all w-48 relative overflow-hidden">
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-gradient" />
        <CardContent className="p-3 text-center">
          <Avatar className="w-14 h-14 mx-auto mb-2 border-2 border-accent/20 shadow-sm">
            <AvatarImage src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
            <AvatarFallback className="bg-accent/5 text-accent font-display text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-display font-medium text-sm text-foreground tracking-wide">
            {member.firstName} {member.lastName}
          </h3>
          {member.maidenName && (
            <p className="text-xs text-muted-foreground italic font-body">née {member.maidenName}</p>
          )}
          {lifespan && (
            <p className="text-xs text-muted-foreground mt-1 font-body">{lifespan}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tree-node border shadow-lg hover:shadow-xl transition-all w-[280px] relative overflow-hidden group">
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 gold-gradient" />
      
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-[72px] h-[72px] border-2 border-accent/15 shadow-md">
              <AvatarImage src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback className="bg-accent/5 text-accent font-display text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Decorative corner */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b border-r border-accent/20" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-medium text-lg text-foreground truncate tracking-wide leading-tight">
              {member.firstName} {member.lastName}
            </h3>
            {member.maidenName && (
              <p className="text-sm text-muted-foreground italic font-body">née {member.maidenName}</p>
            )}
            {lifespan && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5 font-body">
                <Calendar className="w-3 h-3 text-accent/60" />
                <span>{lifespan}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px ornament-line" />
          <div className="w-1 h-1 rotate-45 bg-accent/30" />
          <div className="flex-1 h-px ornament-line" />
        </div>

        <div className="space-y-1.5">
          {member.phone && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-body">
              <Phone className="w-3.5 h-3.5 text-accent/50" />
              <span className="truncate">{member.phone}</span>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-body">
              <Mail className="w-3.5 h-3.5 text-accent/50" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.address && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-body">
              <MapPin className="w-3.5 h-3.5 text-accent/50" />
              <span className="truncate">{member.address}</span>
            </div>
          )}
        </div>

        {/* Actions — appear on hover */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/40 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild(member.id)}
            className="text-accent hover:text-accent hover:bg-accent/10 font-display tracking-wide text-xs"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Add Child
          </Button>
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(member)}
              className="h-7 w-7 hover:bg-accent/10"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(member.id)}
              className="h-7 w-7 hover:bg-destructive/10 text-destructive/60 hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
