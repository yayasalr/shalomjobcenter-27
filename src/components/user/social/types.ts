
import { LucideIcon } from 'lucide-react';

export interface SocialAccount {
  id: string;
  name: string;
  icon: LucideIcon;
  connected: boolean;
  email: string | null;
  url?: string;
  username?: string;
  lastSync?: Date;
  accessLevel?: 'read' | 'read-write' | 'full';
}
