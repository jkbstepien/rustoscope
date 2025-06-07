import ImageConverter from '@/components/images/ImageConverter';
import { useWasm } from '@/hooks/useWasm';

export function App() {
  const { wasmReady, wasmError } = useWasm();
  console.log('WASM ready:', wasmReady);

  return (
    <div className="flex flex-col h-screen p-2">
      {wasmError && <p>Error initializing WASM: {wasmError.message}</p>}
      <div className="w-full bg-orange-300 flex items-center justify-start text-3xl font-bold rounded-md">
        <div className="px-6 py-2">Rustoscope</div>
      </div>
      <ImageConverter />
    </div>
  );
}
