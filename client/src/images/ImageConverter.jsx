import "./ImageConverter.css";
import { useState } from "preact/hooks";
import { useWasm } from "../useWasm.js";
import { to_grayscale } from "../wasm/wasm_api.js";
import ImagePreview from "./ImagePreview.jsx";

const ImageConverter = () => {
  const { wasmReady } = useWasm();
  const [imgSrc, setImgSrc] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [rawBytes, setRawBytes] = useState(null);
  const [previesAspectRatios, setPreviesAspectRatios] = useState(16 / 10);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    setRawBytes(bytes);

    const blob = new Blob([bytes]);
    setImgSrc(URL.createObjectURL(blob));
  };

  const handleConvert = async () => {
    if (!rawBytes || !wasmReady) return;
    const output = to_grayscale(rawBytes);

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
          <button onClick={handleConvert} disabled={!wasmReady || !rawBytes}>
            Convert to Grayscale
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
              ? "Press select conversion type and press 'Convert'."
              : "No image selected"
          }
        />
      </div>
    </div>
  );
};

export default ImageConverter;
