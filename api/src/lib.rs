use image::ImageOutputFormat;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn to_grayscale(image: &[u8]) -> Vec<u8> {
    let img = image::load_from_memory(image).unwrap();
    let gray = img.grayscale();

    let mut buf = Cursor::new(Vec::new());
    gray.write_to(&mut buf, ImageOutputFormat::Png).unwrap();
    buf.into_inner()
}

#[wasm_bindgen]
pub fn invert_colors(image: &[u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(image).unwrap();
    img.invert();

    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();
    buf.into_inner()
}
