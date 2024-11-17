import init, { FractalRenderer } from "./pkg/fractais.js";

async function main() {
  await init();

  const renderer = new FractalRenderer();

  const canvas = document.getElementById("fractal");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  const keysPressed = {};
  let lastTime = performance.now();

  function renderFractal() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const pixels = renderer.render();
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  function updateAndRender(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    let dx = 0,
      dy = 0,
      zoom = 1.0;

    if (keysPressed["w"]) dy -= 0.5 * deltaTime;
    if (keysPressed["s"]) dy += 0.5 * deltaTime;
    if (keysPressed["a"]) dx -= 0.5 * deltaTime;
    if (keysPressed["d"]) dx += 0.5 * deltaTime;
    if (keysPressed["ArrowUp"]) zoom *= 1 + 0.5 * deltaTime;
    if (keysPressed["ArrowDown"]) zoom /= 1 + 0.5 * deltaTime;

    renderer.update(dx, dy, zoom);
    renderFractal();
    requestAnimationFrame(updateAndRender);
  }

  window.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;

    // Ajuste de iterações com setas esquerda e direita
    if (event.key === "ArrowLeft") {
      renderer.adjust_iterations(-1); // Reduz 1 iteração
      renderFractal();
    }
    if (event.key === "ArrowRight") {
      renderer.adjust_iterations(1); // Aumenta 1 iteração
      renderFractal();
    }
  });

  window.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
  });

  requestAnimationFrame(updateAndRender);
}

main();
