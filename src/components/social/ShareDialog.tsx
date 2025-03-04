
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Facebook, Link2, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  onShare: (platform: string) => void;
}

export const ShareDialog = ({ 
  open, 
  onOpenChange, 
  title, 
  url, 
  onShare 
}: ShareDialogProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papier");
    onShare("Copie de lien");
  };
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    onShare("Facebook");
  };
  
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    onShare("Twitter");
  };
  
  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    onShare("LinkedIn");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={url}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleShareFacebook}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleShareTwitter}
            >
              <Twitter className="h-5 w-5 text-blue-400" />
              <span>Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleShareLinkedIn}
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
              <span>LinkedIn</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleCopyLink}
            >
              <Link2 className="h-5 w-5" />
              <span>Copier le lien</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
