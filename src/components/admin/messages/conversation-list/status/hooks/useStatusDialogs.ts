
import { useState } from 'react';
import { Status } from '../types';

export function useStatusDialogs() {
  const [newStatusOpen, setNewStatusOpen] = useState(false);
  const [statusType, setStatusType] = useState<'text' | 'image'>('text');
  const [statusText, setStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusPreviewOpen, setStatusPreviewOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const resetNewStatusForm = () => {
    setStatusText('');
    setSelectedFile(null);
  };

  const handleOpenChange = (open: boolean) => {
    setNewStatusOpen(open);
    if (!open) {
      resetNewStatusForm();
    }
  };

  return {
    newStatusOpen,
    statusType,
    statusText,
    selectedFile,
    statusPreviewOpen,
    selectedStatus,
    setNewStatusOpen: handleOpenChange,
    setStatusType,
    setStatusText,
    setSelectedFile,
    setStatusPreviewOpen,
    setSelectedStatus,
    resetNewStatusForm
  };
}
