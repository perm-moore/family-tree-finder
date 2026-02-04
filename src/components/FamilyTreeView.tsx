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
  // Build tree structure
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

    // Find root members (no parent)
    const roots = members.filter(m => !m.parentId);
    return roots.map(buildNode);
  }, [members]);

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.member.id} className="flex flex-col items-center">
        {/* Member Card */}
        <div className="relative">
          {/* Vertical line from parent */}
          {depth > 0 && (
            <div className="absolute left-1/2 -top-6 w-0.5 h-6 tree-line -translate-x-1/2" />
          )}
          
          <FamilyMemberCard
            member={node.member}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            isCompact={printMode}
          />
        </div>

        {/* Children */}
        {hasChildren && (
          <div className="flex flex-col items-center mt-6">
            {/* Vertical line to children */}
            <div className="w-0.5 h-6 tree-line" />
            
            {/* Horizontal connector line */}
            {node.children.length > 1 && (
              <div 
                className="h-0.5 tree-line" 
                style={{ 
                  width: `calc(${(node.children.length - 1) * 220}px)` 
                }} 
              />
            )}

            {/* Children row */}
            <div className="flex gap-6 mt-0">
              {node.children.map((child, index) => (
                <div key={child.member.id} className="relative">
                  {/* Vertical line to each child */}
                  <div className="absolute left-1/2 -top-6 w-0.5 h-6 tree-line -translate-x-1/2" />
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
          Start Your Family Tree
        </h3>
        <p className="text-muted-foreground max-w-md">
          Add your first family member to begin building your family tree. 
          You can add parents, children, spouses, and more.
        </p>
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
