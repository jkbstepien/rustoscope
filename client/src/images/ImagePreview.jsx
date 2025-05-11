import { useEffect, useRef, useState } from "preact/hooks";
import "./ImagePreview.css";

const ImagePreview = ({
  imageUrl,
  header,
  emptyText,
  aspectRatio,
  setAspectRatio,
}) => {
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || !imgRef.current) return;

    const img = imgRef.current;

    const updateAspect = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };

    if (img.complete) {
      updateAspect();
    } else {
      img.onload = updateAspect;
    }
  }, [imageUrl]);

  const previewStyle = {
    aspectRatio: aspectRatio.toFixed(5),
  };

  return (
    <div className='image-preview'>
      {header && <h2>{header}</h2>}
      {imageUrl ? (
        <img ref={imgRef} src={imageUrl} alt='Preview' style={previewStyle} />
      ) : (
        <div className='empty-preview' style={previewStyle}>
          <p>{emptyText || "No image available"}</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
