
export interface StatusMessage {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  active: boolean;
  type: 'announcement' | 'promotion' | 'info' | 'alert';
  backgroundColor?: string;
  textColor?: string;
}
