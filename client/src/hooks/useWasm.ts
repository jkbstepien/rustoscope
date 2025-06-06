import { useEffect, useState } from "preact/hooks";
import init from "../wasm/wasm_api.js";

export function useWasm() {
  const [wasmReady, setWasmReady] = useState<boolean>(false);
  const [wasmError, setWasmError] = useState<Error | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init();
        setWasmReady(true);
      } catch (error: any) {
        setWasmError(error);
      }
    };

    loadWasm();
  }, []);

  return { wasmReady, wasmError };
}
