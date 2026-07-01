use std::fs;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tauri::Manager;

const APP_SETTINGS_FILE: &str = "app_settings.json";
const DEFAULT_ZOOM: i64 = 12;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub theme: String,
    pub recent_workspaces: Vec<String>,
    pub last_workspace: String,
    pub default_map_provider: String,
    pub default_zoom: i64,
    pub language: String,
}

fn settings_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|error| error.to_string())
        .map(|path| path.join(APP_SETTINGS_FILE))
}

fn default_settings() -> AppSettings {
    AppSettings {
        theme: "dark".to_string(),
        recent_workspaces: Vec::new(),
        last_workspace: String::new(),
        default_map_provider: "offline".to_string(),
        default_zoom: DEFAULT_ZOOM,
        language: "en".to_string(),
    }
}

fn write_settings(app: &tauri::AppHandle, settings: &AppSettings) -> Result<(), String> {
    let settings_path = settings_path(app)?;

    if let Some(parent) = settings_path.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }

    fs::write(
        settings_path,
        serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?,
    )
    .map_err(|error| error.to_string())
}

fn read_settings(app: &tauri::AppHandle) -> Result<AppSettings, String> {
    let settings_path = settings_path(app)?;

    if !settings_path.exists() {
        let defaults = default_settings();
        write_settings(app, &defaults)?;
        return Ok(defaults);
    }

    let content = fs::read_to_string(&settings_path).map_err(|error| error.to_string())?;
    serde_json::from_str(&content).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn get_app_settings(app: tauri::AppHandle) -> Result<AppSettings, String> {
    read_settings(&app)
}

#[tauri::command]
pub fn save_app_settings(app: tauri::AppHandle, settings: AppSettings) -> Result<(), String> {
    write_settings(&app, &settings)
}
