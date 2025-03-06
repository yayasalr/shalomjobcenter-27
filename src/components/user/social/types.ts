
import { ElementType } from 'react';

export interface SocialAccount {
  id: string;
  name: string;
  icon: ElementType;
  connected: boolean;
  email: string | null;
}
