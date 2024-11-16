import init, { funcao } from "./pkg/fractais.js";

let zoom = 1.0;
let dx = 0.0;
let dy = 0.0;
const vel = 0.1;

async function run() {
  await init();
  const canvas = document.getElementById("fractal");
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(500, 500);

  function renderFractal() {
    const pixels = funcao(zoom, dx, dy);
    for (let i = 0; i < pixels.length; i++) {
      const value = pixels[i];
      imageData.data[i * 4] = value; // Red
      imageData.data[i * 4 + 1] = value; // Green
      imageData.data[i * 4 + 2] = value; // Blue
      imageData.data[i * 4 + 3] = 255; // Alpha
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "w": // Move para cima
        dy -= vel;
        break;
      case "s": // Move para baixo
        dy += vel;
        break;
      case "a": // Move para esquerda
        dx -= vel;
        break;
      case "d": // Move para direita
        dx += vel;
        break;
      case "ArrowUp": // Zoom in
        zoom *= 1.1;
        break;
      case "ArrowDown": // Zoom out
        zoom /= 1.1;
        break;
    }
    renderFractal();
  }
  window.addEventListener("keydown", handleKeyDown);
  renderFractal();
}

run();
