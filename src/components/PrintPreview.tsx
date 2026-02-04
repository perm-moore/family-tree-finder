import { forwardRef } from 'react';
import { FamilyMember } from '@/types/FamilyMember';
import { FamilyTreeView } from './FamilyTreeView';

interface PrintPreviewProps {
  treeName: string;
  members: FamilyMember[];
  size: 'letter' | 'poster';
}

export const PrintPreview = forwardRef<HTMLDivElement, PrintPreviewProps>(
  ({ treeName, members, size }, ref) => {
    const sizeStyles = {
      letter: {
        width: '8.5in',
        height: '11in',
        padding: '0.5in',
      },
      poster: {
        width: '18in',
        height: '24in',
        padding: '1in',
      },
    };

    const style = sizeStyles[size];

    return (
      <div
        ref={ref}
        className="bg-white"
        style={{
          width: style.width,
          minHeight: style.height,
          padding: style.padding,
        }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-primary/30 pb-6">
          <h1 className="font-display text-4xl font-bold text-primary mb-2">
            {treeName}
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Family Tree
          </p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="text-sm text-muted-foreground">
                {members.length} Members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Generated {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tree */}
        <FamilyTreeView
          members={members}
          onEdit={() => {}}
          onDelete={() => {}}
          onAddChild={() => {}}
          printMode
        />

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-primary/20">
          <p className="text-xs text-muted-foreground italic">
            Created with Family Tree Builder
          </p>
        </div>
      </div>
    );
  }
);

PrintPreview.displayName = 'PrintPreview';
