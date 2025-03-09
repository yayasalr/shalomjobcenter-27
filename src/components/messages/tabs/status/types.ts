
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
  status: Status;
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
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export interface ImageStatusPreviewProps {
  image: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface StatusTabContentProps {
  statuses: Status[];
  onViewStatus: (status: Status) => void;
  onStatusCreated: (status: Status) => void;
}
