export type RelationType =
  | 'self'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'spouse'
  | 'grandparent'
  | 'grandchild'
  | 'aunt_uncle'
  | 'niece_nephew'
  | 'cousin'
  | 'custom';

export type Gender = 'male' | 'female' | 'other' | 'unknown';

export interface FamilyMember {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  gender: Gender;
  photo?: string;
  notes?: string;
  relationToRoot: RelationType;
  customRelation?: string;
  parentIds: string[];
  spouseIds: string[];
  childIds: string[];
  siblingIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface FamilyTree {
  id: string;
  name: string;
  rootMemberId: string;
  members: Record<string, FamilyMember>;
  createdAt: number;
  updatedAt: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface TreeNode extends FamilyMember {
  position: Position;
  level: number;
  column: number;
}

export const RELATION_LABELS: Record<RelationType, string> = {
  self: 'You',
  parent: 'Parent',
  child: 'Child',
  sibling: 'Sibling',
  spouse: 'Spouse',
  grandparent: 'Grandparent',
  grandchild: 'Grandchild',
  aunt_uncle: 'Aunt/Uncle',
  niece_nephew: 'Niece/Nephew',
  cousin: 'Cousin',
  custom: 'Custom',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  unknown: 'Prefer not to say',
};

export function getRelationDisplayLabel(member: FamilyMember): string {
  if (member.relationToRoot === 'custom' && member.customRelation) {
    return member.customRelation;
  }
  return RELATION_LABELS[member.relationToRoot];
}
