import { hex } from 'wcag-contrast';

const CONTRAST_THRESHOLD = 6;

const useContrastingTextColor = (backgroundColor: string) => {
  if (hex('#000000', backgroundColor) >= CONTRAST_THRESHOLD) {
    return '#000000';
  }
  return '#FFFFFF';
};

export default useContrastingTextColor;
