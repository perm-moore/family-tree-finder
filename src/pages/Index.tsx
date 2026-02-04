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

  const handleAddMember = () => {
    setEditingMember(null);
    setParentIdForNewMember(null);
    setMemberDialogOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    const parent = tree.members.find(m => m.id === parentId);
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
    <div className="min-h-screen bg-background">
      <Header
        treeName={tree.name}
        memberCount={tree.members.length}
        onAddMember={handleAddMember}
        onExport={() => setExportDialogOpen(true)}
        onClear={() => setClearDialogOpen(true)}
        onRename={updateTreeName}
      />

      <main className="container mx-auto px-4 py-8">
        <FamilyTreeView
          members={tree.members}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onAddChild={handleAddChild}
        />
      </main>

      {/* Member Form Dialog */}
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

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        treeName={tree.name}
        members={tree.members}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remove Family Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this family member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Tree Confirmation */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Clear Entire Family Tree?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all family members from your tree. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearTree} className="bg-destructive text-destructive-foreground">
              Clear Tree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
