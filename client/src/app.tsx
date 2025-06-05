import "./app.css";
import ImageConverter from "./images/ImageConverter.jsx";
import { useWasm } from "./useWasm.js";

export function App() {
  const { wasmReady, wasmError } = useWasm();
  console.log("WASM ready:", wasmReady);

  return (
    <div>
      {wasmError && <p>Error initializing WASM: {wasmError.message}</p>}
      <ImageConverter />
    </div>
  );
}
