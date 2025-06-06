<div align="center">
  <img src="./logo.png" width="200" alt="Project Logo">
</div>

# Rustoscope

WebAssembly image analysis, using Rust.

## 🌐 Live Demo

You can view the latest deployed version here:  
🔗 [https://jkbstepien.github.io/rustoscope/](https://jkbstepien.github.io/rustoscope/)

## 📦 Getting Started

### ✅ Prerequisites

Make sure the following tools are installed:

- [`pnpm`](https://pnpm.io/)
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/)

> 💡 Additionally, ensure Rust and `cargo` are installed. If not, install them with:  
> `curl https://sh.rustup.rs -sSf | sh`

### 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/rustoscope.git
   cd rustoscope
   ```

2. Install frontend dependencies:

   ```bash
    cd client
    pnpm install
   ```

### 🚀 Running the Project

1. Build WebAssembly from Rust source:

  ```bash
    # Run this inside the /api directory
    cd api
    wasm-pack build --target web --out-dir ../client/src/wasm
  ```

2. Start the development server:

  ```bash
    cd client
    pnpm run dev
  ```

### 🚢 Deployment (GitHub Pages)

To deploy the application:

```bash
pnpm run deploy
```

## Authors

Contributors:

1. [Jakub Stępień](https://github.com/jkbstepien)
2. [Kacper Cienkosz](https://github.com/kacienk)
3. [Adam Mytnik](https://github.com/AdamMytnik)

This project was created as a part of Large Scale Computing course at AGH University of Science and Technology in Kraków, Poland under the supervision of [PhD. Leszek Grzanka](https://github.com/grzanka).
