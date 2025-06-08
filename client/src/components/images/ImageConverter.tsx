import { useState } from 'preact/hooks';
import { useWasm } from '@/hooks/useWasm';
import {
  to_grayscale,
  invert_colors,
  to_png,
  clip_pixels_with_percentiles,
  gaussian_blur,
  median_blur,
} from '@/wasm';
import ImagePreview from './ImagePreview.jsx';
import AlgorithmsContainer from '@/components/algorithms/AlgorithmsContainer';
import {
  ConversionAlgorithm,
  ConversionAlgorithmType,
} from '@/models/algorithms';
import { TargetedEvent } from 'preact/compat';

const convert = (
  bytesToProcess: Uint8Array<ArrayBufferLike>,
  algorithm: ConversionAlgorithm,
  setErrorMessage: (msg: string) => void
): Uint8Array<ArrayBufferLike> | undefined => {
  switch (algorithm.type) {
    case ConversionAlgorithmType.Grayscale:
      return to_grayscale(bytesToProcess);
    case ConversionAlgorithmType.Invert:
      return invert_colors(bytesToProcess);
    case ConversionAlgorithmType.HotPixelRemoval:
      return clip_pixels_with_percentiles(
        bytesToProcess,
        algorithm.lowPercentile,
        algorithm.highPercentile
      );
    case ConversionAlgorithmType.GaussianBlur:
      return gaussian_blur(bytesToProcess, algorithm.sigma);
    case ConversionAlgorithmType.MedianBlur:
      return median_blur(bytesToProcess, algorithm.kernelRadius);
    default:
      // fallback for unsupported algorithms
      // This should ideally never happen if the algorithm list is properly managed
      // That is why we use `as any` to avoid TypeScript errors
      setErrorMessage(`Unsupported algorithm: ${(algorithm as any).type}`);
      return;
  }
};

const processBytes = (fileType: string, bytes: Uint8Array<ArrayBufferLike>) => {
  switch (fileType) {
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
      return bytes;
    case 'image/tiff':
      return to_png(bytes);
    default:
      throw new Error('Unsupported image type. Supported: [png, jpg, tiff]');
  }
};

const ImageConverter = () => {
  const { wasmReady } = useWasm();
  const [algorithms, setAlgorithms] = useState<ConversionAlgorithm[]>([]);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgResult, setImgResult] = useState<string | null>(null);
  const [rawBytes, setRawBytes] = useState<Uint8Array | null>(null);
  const [previewsAspectRatios, setPreviewsAspectRatios] = useState(16 / 10);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleUpload = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    setErrorMessage(undefined);

    try {
      const processedBytes = processBytes(file.type, bytes);
      setRawBytes(processedBytes);
      const blob = new Blob([processedBytes]);
      setImgSrc(URL.createObjectURL(blob));
    } catch (err) {
      setErrorMessage(`Upload error: ${err}`);
      setImgSrc(null);
      setRawBytes(null);
    }
  };

  const handleRun = () => {
    const enabledAlgorithms = algorithms.filter((a) => a.enabled);
    if (!rawBytes || !wasmReady) return;
    if (enabledAlgorithms.length === 0) {
      setErrorMessage('No algorithms selected');
      return;
    }
    setErrorMessage(undefined);

    let processedBytes: Uint8Array<ArrayBufferLike> | undefined =
      Uint8Array.from(rawBytes);
    for (const algorithm of enabledAlgorithms) {
      processedBytes = convert(processedBytes, algorithm, setErrorMessage);
      if (!processedBytes) {
        console.error(`Conversion failed for algorithm: ${algorithm.type}`);
        return;
      }
    }

    const blob = new Blob([processedBytes], { type: 'image/png' });
    setImgResult(URL.createObjectURL(blob));
    setErrorMessage(undefined);
  };

  return (
    <div
      className={`flex items-center h-full w-full p-1 bg-white ${
        wasmReady ? '' : 'opacity-50'
      }`}
    >
      <div className="flex w-3/4 h-full rounded-md bg-orange-100 mr-1 mt-2">
        <div className="w-full flex items-start justify-center mt-10 rounded-md">
          <ImagePreview
            imageUrl={imgSrc}
            header={'Original Image'}
            aspectRatio={previewsAspectRatios}
            setAspectRatio={setPreviewsAspectRatios}
            emptyText={'No image selected'}
            error={errorMessage}
          />
        </div>
        <div className="w-full flex items-start justify-center mt-10 rounded-md">
          <ImagePreview
            imageUrl={imgResult}
            header={'Converted Image'}
            aspectRatio={previewsAspectRatios}
            setAspectRatio={setPreviewsAspectRatios}
            emptyText={
              imgSrc
                ? "Select conversion type and press 'Run'"
                : 'No image selected'
            }
          />
        </div>
      </div>
      <div className="w-1/4 flex-col h-full bg-gray-50 mt-2 ml-1 rounded-md p-3 shadow-md">
        <div className="flex justify-evenly space-around w-full mb-4">
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-center flex items-center justify-center px-4 py-2 rounded-md h-[30px] w-[135px] bg-orange-500 text-white transition-colors hover:bg-orange-600"
          >
            Upload image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            className="cursor-pointer text-center flex items-center justify-center px-4 py-2 rounded-md h-[30px] w-[135px] bg-green-600 text-white transition-colors hover:bg-green-700"
            onClick={handleRun}
          >
            Run
          </button>
        </div>

        <AlgorithmsContainer
          algorithms={algorithms}
          setAlgorithms={setAlgorithms}
        />
      </div>
    </div>
  );
};

export default ImageConverter;
