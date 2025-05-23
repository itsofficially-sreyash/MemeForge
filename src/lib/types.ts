export interface Caption {
  id: string;
  text: string;
  x: number; // Percentage of canvas width (0-1)
  y: number; // Percentage of canvas height (0-1)
  fontSize: number; // Relative font size (e.g., percentage of canvas height)
  fontFamily: string;
  color: string;
  outlineColor: string;
  outlineWidth: number; // Relative to font size
  isEditing?: boolean;
  width?: number; // Calculated width for hit detection, in canvas pixels
  height?: number; // Calculated height for hit detection, in canvas pixels
  rotation: number; // In degrees
  isMirrored: boolean; // Horizontal mirror
}

export interface FontOption {
  value: string;
  label: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Arial Black, sans-serif", label: "Arial Black" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans MS" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "var(--font-geist-sans), sans-serif", label: "Geist Sans" },
  { value: "Times New Roman, serif", label: "Times New Roman"},
  { value: "Courier New, monospace", label: "Courier New"},
];

export const DEFAULT_FONT_SIZE = 5; // Default percentage of canvas height
export const DEFAULT_TEXT_COLOR = "#FFFFFF";
export const DEFAULT_OUTLINE_COLOR = "#000000";
export const DEFAULT_OUTLINE_WIDTH_FACTOR = 0.1; // 10% of font size
export const DEFAULT_FONT_FAMILY = "Impact, sans-serif";
