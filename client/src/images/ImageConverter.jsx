import "./ImageConverter.css";
import { useState } from "preact/hooks";
import Select from "react-select";
import { useWasm } from "../useWasm.js";
import { to_grayscale, invert_colors, to_png, remove_hot_pixels_with_percentile } from "../wasm/wasm_api.js";
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
  const [percentile, setPercentile] = useState(95);
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

    try {
      const convertedBytes = convert(rawBytes, conversionType.value);

      let finalBytes = convertedBytes;
      if (removeHotPixels) {
        try {
          finalBytes = remove_hot_pixels_with_percentile(
            convertedBytes,
            percentile
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
    <div className='image-converter'>
      <div className='image-converter-header'>
        <h1>Image Converter</h1>
        <div className='image-converter-controls'>
          <label for='image-upload' className='upload-label'>
            Upload Image
          </label>
          <Select
            value={conversionType}
            onChange={(opt) => setConversionType(opt)}
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                borderColor: "#ccc",
                boxShadow: "none",
                minWidth: "150px",
                "&:hover": { borderColor: "#888" },
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "#f0f0f0" : "white",
                color: "#333",
              }),
            }}
          />
          <label htmlFor='hotpixels-checkbox' style={{ marginRight: '4px' }}>
            <input
              id='hotpixels-checkbox'
              type='checkbox'
              checked={removeHotPixels}
              onInput={(e) => setRemoveHotPixels(e.currentTarget.checked)}
              style={{ marginRight: '4px' }}
            />
            Remove hot-pixels
          </label>
          <label htmlFor="percentile-input" style={{ marginRight: '8px' }} className='text-red-500'>
            Percentile:
          </label>
          <input
            id="percentile-input"
            type="number"
            min="0"
            max="100"
            step="1"
            value={percentile}
            onInput={(e) => {
              const val = e.currentTarget.valueAsNumber;
              if (!Number.isNaN(val) && val >= 0 && val <= 100) {
                setPercentile(val);
              }
            }}
            style={{
              width: '80px',
              borderRadius: '6px',
              borderColor: '#ccc',
              padding: '4px',
            }}
          />
          <button
            onClick={handleConvert}
            disabled={!wasmReady || !rawBytes || !conversionType}
          >
            Convert
          </button>
          <input
            id='image-upload'
            type='file'
            accept='image/*'
            onChange={handleUpload}
          />
        </div>
      </div>
      <div className='image-preview-container'>
        <ImagePreview
          imageUrl={imgSrc}
          header={"Original Image"}
          aspectRatio={previesAspectRatios}
          setAspectRatio={setPreviesAspectRatios}
          emptyText={"No image selected"}
          error={errorMessage}
        />
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
    </div>
  );
};

export default ImageConverter;
