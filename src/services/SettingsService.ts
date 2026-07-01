import { invoke } from "@tauri-apps/api/core";
import type { AppSettings } from "../types/settings";

export class SettingsService {
  async getSettings(): Promise<AppSettings> {
    return invoke<AppSettings>("get_app_settings");
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await invoke("save_app_settings", { settings });
  }

  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ): Promise<AppSettings> {
    const current = await this.getSettings();
    const updated = { ...current, [key]: value };
    await this.saveSettings(updated);
    return updated;
  }
}

export const settingsService = new SettingsService();
