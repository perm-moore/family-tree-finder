import { useFamilyTree } from '@/contexts/FamilyTreeContext';
import { FamilyMemberCard } from './FamilyMemberCard';
import { GlassCard } from './GlassCard';

export const FamilyTreeView = () => {
  const { tree, getRootMember } = useFamilyTree();

  if (!tree) return null;

  const members = Object.values(tree.members);
  const rootMember = getRootMember();

  // Group members by relation type for display
  const groupedMembers: Record<string, typeof members> = {};
  members.forEach(member => {
    const relation = member.relationToRoot;
    if (!groupedMembers[relation]) {
      groupedMembers[relation] = [];
    }
    groupedMembers[relation].push(member);
  });

  const relationOrder = ['self', 'spouse', 'child', 'sibling', 'parent', 'grandparent', 'aunt_uncle', 'cousin', 'niece_nephew', 'grandchild', 'custom'];

  return (
    <div className="space-y-8">
      {relationOrder.map(relation => {
        const group = groupedMembers[relation];
        if (!group || group.length === 0) return null;

        const label = relation === 'self' ? 'You' :
          relation === 'aunt_uncle' ? 'Aunts & Uncles' :
          relation === 'niece_nephew' ? 'Nieces & Nephews' :
          relation.charAt(0).toUpperCase() + relation.slice(1).replace('_', ' ') + 's';

        return (
          <div key={relation}>
            {relation !== 'self' && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {label}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {group.map(member => (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  isRoot={member.id === tree.rootMemberId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
