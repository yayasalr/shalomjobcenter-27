
export interface Call {
  id: number;
  user: string;
  avatar: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
  missed: boolean;
  isVideo?: boolean;
}

export interface CallsListProps {
  calls: Call[];
  onCallUser: (call: Call) => void;
}

export interface CallItemProps {
  call: Call;
  onCallUser: (call: Call) => void;
}

export interface ActiveCallProps {
  activeCall: Call | null;
  callTimer: number;
  onEndCall: () => void;
}

export interface CallsTabContentProps {
  calls: Call[];
}
