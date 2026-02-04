import { useState, useRef } from 'react';
import { FamilyMember } from '@/types/FamilyMember';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintPreview } from './PrintPreview';
import { Download, Printer, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treeName: string;
  members: FamilyMember[];
}

export const ExportDialog = ({
  open,
  onOpenChange,
  treeName,
  members,
}: ExportDialogProps) => {
  const [size, setSize] = useState<'letter' | 'poster'>('letter');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Popup Blocked',
        description: 'Please allow popups to print your family tree.',
        variant: 'destructive',
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${treeName} - Family Tree</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Lora', serif; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
            .tree-line { background-color: hsl(25, 30%, 60%); }
            @media print {
              @page { size: ${size === 'letter' ? '8.5in 11in' : '18in 24in'}; margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadJSON = () => {
    const data = {
      name: treeName,
      members,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${treeName.replace(/\s+/g, '-').toLowerCase()}-family-tree.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded!',
      description: 'Your family tree has been exported as JSON.',
    });
  };

  const handleCopyLink = () => {
    // For now, just copy a placeholder - real sharing would need backend
    const shareData = btoa(JSON.stringify({ name: treeName, memberCount: members.length }));
    const link = `${window.location.origin}?share=${shareData}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Link Copied!',
      description: 'Share link copied to clipboard.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Export & Share Your Family Tree
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="print" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="print" className="font-body">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </TabsTrigger>
            <TabsTrigger value="download" className="font-body">
              <Download className="w-4 h-4 mr-2" />
              Download
            </TabsTrigger>
            <TabsTrigger value="share" className="font-body">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="print" className="space-y-4 mt-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={size === 'letter' ? 'default' : 'outline'}
                onClick={() => setSize('letter')}
                className="flex-1"
              >
                8.5 × 11" (Letter)
              </Button>
              <Button
                variant={size === 'poster' ? 'default' : 'outline'}
                onClick={() => setSize('poster')}
                className="flex-1"
              >
                18 × 24" (Poster)
              </Button>
            </div>

            <div className="border rounded-lg overflow-auto max-h-[400px] bg-muted/50 p-4">
              <div className="transform scale-[0.3] origin-top-left">
                <PrintPreview
                  ref={printRef}
                  treeName={treeName}
                  members={members}
                  size={size}
                />
              </div>
            </div>

            <Button onClick={handlePrint} className="w-full">
              <Printer className="w-4 h-4 mr-2" />
              Print {size === 'letter' ? 'Letter' : 'Poster'} Size
            </Button>
          </TabsContent>

          <TabsContent value="download" className="space-y-4 mt-4">
            <div className="grid gap-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-1">JSON Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Export your family tree data for backup or import into other tools.
                </p>
                <Button onClick={handleDownloadJSON} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4 mt-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-1">Share Link</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Copy a link to share your family tree with others.
              </p>
              <Button onClick={handleCopyLink} variant="outline" className="w-full">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Share Link
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Note: Full sharing features require backend storage. 
              Currently using local storage only.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
