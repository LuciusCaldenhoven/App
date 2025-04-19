import { JSX } from 'react';

export interface IbottomSheetFixProps {
  visible: boolean;
  setVisible: (e: boolean) => void;
  
  OnPress: () => void;
  title: string;
  description: string;
  placeholder: string;
}