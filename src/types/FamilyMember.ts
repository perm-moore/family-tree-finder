export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  photo?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  parentId?: string | null;
  spouseId?: string | null;
  generation: number;
}

export interface FamilyTree {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}
