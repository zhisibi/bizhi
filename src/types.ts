/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Photographer {
  name: string;
  username: string;
  profileUrl: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  views: number;
  downloads: number;
  likes: number;
  url: string;
  credit: Photographer;
  photoId: string;
  defaultRatio: string;
  tags: string[];
  colors: string[]; // hex codes
  description: string;
}

export interface AIAssistResponse {
  expandedPrompt: string;
  colorPalette: { name: string; hex: string }[];
  tags: string[];
  aestheticAnalysis: string;
  matchingKeywords: string[];
}
