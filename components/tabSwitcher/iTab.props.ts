import { TextStyle, ViewStyle } from "react-native";
import  {  JSX } from 'react';
export interface ITabProps {
    title?: string;
    data: ITab[];
    onPress: (e: ITab) => void;
    tabContainerStyle?:ViewStyle;
    tabStyle?:ViewStyle | ViewStyle[];
    tabTextStyle?:TextStyle;
    leftAction?:JSX.Element;

  }
  
  export interface ITab {
    id: number;
    label: string;
    value: string;
    component?:JSX.Element;
  }
  