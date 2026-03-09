import { useState } from 'react';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { FamilyMember } from '@/types/FamilyMember';
import { Header } from '@/components/Header';
import { FamilyTreeView } from '@/components/FamilyTreeView';
import { MemberFormDialog } from '@/components/MemberFormDialog';
import { ExportDialog } from '@/components/ExportDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { tree, addMember, updateMember, deleteMember, updateTreeName, clearTree } = useFamilyTree();
  const { toast } = useToast();

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [parentIdForNewMember, setParentIdForNewMember] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false);
    setEditingMember(null);
    setParentIdForNewMember(null);
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false);
  };
  const handleAddMember = () => {
    setEditingMember(null);
    setParentIdForNewMember(null);
    setMemberDialogOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setEditingMember(null);
    setParentIdForNewMember(parentId);
    setMemberDialogOpen(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setParentIdForNewMember(null);
    setMemberDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete);
      toast({
        title: 'Member Removed',
        description: 'The family member has been removed from the tree.',
      });
    }
    setMemberToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleSaveMember = (memberData: Omit<FamilyMember, 'id'> | Partial<FamilyMember>) => {
    if ('id' in memberData && memberData.id) {
      updateMember(memberData.id, memberData);
      toast({
        title: 'Member Updated',
        description: 'The family member has been updated.',
      });
    } else {
      const parent = parentIdForNewMember 
        ? tree.members.find(m => m.id === parentIdForNewMember)
        : null;
      const generation = parent ? parent.generation + 1 : 0;
      
      addMember({
        ...memberData as Omit<FamilyMember, 'id'>,
        generation,
      });
      toast({
        title: 'Member Added',
        description: 'A new family member has been added to the tree.',
      });
    }
  };

  const handleClearTree = () => {
    clearTree();
    setClearDialogOpen(false);
    toast({
      title: 'Tree Cleared',
      description: 'Your family tree has been cleared.',
    });
  };

  return (
    <div className="min-h-screen parchment-bg">
      <Header
        treeName={tree.name}
        memberCount={tree.members.length}
        onAddMember={handleAddMember}
        onExport={() => setExportDialogOpen(true)}
        onClear={() => setClearDialogOpen(true)}
        onRename={updateTreeName}
      />

      <main className="container mx-auto px-6 py-10">
        <FamilyTreeView
          members={tree.members}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onAddChild={handleAddChild}
        />
      </main>

      {/* Subtle footer ornament */}
      <footer className="pb-8 flex justify-center">
        <div className="flex items-center gap-3 opacity-20">
          <div className="h-px w-12 ornament-line" />
          <div className="w-1.5 h-1.5 rotate-45 border border-accent/40" />
          <div className="h-px w-12 ornament-line" />
        </div>
      </footer>

      <MemberFormDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        member={editingMember}
        parentId={parentIdForNewMember}
        generation={
          parentIdForNewMember
            ? (tree.members.find(m => m.id === parentIdForNewMember)?.generation ?? 0) + 1
            : 0
        }
        onSave={handleSaveMember}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        treeName={tree.name}
        members={tree.members}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Remove Family Member?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Are you sure you want to remove this family member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-display">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground font-display">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Clear Entire Family Tree?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will remove all family members from your tree. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-display">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearTree} className="bg-destructive text-destructive-foreground font-display">
              Clear Tree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
