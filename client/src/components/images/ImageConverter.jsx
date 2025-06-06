import { useState } from "preact/hooks";
import Select from "react-select";
import { useWasm } from "@/hooks/useWasm.ts";
import { to_grayscale, invert_colors, to_png, clip_pixels_with_percentiles } from "@/wasm/wasm_api.js";
import ImagePreview from "./ImagePreview.jsx";

const options = [
  { value: "grayscale", label: "Grayscale" },
  { value: "invert", label: "Invert" },
];

const convert = (rawBytes, conversionType) => {
  switch (conversionType) {
    case "grayscale":
      return to_grayscale(rawBytes);
    case "invert":
      return invert_colors(rawBytes);
    default:
      throw new Error("Unsupported conversion type");
  }
}

const processBytes = (fileType, bytes) => {
  switch (fileType) {
    case "image/png":
      return bytes;
    case "image/jpg":
      return bytes;
    case "image/tiff":
      return to_png(bytes);
    default:
      throw new Error("Unsupported image type. Supported: [png, jpg, tiff]");
  }
}

const ImageConverter = () => {
  const { wasmReady } = useWasm();

  const [imgSrc, setImgSrc] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [rawBytes, setRawBytes] = useState(null);
  const [previesAspectRatios, setPreviesAspectRatios] = useState(16 / 10);
  const [conversionType, setConversionType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lowPercentile, setLowPercentile] = useState(5);
  const [highPercentile, setHighPercentile] = useState(95);
  const [removeHotPixels, setRemoveHotPixels] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    setErrorMessage(null);

    try {
      const processedBytes = processBytes(file.type, bytes);
      setRawBytes(processedBytes);
      const blob = new Blob([processedBytes]);
      setImgSrc(URL.createObjectURL(blob));
    } catch (err) {
      console.error(`Upload error: ${err}`)
      setErrorMessage(`Upload error: ${err}`)
      setImgSrc(null);
      setRawBytes(null);
    }
  };

  const handleConvert = async () => {
    if (!rawBytes || !wasmReady) return;

    setErrorMessage(null);

    try {
      const convertedBytes = convert(rawBytes, conversionType.value);

      let finalBytes = convertedBytes;
      if (removeHotPixels) {
        try {
          finalBytes = clip_pixels_with_percentiles(
              convertedBytes,
              lowPercentile,
              highPercentile
          );
        } catch (hpErr) {
          console.error(`Hot-pixel removal error: ${hpErr}`);
          setErrorMessage(`Hot-pixel removal error: ${hpErr}`);
          finalBytes = convertedBytes;
        }
      }

      const blob = new Blob([finalBytes], { type: "image/png" });
      setImgResult(URL.createObjectURL(blob));
    } catch (convErr) {
      console.error(`Conversion error: ${convErr}`);
      setErrorMessage(`Conversion error: ${convErr}`);
    }
  };

  return (
      <div className="flex flex-row flex-grow h-full w-full rounded-md bg-orange-100 mt-2">
        <div className="w-2/5 flex items-start justify-center mt-10 rounded-md">
          <ImagePreview
              imageUrl={imgSrc}
              header={"Original Image"}
              aspectRatio={previesAspectRatios}
              setAspectRatio={setPreviesAspectRatios}
              emptyText={"No image selected"}
              error={errorMessage}
          />
        </div>
        <div className="w-2/5 flex items-start justify-center mt-10 rounded-md">
          <ImagePreview
              imageUrl={imgResult}
              header={"Converted Image"}
              aspectRatio={previesAspectRatios}
              setAspectRatio={setPreviesAspectRatios}
              emptyText={
                imgSrc
                    ? "Select conversion type and press 'Convert'"
                    : "No image selected"
              }
          />
        </div>
        <div className="w-1/5 flex flex-col items-center justify-start bg-white rounded-md m-2">
          <div className='py-4 text-xl font-bold'>Options</div>
          <div className='w-full h-full flex flex-col items-start justify-start mt-2 px-2'>
            <div className='w-full flex flex-col items-center justify-center'>
              <label
                  htmlFor='image-upload' className='cursor-pointer text-center px-4 py-2 bg-orange-500 text-white rounded-md mb-4 w-[150px]'>
                Upload image
              </label>
              <input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  onChange={handleUpload}
                  className='hidden'
              />
                <button
                    onClick={handleConvert}
                    disabled={!wasmReady || !rawBytes || !conversionType}
                    className={`
                  cursor-pointer text-center px-4 py-2 bg-orange-700 text-white rounded-md mb-4 w-[150px]
                  ${(!wasmReady || !rawBytes || !conversionType) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                >
                  Convert
                </button>
            </div>
            <label htmlFor="conversion-select" className="block text-gray-700 text-sm font-medium mb-1 mt-4">
              Conversion Type:
            </label>
            <Select
                id="conversion-select"
                value={conversionType}
                onChange={(opt) => setConversionType(opt)}
                options={options}
                className="w-full"
                classNamePrefix="react-select"
            />
            <label htmlFor='hotpixels-checkbox' className='flex items-center cursor-pointer text-gray-700 text-sm font-medium w-full mt-4'>
              <input
                  id='hotpixels-checkbox'
                  type='checkbox'
                  checked={removeHotPixels}
                  onInput={(e) => setRemoveHotPixels(e.currentTarget.checked)}
                  className='form-checkbox h-4 w-4 text-blue-600 rounded mr-2 focus:ring-blue-500'
              />
              Remove hot-pixels
            </label>
            <div className="flex items-center justify-start w-full">
              <label htmlFor="percentile-input" className='text-gray-700 text-sm font-medium mr-2 py-4'>
                Percentile low:
              </label>
              <input
                  id="percentile-input"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={lowPercentile}
                  onInput={(e) => {
                    const val = e.currentTarget.valueAsNumber;
                    if (!Number.isNaN(val) && val >= 0 && val <= 100) {
                      setLowPercentile(val);
                    }
                  }}
                  className='w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
              />
            </div>
            <div className="flex items-center justify-start w-full">
              <label htmlFor="percentile-input" className='text-gray-700 text-sm font-medium mr-2 py-4'>
                Percentile high:
              </label>
              <input
                  id="percentile-input"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={highPercentile}
                  onInput={(e) => {
                    const val = e.currentTarget.valueAsNumber;
                    if (!Number.isNaN(val) && val >= 0 && val <= 100) {
                      setHighPercentile(val);
                    }
                  }}
                  className='w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default ImageConverter;
