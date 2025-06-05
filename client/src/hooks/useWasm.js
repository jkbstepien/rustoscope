import { useEffect, useState } from "preact/hooks";
import init from "../wasm/wasm_api.js";

export function useWasm() {
  const [wasmReady, setWasmReady] = useState(false);
  const [wasmError, setWasmError] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init();
        setWasmReady(true);
      } catch (error) {
        setWasmError(error);
      }
    };

    loadWasm();
  }, []);

  return { wasmReady, wasmError };
}
