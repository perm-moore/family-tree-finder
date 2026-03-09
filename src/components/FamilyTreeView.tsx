import { useMemo } from 'react';
import { FamilyMember } from '@/types/FamilyMember';
import { FamilyMemberCard } from './FamilyMemberCard';

interface FamilyTreeViewProps {
  members: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  printMode?: boolean;
}

interface TreeNode {
  member: FamilyMember;
  children: TreeNode[];
}

export const FamilyTreeView = ({
  members,
  onEdit,
  onDelete,
  onAddChild,
  printMode = false,
}: FamilyTreeViewProps) => {
  const tree = useMemo(() => {
    const memberMap = new Map<string, FamilyMember>();
    const childrenMap = new Map<string, FamilyMember[]>();

    members.forEach(member => {
      memberMap.set(member.id, member);
      if (member.parentId) {
        const siblings = childrenMap.get(member.parentId) || [];
        siblings.push(member);
        childrenMap.set(member.parentId, siblings);
      }
    });

    const buildNode = (member: FamilyMember): TreeNode => {
      const children = childrenMap.get(member.id) || [];
      return {
        member,
        children: children.map(buildNode),
      };
    };

    const roots = members.filter(m => !m.parentId);
    return roots.map(buildNode);
  }, [members]);

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.member.id} className="flex flex-col items-center">
        <div className="relative">
          {depth > 0 && (
            <div className="absolute left-1/2 -top-8 w-px h-8 -translate-x-1/2 ornament-line" style={{ width: '1px', background: `linear-gradient(180deg, hsl(var(--gold-accent) / 0.2), hsl(var(--gold-accent) / 0.6))` }} />
          )}
          
          <FamilyMemberCard
            member={node.member}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            isCompact={printMode}
          />
        </div>

        {hasChildren && (
          <div className="flex flex-col items-center mt-8">
            <div className="w-px h-8" style={{ background: `linear-gradient(180deg, hsl(var(--gold-accent) / 0.6), hsl(var(--gold-accent) / 0.3))` }} />
            
            {/* Diamond ornament at junction */}
            <div className="w-2.5 h-2.5 rotate-45 border border-accent/50 bg-accent/10 -my-1 z-10" />
            
            {node.children.length > 1 && (
              <div 
                className="h-px mt-1"
                style={{ 
                  width: `calc(${(node.children.length - 1) * 240}px)`,
                  background: `linear-gradient(90deg, hsl(var(--gold-accent) / 0.2), hsl(var(--gold-accent) / 0.5), hsl(var(--gold-accent) / 0.2))`,
                }} 
              />
            )}

            <div className="flex gap-8 mt-0">
              {node.children.map((child) => (
                <div key={child.member.id} className="relative">
                  <div className="absolute left-1/2 -top-8 w-px h-8 -translate-x-1/2" style={{ background: `linear-gradient(180deg, hsl(var(--gold-accent) / 0.3), hsl(var(--gold-accent) / 0.6))` }} />
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center px-4">
        {/* Ornamental crest */}
        <div className="relative mb-8">
          <svg viewBox="0 0 120 120" className="w-32 h-32 opacity-20" fill="none">
            <circle cx="60" cy="60" r="55" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="45" stroke="hsl(var(--gold-accent))" strokeWidth="0.3" />
            <path d="M60 15 L65 30 L80 30 L68 40 L72 55 L60 45 L48 55 L52 40 L40 30 L55 30 Z" 
              stroke="hsl(var(--gold-accent))" strokeWidth="0.5" fill="hsl(var(--gold-accent))" opacity="0.1" />
            <path d="M30 75 Q60 60 90 75" stroke="hsl(var(--gold-accent))" strokeWidth="0.5" fill="none" />
            <path d="M25 85 Q60 65 95 85" stroke="hsl(var(--gold-accent))" strokeWidth="0.3" fill="none" />
            <path d="M35 95 Q60 80 85 95" stroke="hsl(var(--gold-accent))" strokeWidth="0.3" fill="none" />
          </svg>
        </div>

        {/* Ornament line */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-16 ornament-line" />
          <div className="w-1.5 h-1.5 rotate-45 bg-accent/40" />
          <div className="h-px w-16 ornament-line" />
        </div>

        <h3 className="font-display text-3xl font-medium text-foreground mb-3 tracking-wide">
          Begin Your Legacy
        </h3>
        <p className="text-muted-foreground max-w-sm font-body leading-relaxed text-base">
          Every great family story begins with a single name. Add your first ancestor to begin weaving your lineage.
        </p>

        {/* Bottom ornament */}
        <div className="flex items-center gap-4 mt-8">
          <div className="h-px w-10 ornament-line" />
          <div className="w-1 h-1 rotate-45 bg-accent/30" />
          <div className="h-px w-10 ornament-line" />
        </div>
      </div>
    );
  }

  return (
    <div className="tree-container overflow-x-auto pb-8">
      <div className="inline-flex flex-col items-center min-w-full px-8 py-6">
        {tree.map(node => renderNode(node, 0))}
      </div>
    </div>
  );
};
