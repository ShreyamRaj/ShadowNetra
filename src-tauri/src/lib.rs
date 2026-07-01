mod settings;
mod workspace;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            settings::get_app_settings,
            settings::save_app_settings,
            workspace::get_workspace_path,
            workspace::is_workspace_valid,
            workspace::create_workspace,
            workspace::open_workspace,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
