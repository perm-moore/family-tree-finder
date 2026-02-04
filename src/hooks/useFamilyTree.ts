import { useState, useCallback } from 'react';
import { FamilyMember, FamilyTree } from '@/types/FamilyMember';

const STORAGE_KEY = 'family-tree-data';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getInitialTree = (): FamilyTree => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore parse errors
    }
  }
  return {
    id: generateId(),
    name: 'My Family Tree',
    members: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const useFamilyTree = () => {
  const [tree, setTree] = useState<FamilyTree>(getInitialTree);

  const saveTree = useCallback((updatedTree: FamilyTree) => {
    const newTree = { ...updatedTree, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTree));
    setTree(newTree);
  }, []);

  const addMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: generateId(),
    };
    const updatedTree = {
      ...tree,
      members: [...tree.members, newMember],
    };
    saveTree(updatedTree);
    return newMember;
  }, [tree, saveTree]);

  const updateMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    const updatedTree = {
      ...tree,
      members: tree.members.map(m => m.id === id ? { ...m, ...updates } : m),
    };
    saveTree(updatedTree);
  }, [tree, saveTree]);

  const deleteMember = useCallback((id: string) => {
    const updatedTree = {
      ...tree,
      members: tree.members.filter(m => m.id !== id),
    };
    saveTree(updatedTree);
  }, [tree, saveTree]);

  const updateTreeName = useCallback((name: string) => {
    saveTree({ ...tree, name });
  }, [tree, saveTree]);

  const clearTree = useCallback(() => {
    const newTree: FamilyTree = {
      id: generateId(),
      name: 'My Family Tree',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTree(newTree);
  }, [saveTree]);

  const getMembersByGeneration = useCallback(() => {
    const generations: Map<number, FamilyMember[]> = new Map();
    tree.members.forEach(member => {
      const gen = member.generation;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(member);
    });
    return generations;
  }, [tree.members]);

  const getChildren = useCallback((parentId: string) => {
    return tree.members.filter(m => m.parentId === parentId);
  }, [tree.members]);

  const getSpouse = useCallback((memberId: string) => {
    const member = tree.members.find(m => m.id === memberId);
    if (member?.spouseId) {
      return tree.members.find(m => m.id === member.spouseId);
    }
    return undefined;
  }, [tree.members]);

  return {
    tree,
    addMember,
    updateMember,
    deleteMember,
    updateTreeName,
    clearTree,
    getMembersByGeneration,
    getChildren,
    getSpouse,
  };
};
