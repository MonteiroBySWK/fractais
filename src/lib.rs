use wasm_bindgen::prelude::*;
use js_sys::Uint8Array;
use num_complex::Complex;

const DIM: usize = 500;
const COLOUR_C: f64 = 1024.0;
const ITERACOES_K: u32 = 50;
const K: f64 = 1.0;
const ZETA: f64 = 0.3;

#[wasm_bindgen]
pub fn funcao(zoom: f64, dx: f64, dy: f64) -> Uint8Array {
    let mut m = vec![0u8; DIM * DIM];
    let min_x = (-2.0 * zoom) - dx;
    let max_x = (2.0 * zoom) - dx;
    let min_y = (-2.0 * zoom) - dy;
    let max_y = (2.0 * zoom) - dy;

    let eixo_x: Vec<f64> = (0..DIM).map(|i| min_x + i as f64 * (max_x - min_x) / (DIM - 1) as f64).collect();
    let eixo_y: Vec<f64> = (0..DIM).map(|i| min_y + i as f64 * (max_y - min_y) / (DIM - 1) as f64).collect();

    for (u, &x) in eixo_x.iter().enumerate() {
        for (v, &y) in eixo_y.iter().enumerate() {
            let mut z = Complex::new(0.0, 0.0);
            let c = Complex::new(x, y);
            let mut n = 0;

            let r = if c.norm() <= (2.0 / ZETA).powf(1.0 / K) {
                (2.0 / ZETA).powf(1.0 / K)
            } else {
                c.norm()
            };

            while n < ITERACOES_K && z.norm() < r {
                let vn = (1.0 - ZETA) * z + ZETA * mandelbrot(z, c);
                let yn = mandelbrot(vn, c);
                z = mandelbrot(yn, c);
                n += 1;
            }

            let cor = (COLOUR_C * n as f64 / ITERACOES_K as f64) as u8;
            m[v * DIM + u] = cor;
        }
    }

    Uint8Array::from(&m[..])
}

fn mandelbrot(z: Complex<f64>, c: Complex<f64>) -> Complex<f64> {
    z.powf(K + 1.0) + c
}

