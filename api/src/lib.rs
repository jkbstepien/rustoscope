use image::{DynamicImage, ImageBuffer, ImageError, ImageOutputFormat, Rgb};
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

#[wasm_bindgen]
pub fn remove_hot_pixels_with_percentile(
    image_data: &[u8],
    percentile: f32,
) -> Result<Vec<u8>, JsValue> {
    if percentile < 0.0 || percentile > 100.0 {
        return Err(JsValue::from_str("Percentile must be between 0 and 100"));
    }
    let img = image::load_from_memory(image_data)
        .map_err(|e| JsValue::from_str(&format!("Image decode error: {}", e)))?;

    let rgb = img.to_rgb8();
    let (width, height) = rgb.dimensions();
    let mut pixels = rgb.into_raw();

    let total = pixels.len();
    if total == 0 {
        return Err(JsValue::from_str("Empty image buffer"));
    }

    let mut flat = pixels.clone();
    let idx = ((percentile / 100.0) * (total as f32)).floor() as usize;
    let idx = if idx >= total { total - 1 } else { idx };
    flat.select_nth_unstable(idx);
    let cutoff = flat[idx];

    pixels.iter_mut().for_each(|v| *v = (*v).min(cutoff));

    let clamped_buf: ImageBuffer<Rgb<u8>, Vec<u8>> =
        ImageBuffer::from_raw(width, height, pixels)
            .ok_or_else(|| JsValue::from_str("Buffer length mismatch"))?;
    let dyn_img = DynamicImage::ImageRgb8(clamped_buf);

    let mut output = Cursor::new(Vec::new());
    dyn_img
        .write_to(&mut output, ImageOutputFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("PNG encode error: {}", e)))?;
    Ok(output.into_inner())
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
