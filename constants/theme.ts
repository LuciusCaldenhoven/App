export const COLORS = {
  primary: "#2A4D50",
  secondary: "#DDF0FF",
  background: "#FFFFFF", 
  surface: "#1A1A1A",
  surfaceLight: "#2A2A2A",
  white: "#FFFFFF",
  grey: "#9CA3AF",
  tertiary: "#FF7754",
  border: '#dee2e6',
  gray: '#767676',
  gray2: "#C1C0C8",
  btnBorder: '#D7D7D7',
  offwhite: "#F3F4F8",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightWhite: "#FAFAFC",
  placeholder: '#7F7F7F',
  button: '#21292B',
  star: '#FF8F3A',
  outlineButtonBg: '#EDEDED',
  divider: '#D9D9D9',
  checkBoxBg: '#454545',

  visaCard: {
    primary: '#000000',
    secondary: '#1c1c1c',
    gray: '#2e2e2e',
    gray2: '#3a3a3a',
  },

} as const;
// #fcf8f3
export const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

import {scale} from './scale';

export const FontSize = {
  FONT_5Px: scale(5),
  FONT_6Px: scale(6),
  FONT_9Px: scale(9),
  FONT_10Px: scale(10),
  FONT_11Px: scale(11),
  FONT_14Px: scale(14),
  FONT_16Px: scale(16),
  FONT_18Px: scale(18),
  FONT_17Px: scale(17),
  FONT_12Px: scale(12),
  FONT_13Px: scale(13),
  FONT_20Px: scale(20),
  FONT_21Px: scale(21),
  FONT_22Px: scale(22),
  FONT_24Px: scale(24),
  FONT_15Px: scale(15),
  FONT_19Px: scale(19),
  FONT_30Px: scale(30),
  FONT_40Px: scale(40),
  FONT_45Px: scale(45),
  FONT_26Px: scale(26),
  FONT_28Px: scale(28),
  FONT_91Px: scale(91),
};
