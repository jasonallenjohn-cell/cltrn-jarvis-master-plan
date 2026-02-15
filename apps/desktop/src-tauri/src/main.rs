use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, Manager, GlobalShortcutManager};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show K0RE");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                    }
                    "show" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .setup(|app| {
             // Global Shortcut to toggle window (Command+Shift+K)
             let window = app.get_window("main").unwrap();
             let mut shortcut_manager = app.global_shortcut_manager();
             // Note: On macOS, "Command+Shift+K" might be reserved or specific. 
             // Using "Option+Space" is common for launchers, but let's stick to K0RE brand.
             // Let's try "CommandOrControl+Shift+K".
             match shortcut_manager.register("CommandOrControl+Shift+K", move || {
                 if window.is_visible().unwrap() {
                     window.hide().unwrap();
                 } else {
                     window.show().unwrap();
                     window.set_focus().unwrap();
                 }
             }) {
                 Ok(_) => println!("Global shortcut registered!"),
                 Err(e) => println!("Error registering shortcut: {}", e),
             }
             Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
