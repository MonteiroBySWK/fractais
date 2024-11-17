use wasm_bindgen::prelude::*;
use js_sys::Uint8Array;
use num_complex::Complex;

const CANVAS_WIDTH: usize = 500;
const CANVAS_HEIGHT: usize = 500;

#[wasm_bindgen]
pub struct FractalRenderer {
    dx: f64,
    dy: f64,
    zoom: f64,
    iteracoes_k: u32, // Número de iterações
}

#[wasm_bindgen]
impl FractalRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            dx: 0.0,
            dy: 0.0,
            zoom: 1.0,
            iteracoes_k: 100, // Valor inicial
        }
    }

    /// Atualiza os deslocamentos, zoom e número de iterações
    pub fn update(&mut self, dx_delta: f64, dy_delta: f64, zoom_delta: f64) {
        self.dx += dx_delta;
        self.dy += dy_delta;
        self.zoom *= zoom_delta;
    }

    /// Ajusta o número de iterações
    pub fn adjust_iterations(&mut self, delta: i32) {
        let new_value = self.iteracoes_k as i32 + delta;
        self.iteracoes_k = new_value.max(1) as u32; // Garante que seja pelo menos 1
    }

    /// Renderiza o fractal
    pub fn render(&self) -> Uint8Array {
        let mut data = vec![0u8; CANVAS_WIDTH * CANVAS_HEIGHT * 4];

        for y in 0..CANVAS_HEIGHT {
            for x in 0..CANVAS_WIDTH {
                let fx = (x as f64 - CANVAS_WIDTH as f64 / 2.0) / (CANVAS_WIDTH as f64 / self.zoom) + self.dx;
                let fy = (y as f64 - CANVAS_HEIGHT as f64 / 2.0) / (CANVAS_HEIGHT as f64 / self.zoom) + self.dy;

                let c = Complex::new(fx, fy);
                let color = self.calculate_color(c);

                let index = (y * CANVAS_WIDTH + x) * 4;
                data[index] = color;       // Red
                data[index + 1] = color;   // Green
                data[index + 2] = color;   // Blue
                data[index + 3] = 255;     // Alpha
            }
        }

        Uint8Array::from(data.as_slice())
    }

    fn calculate_color(&self, c: Complex<f64>) -> u8 {
        let mut z = Complex::new(0.0, 0.0);
        let mut n = 0;

        while n < self.iteracoes_k && z.norm() < 4.0 {
            z = z * z + c;
            n += 1;
        }

        ((n as f64 / self.iteracoes_k as f64) * 255.0) as u8
    }
    
    pub fn get_zoom(&self) -> f64 {
        self.zoom
    }
}

