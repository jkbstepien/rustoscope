use image::{DynamicImage, ImageError, ImageOutputFormat};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

// Functions used in the client code

#[wasm_bindgen]
pub fn to_grayscale(image: &[u8]) -> Result<Vec<u8>, JsValue> {
    read_and_encode(image, |img| img.grayscale())
}

#[wasm_bindgen]
pub fn invert_colors(image: &[u8]) -> Result<Vec<u8>, JsValue> {
    read_and_encode(image, |mut img| {
        img.invert();
        img
    })
}

#[wasm_bindgen]
pub fn to_png(image: &[u8]) -> Result<Vec<u8>, JsValue> {
    read_and_encode(image, |img| img)
}

// Helpers

fn read_and_encode(
    image_bytes: &[u8],
    mut transform: impl FnMut(DynamicImage) -> DynamicImage,
) -> Result<Vec<u8>, JsValue> {
    let img = image::load_from_memory(image_bytes).map_err(generate_error_message)?;
    let img = transform(img);

    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();

    Ok(buf.into_inner())
}

fn generate_error_message(err: ImageError) -> JsValue {
    JsValue::from_str(&format!("Image processing error: {}", err))
}
