import init, { FractalRenderer } from "./pkg/fractais.js";

async function main() {
  await init();

  const renderer = new FractalRenderer();

  const canvas = document.getElementById("fractal");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  const keysPressed = {};
  const vel_base = 0.5; // Velocidade base
  let lastTime = performance.now();

  function renderFractal() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const pixels = renderer.render();
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  function updateAndRender(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Tempo em segundos
    lastTime = currentTime;

    const zoom = renderer.get_zoom();
    const speed = vel_base * zoom; // Velocidade ajustada pelo zoom

    let dx = 0,
      dy = 0,
      zoom_factor = 1.0;

    // Ajusta os deslocamentos com base nas teclas pressionadas
    if (keysPressed["w"]) dy -= speed * deltaTime;
    if (keysPressed["s"]) dy += speed * deltaTime;
    if (keysPressed["a"]) dx -= speed * deltaTime;
    if (keysPressed["d"]) dx += speed * deltaTime;

    // Ajusta o zoom
    if (keysPressed["ArrowUp"]) zoom_factor *= 1 + 0.5 * deltaTime;
    if (keysPressed["ArrowDown"]) zoom_factor /= 1 + 0.5 * deltaTime;

    renderer.update(dx, dy, zoom_factor);
    renderFractal();
    requestAnimationFrame(updateAndRender);
  }

  window.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;

    if (event.key === "ArrowLeft") {
      renderer.adjust_iterations(-1);
      renderFractal();
    }
    if (event.key === "ArrowRight") {
      renderer.adjust_iterations(1);
      renderFractal();
    }
  });

  window.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
  });

  requestAnimationFrame(updateAndRender);
}

main();
