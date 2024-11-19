# Madelbrot Fractal Renderer


Este é um projeto para geração de fractais utilizando **Rust** + **WebAssembly**.

## Requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- **Rust** e **Cargo**: [Instale aqui](https://www.rust-lang.org/tools/install)  
- **wasm-pack**: [Instale aqui](https://rustwasm.github.io/wasm-pack/installer/)
  
## Como rodar o projeto

### 1. Clone o repositório  
Abra o terminal e execute:  

```bash
git clone https://github.com/seu-usuario/mandelbrot-fractal-renderer.git
cd mandelbrot-fractal-renderer
```

### 2. Compile o código Rust para WebAssembly
Dentro da pasta do projeto, compile o código Rust:

```bash
wasm-pack build --release --target web
```

### 3. Suba o servidor local
Use o servidor HTTP simples do Python para servir os arquivos:

```bash
python3 -m http.server
```

Por padrão, o servidor estará acessível em http://127.0.0.1:8000
