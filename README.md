<div align="center">
  <img src="./logo.png" width="200" alt="Project Logo">
</div>

# Rustoscope

WebAssembly image analysis, using Rust.

## Description

This project is currently under active development. You can view the latest version [here](https://jkbstepien.github.io/rustoscope/).

## Getting Started

### Dependencies

* `pnpm`
* `wasm-pack`

### Installing

* Clone this repo
* Inside `/client` call `pnpm install`

### Executing program

* Convert code to WebAssembly using `wasm-pack`
```
# Run inside /api dir
wasm-pack build --target web --out-dir ../client/src/wasm
```
* How to run the program
```
pnpm run dev
```
* For gh-pages deployment
```
pnpm run deploy
```

## Authors

Contributors:

1. [Jakub Stępień](https://github.com/jkbstepien)
2. [Kacper Cienkosz]()
3. [Adam Mytnik]()
