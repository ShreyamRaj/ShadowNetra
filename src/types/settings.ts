export type Theme = "dark" | "light";
export type MapProvider = "offline";
export type Language = "en";

export interface AppSettings {
  theme: Theme;
  recentWorkspaces: string[];
  lastWorkspace: string;
  defaultMapProvider: MapProvider;
  defaultZoom: number;
  language: Language;
}

const DEFAULT_ZOOM = 12;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: "dark",
  recentWorkspaces: [],
  lastWorkspace: "",
  defaultMapProvider: "offline",
  defaultZoom: DEFAULT_ZOOM,
  language: "en",
};
