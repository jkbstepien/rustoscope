use image::{DynamicImage, ImageOutputFormat};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

fn read_and_encode(
    image_bytes: &[u8],
    mut transform: impl FnMut(DynamicImage) -> DynamicImage,
) -> Vec<u8> {
    let img = image::load_from_memory(image_bytes).unwrap();
    let img = transform(img);

    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();
    buf.into_inner()
}

#[wasm_bindgen]
pub fn to_grayscale(image: &[u8]) -> Vec<u8> {
    read_and_encode(image, |img| img.grayscale())
}

#[wasm_bindgen]
pub fn invert_colors(image: &[u8]) -> Vec<u8> {
    read_and_encode(image, |mut img| {
        img.invert();
        img
    })
}

#[wasm_bindgen]
pub fn to_png(image: &[u8]) -> Vec<u8> {
    read_and_encode(image, |img| img)
}
