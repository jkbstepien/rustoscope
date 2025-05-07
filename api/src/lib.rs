use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn update_button_text() -> String {
    "Clicked from Rust!".into()
}
