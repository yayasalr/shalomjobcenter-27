
export interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
  content?: string;
  image?: string;
}

export interface StatusViewerProps {
  status: Status | null;
  onClose: () => void;
}

export interface StatusCreatorProps {
  onStatusCreated: (newStatus: Status) => void;
}

export interface StatusListProps {
  statuses: Status[];
  onViewStatus: (status: Status) => void;
}

export interface StatusTabContentProps {
  statuses: Status[];
}
