import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FamilyTree, FamilyMember, RelationType, Gender } from '@/types/family';
import { nanoid } from 'nanoid';

interface FamilyTreeContextType {
  tree: FamilyTree | null;
  isLoading: boolean;
  initializeTree: (name: string, rootName: string, rootGender: Gender, rootBirthYear?: number) => void;
  addMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => FamilyMember;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => FamilyMember | undefined;
  getRootMember: () => FamilyMember | undefined;
  connectMembers: (memberId: string, relatedMemberId: string, relation: RelationType) => void;
  clearTree: () => void;
  importTree: (importedTree: FamilyTree) => void;
}

const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined);

const STORAGE_KEY = 'family-tree-data';

export function FamilyTreeProvider({ children }: { children: ReactNode }) {
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTree(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored tree:', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (tree && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
    }
  }, [tree, isLoading]);

  const initializeTree = (name: string, rootName: string, rootGender: Gender, rootBirthYear?: number) => {
    const rootId = nanoid();
    const now = Date.now();

    const rootMember: FamilyMember = {
      id: rootId,
      name: rootName,
      birthYear: rootBirthYear,
      gender: rootGender,
      relationToRoot: 'self',
      parentIds: [],
      spouseIds: [],
      childIds: [],
      siblingIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const newTree: FamilyTree = {
      id: nanoid(),
      name,
      rootMemberId: rootId,
      members: { [rootId]: rootMember },
      createdAt: now,
      updatedAt: now,
    };

    setTree(newTree);
  };

  const addMember = (memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): FamilyMember => {
    const id = nanoid();
    const now = Date.now();

    const member: FamilyMember = {
      ...memberData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setTree(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        members: { ...prev.members, [id]: member },
        updatedAt: now,
      };
    });

    return member;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setTree(prev => {
      if (!prev || !prev.members[id]) return prev;
      const now = Date.now();
      return {
        ...prev,
        members: {
          ...prev.members,
          [id]: { ...prev.members[id], ...updates, updatedAt: now },
        },
        updatedAt: now,
      };
    });
  };

  const deleteMember = (id: string) => {
    setTree(prev => {
      if (!prev || !prev.members[id]) return prev;
      if (id === prev.rootMemberId) return prev;

      const now = Date.now();
      const { [id]: removed, ...remaining } = prev.members;

      const cleanedMembers = Object.fromEntries(
        Object.entries(remaining).map(([memberId, member]) => [
          memberId,
          {
            ...member,
            parentIds: member.parentIds.filter(pid => pid !== id),
            spouseIds: member.spouseIds.filter(sid => sid !== id),
            childIds: member.childIds.filter(cid => cid !== id),
            siblingIds: member.siblingIds.filter(sid => sid !== id),
            updatedAt: now,
          },
        ])
      );

      return {
        ...prev,
        members: cleanedMembers,
        updatedAt: now,
      };
    });
  };

  const getMember = (id: string) => tree?.members[id];

  const getRootMember = () => tree ? tree.members[tree.rootMemberId] : undefined;

  const connectMembers = (memberId: string, relatedMemberId: string, relation: RelationType) => {
    setTree(prev => {
      if (!prev) return prev;
      const now = Date.now();
      const member = prev.members[memberId];
      const related = prev.members[relatedMemberId];

      if (!member || !related) return prev;

      const updatedMembers = { ...prev.members };

      switch (relation) {
        case 'parent':
          updatedMembers[memberId] = {
            ...member,
            parentIds: Array.from(new Set([...member.parentIds, relatedMemberId])),
            updatedAt: now,
          };
          updatedMembers[relatedMemberId] = {
            ...related,
            childIds: Array.from(new Set([...related.childIds, memberId])),
            updatedAt: now,
          };
          break;
        case 'child':
          updatedMembers[memberId] = {
            ...member,
            childIds: Array.from(new Set([...member.childIds, relatedMemberId])),
            updatedAt: now,
          };
          updatedMembers[relatedMemberId] = {
            ...related,
            parentIds: Array.from(new Set([...related.parentIds, memberId])),
            updatedAt: now,
          };
          break;
        case 'spouse':
          updatedMembers[memberId] = {
            ...member,
            spouseIds: Array.from(new Set([...member.spouseIds, relatedMemberId])),
            updatedAt: now,
          };
          updatedMembers[relatedMemberId] = {
            ...related,
            spouseIds: Array.from(new Set([...related.spouseIds, memberId])),
            updatedAt: now,
          };
          break;
        case 'sibling':
          updatedMembers[memberId] = {
            ...member,
            siblingIds: Array.from(new Set([...member.siblingIds, relatedMemberId])),
            updatedAt: now,
          };
          updatedMembers[relatedMemberId] = {
            ...related,
            siblingIds: Array.from(new Set([...related.siblingIds, memberId])),
            updatedAt: now,
          };
          break;
      }

      return {
        ...prev,
        members: updatedMembers,
        updatedAt: now,
      };
    });
  };

  const clearTree = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTree(null);
  };

  const importTree = (importedTree: FamilyTree) => {
    const now = Date.now();
    const updatedTree: FamilyTree = {
      ...importedTree,
      updatedAt: now,
    };
    setTree(updatedTree);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTree));
  };

  return (
    <FamilyTreeContext.Provider
      value={{
        tree,
        isLoading,
        initializeTree,
        addMember,
        updateMember,
        deleteMember,
        getMember,
        getRootMember,
        connectMembers,
        clearTree,
        importTree,
      }}
    >
      {children}
    </FamilyTreeContext.Provider>
  );
}

export function useFamilyTree() {
  const context = useContext(FamilyTreeContext);
  if (context === undefined) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
}
