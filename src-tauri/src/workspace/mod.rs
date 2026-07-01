use std::fs;
use std::path::{Path, PathBuf};

use tauri::Manager;

const WORKSPACE_DIRS: &[&str] = &[
    "database",
    "documents",
    "images",
    "maps",
    "exports",
    "backups",
    "cache",
];

const CONFIG_FILE_NAME: &str = "workspace_config.json";
const SETTINGS_FILE_NAME: &str = "settings.json";

fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|error| error.to_string())
        .map(|path| path.join(CONFIG_FILE_NAME))
}

fn read_stored_path(app: &tauri::AppHandle) -> Result<Option<String>, String> {
    let config_path = config_path(app)?;

    if !config_path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(&config_path).map_err(|error| error.to_string())?;
    let json: serde_json::Value = serde_json::from_str(&content).map_err(|error| error.to_string())?;

    Ok(json
        .get("path")
        .and_then(|value| value.as_str())
        .map(String::from))
}

fn save_path(app: &tauri::AppHandle, path: &str) -> Result<(), String> {
    let config_path = config_path(app)?;

    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }

    let json = serde_json::json!({ "path": path });
    fs::write(&config_path, json.to_string()).map_err(|error| error.to_string())
}

fn initialize_workspace_structure(workspace_path: &Path) -> Result<(), String> {
    if !workspace_path.exists() {
        fs::create_dir_all(workspace_path).map_err(|error| error.to_string())?;
    }

    for dir in WORKSPACE_DIRS {
        let dir_path = workspace_path.join(dir);
        fs::create_dir_all(&dir_path).map_err(|error| error.to_string())?;
    }

    let settings_path = workspace_path.join(SETTINGS_FILE_NAME);
    if !settings_path.exists() {
        let default_settings = serde_json::json!({
            "version": "1.0",
            "name": workspace_path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("Workspace")
        });

        fs::write(
            settings_path,
            serde_json::to_string_pretty(&default_settings).map_err(|error| error.to_string())?,
        )
        .map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_workspace_path(app: tauri::AppHandle) -> Result<Option<String>, String> {
    read_stored_path(&app)
}

#[tauri::command]
pub fn is_workspace_valid(app: tauri::AppHandle) -> Result<bool, String> {
    match read_stored_path(&app)? {
        Some(path) if Path::new(&path).exists() => Ok(true),
        _ => Ok(false),
    }
}

#[tauri::command]
pub fn create_workspace(app: tauri::AppHandle, path: String) -> Result<(), String> {
    let workspace_path = Path::new(&path);
    initialize_workspace_structure(workspace_path)?;
    save_path(&app, &path)
}

#[tauri::command]
pub fn open_workspace(app: tauri::AppHandle, path: String) -> Result<(), String> {
    if !Path::new(&path).exists() {
        return Err("Selected folder does not exist.".to_string());
    }

    save_path(&app, &path)
}
