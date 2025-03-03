
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useMediaHandling = () => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'audio' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    // Ensure this is triggered by a user event (click/tap)
    if (fileInputRef.current) {
      // Add a small delay to ensure the click is registered properly on mobile
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error("Seules les images sont supportées pour l'instant");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }

    // Create a preview and simulate sending an image
    const reader = new FileReader();
    reader.onload = () => {
      const imagePreview = reader.result as string;
      setMediaPreview(imagePreview);
      setMediaType('image');
    };
    reader.readAsDataURL(file);

    // Reset the input
    e.target.value = '';
  };

  const handleAudioPreview = (recordingTime: number) => {
    if (recordingTime > 1) {
      setMediaPreview('/placeholder.svg');
      setMediaType('audio');
      toast.success("Enregistrement vocal terminé");
      return true;
    } else {
      toast.error("Enregistrement trop court");
      return false;
    }
  };

  const cancelMediaPreview = () => {
    setMediaPreview(null);
    setMediaType(null);
  };

  return {
    mediaPreview,
    mediaType,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleAudioPreview,
    cancelMediaPreview
  };
};
