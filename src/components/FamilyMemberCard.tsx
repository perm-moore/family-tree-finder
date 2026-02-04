import { FamilyMember } from '@/types/FamilyMember';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar, Edit, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    ? `${formatDate(member.birthDate)}${member.deathDate ? ` - ${formatDate(member.deathDate)}` : ''}`
    : null;

  if (isCompact) {
    return (
      <Card className="tree-node border-2 shadow-md hover:shadow-lg transition-shadow w-48">
        <CardContent className="p-3 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-primary/20">
            <AvatarImage src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-display text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-display font-semibold text-sm text-foreground">
            {member.firstName} {member.lastName}
          </h3>
          {member.maidenName && (
            <p className="text-xs text-muted-foreground italic">née {member.maidenName}</p>
          )}
          {lifespan && (
            <p className="text-xs text-muted-foreground mt-1">{lifespan}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tree-node border-2 shadow-lg hover:shadow-xl transition-all w-72">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-display text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-foreground truncate">
              {member.firstName} {member.lastName}
            </h3>
            {member.maidenName && (
              <p className="text-sm text-muted-foreground italic">née {member.maidenName}</p>
            )}
            {lifespan && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="w-3 h-3" />
                <span>{lifespan}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {member.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{member.phone}</span>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{member.address}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild(member.id)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add Child
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(member)}
              className="h-8 w-8 hover:bg-primary/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(member.id)}
              className="h-8 w-8 hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
