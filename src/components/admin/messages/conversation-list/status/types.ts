
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Status {
  id: string;
  type: 'text' | 'image';
  user: User;
  content: string;
  createdAt: Date;
}

export interface MyStatusSectionProps {
  myStatus: Status;
  onTextClick: () => void;
  onImageClick: () => void;
  onStatusClick: (status: Status) => void;
}

export interface RecentStatusListProps {
  statuses: Status[];
  onStatusClick: (status: Status) => void;
}

export interface NewStatusDialogProps {
  open: boolean;
  statusType: 'text' | 'image';
  onOpenChange: (open: boolean) => void;
  onCreateStatus: (status: Partial<Status>) => void;
}

export interface StatusPreviewDialogProps {
  open: boolean;
  status: Status | null;
  onOpenChange: (open: boolean) => void;
}
