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

  // Função para renderizar o fractal
  function renderFractal() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);

    // Obtém os dados renderizados do Rust
    const pixels = renderer.render();

    // Atualiza o canvas
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  // Função para atualizar o estado e renderizar continuamente
  function updateAndRender(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Tempo decorrido em segundos
    lastTime = currentTime;

    let dx = 0,
      dy = 0,
      zoom = 1.0;

    // Ajusta dx, dy e zoom com base nas teclas pressionadas
    if (keysPressed["w"]) dy -= 0.5 * deltaTime;
    if (keysPressed["s"]) dy += 0.5 * deltaTime;
    if (keysPressed["a"]) dx -= 0.5 * deltaTime;
    if (keysPressed["d"]) dx += 0.5 * deltaTime;
    if (keysPressed["ArrowUp"]) zoom *= 1 + 0.5 * deltaTime;
    if (keysPressed["ArrowDown"]) zoom /= 1 + 0.5 * deltaTime;

    // Atualiza o estado no Rust
    renderer.update(dx, dy, zoom);

    // Renderiza o fractal
    renderFractal();

    // Continua o loop
    requestAnimationFrame(updateAndRender);
  }

  // Lida com teclas pressionadas
  window.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
  });

  // Lida com teclas liberadas
  window.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
  });

  // Inicia o loop contínuo
  requestAnimationFrame(updateAndRender);
}

main();
