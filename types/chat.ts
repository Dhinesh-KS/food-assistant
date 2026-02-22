import { ComponentSchema } from '@/types/component';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  component?: ComponentSchema;
  uiComponents?: ComponentSchema[];
}
