use num_complex::Complex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn julia_fractal(
    width: usize,
    height: usize,
    zoom: f64,
    cx: f64,
    cy: f64,
    max_iter: usize,
) -> Vec<u8> {
    let mut pixels = vec![0u8; width * height * 4];
    let scale_x = 3.0 / (width as f64 * zoom);
    let scale_y = 3.0 / (height as f64 * zoom);
    let max_iter_inv = 255.0 / max_iter as f64; // Pre-cálculo para otimizar a atribuição de cor

    for x in 0..width {
        for y in 0..height {
            let zx = x as f64 * scale_x - 1.5;
            let zy = y as f64 * scale_y - 1.5;
            let mut z = Complex::new(zx, zy);
            let c = Complex::new(cx, cy);
            let mut iter = 0;

            while iter < max_iter && z.re * z.re + z.im * z.im <= 4.0 {
                z = z * z + c;
                iter += 1;
            }

            let pixel_index = 4 * (y * width + x);
            let color = if iter < max_iter {
                (255.0 - (iter as f64 * max_iter_inv)) as u8
            } else {
                0
            };
            pixels[pixel_index] = color;
            pixels[pixel_index + 1] = color;
            pixels[pixel_index + 2] = color;
            pixels[pixel_index + 3] = 255; // Opacidade total
        }
    }

    pixels
}
