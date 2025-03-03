
import { useState, useEffect } from "react";

interface DialogProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onCancel: () => void;
}

/**
 * Manages the dialog open/close state
 */
export const useDialogHandlers = ({ 
  isOpen: externalIsOpen, 
  setIsOpen: externalSetIsOpen,
  onCancel
}: DialogProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const dialogOpen = externalIsOpen !== undefined ? externalIsOpen : open;
  const setDialogOpen = externalSetIsOpen || setOpen;

  const handleCancel = () => {
    setDialogOpen(false);
    onCancel();
  };

  const handleDialogChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (!isOpen) {
      handleCancel();
    }
  };

  return {
    dialogOpen,
    handleCancel,
    handleDialogChange
  };
};
