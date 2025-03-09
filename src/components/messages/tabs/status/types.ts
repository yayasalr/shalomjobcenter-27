
export interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
  content?: string;
  image?: string; // Image is optional
}

export interface StatusViewerProps {
  status: Status | null;
  onClose: () => void;
}

export interface StatusListProps {
  statuses: Status[];
  onViewStatus: (status: Status) => void;
}

export interface StatusCreatorProps {
  onStatusCreated: (status: Status) => void;
}

export interface TextStatusFormProps {
  textStatus: string;
  setTextStatus: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface StatusTabContentProps {
  statuses: Status[];
  onViewStatus?: (status: Status) => void;
  onStatusCreated?: (status: Status) => void;
}

export interface StatusViewer {
  id: string;
  name: string;
  avatar: string;
  viewedAt: string;
}
