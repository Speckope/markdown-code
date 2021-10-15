export interface Cell {
  id: string;
  content: string;
  type: 'code' | 'text';
  sharedEnvironment: boolean;
}
