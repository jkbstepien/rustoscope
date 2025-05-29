import "./ImageConverter.css";
import { useState } from "preact/hooks";
import Select from "react-select";
import { useWasm } from "../useWasm.js";
import { to_grayscale, invert_colors, to_png } from "../wasm/wasm_api.js";
import ImagePreview from "./ImagePreview.jsx";

const options = [
  { value: "grayscale", label: "Grayscale" },
  { value: "invert", label: "Invert" },
];

function convert(rawBytes, conversionType) {
  switch (conversionType) {
    case "grayscale":
      return to_grayscale(rawBytes);
    case "invert":
      return invert_colors(rawBytes);
    default:
      throw new Error("Unsupported conversion type");
  }
}

const ImageConverter = () => {
  const { wasmReady } = useWasm();

  const [imgSrc, setImgSrc] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [rawBytes, setRawBytes] = useState(null);
  const [previesAspectRatios, setPreviesAspectRatios] = useState(16 / 10);
  const [conversionType, setConversionType] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Transcode potential TIFF file as most browser can't display it raw.
    const processedBytes = file.type === "image/tiff" ? to_png(bytes) : bytes;

    setRawBytes(processedBytes);

    const blob = new Blob([processedBytes]);
    setImgSrc(URL.createObjectURL(blob));
  };

  const handleConvert = async () => {
    if (!rawBytes || !wasmReady) return;
    const output = convert(rawBytes, conversionType.value);
    const blob = new Blob([output], { type: "image/png" });
    setImgResult(URL.createObjectURL(blob));
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
