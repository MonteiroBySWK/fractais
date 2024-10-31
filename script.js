import init, { julia_fractal } from "./pkg/fractais.js";

const canvas = document.getElementById("fractal-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

let zoom = 1;
let offsetX = 0; // Deslocamento horizontal
let offsetY = 0; // Deslocamento vertical
let isDragging = false; // Controle de arrastar
let startX = 0; // Posição inicial do mouse (X)
let startY = 0; // Posição inicial do mouse (Y)
let cx = -0.7; // Centro X do fractal
let cy = 0.27015; // Centro Y do fractal

// Renderiza o fractal uma vez
async function renderFractal() {
  const width = canvas.width;
  const height = canvas.height;

  const pixels = julia_fractal(width, height, zoom, cx, cy, 300);
  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
  ctx.putImageData(imageData, 0, 0);
}

// Inicializa o WASM e renderiza o fractal inicialmente
init().then(() => {
  renderFractal();
});

// Controle de zoom com a roda do mouse
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();

  // Define fatores de zoom para zoom in e zoom out
  const zoomInFactor = 0.9; // Menor que 1 para zoom in
  const zoomOutFactor = 1.1; // Maior que 1 para zoom out

  // Coordenadas do mouse em relação ao canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / canvas.width;
  const mouseY = (event.clientY - rect.top) / canvas.height;

  // Calcular o novo centro baseado no ponto de zoom
  const newCx = cx + (mouseX - 0.5) / zoom;
  const newCy = cy + (mouseY - 0.5) / zoom;

  // Zoom in ou out baseado no scroll do mouse
  if (event.deltaY < 0) {
    // Zoom in
    zoom *= zoomInFactor; // Aplicando o fator de zoom
  } else {
    // Zoom out
    zoom /= zoomOutFactor; // Aplicando o fator de zoom
  }

  // Atualiza o centro para manter o ponto do mouse fixo
  cx = newCx;
  cy = newCy;

  // Renderiza novamente
  requestAnimationFrame(renderFractal);
});

// Controle de pan com clique e arraste
canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  const rect = canvas.getBoundingClientRect();

  // Captura a posição inicial do mouse
  startX = event.clientX - rect.left;
  startY = event.clientY - rect.top;
});

// Atualiza os offsets enquanto arrasta
canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calcular a mudança nas coordenadas
    const dx = (mouseX - startX) / zoom; // Alterar a posição em relação ao zoom
    const dy = (mouseY - startY) / zoom;

    // Atualiza os offsets
    offsetX += dx;
    offsetY += dy;

    // Atualiza a posição inicial para o próximo movimento
    startX = mouseX;
    startY = mouseY;

    // Re-renderiza o fractal com os novos offsets
    renderFractal();
  }
});

// Termina o arraste
canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});
