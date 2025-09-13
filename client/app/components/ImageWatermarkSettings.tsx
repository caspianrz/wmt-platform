import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import loadImage from "./ImageProcessor";

export default function ImageWatermarkSettings() {
  const [imageData, setImageData] = useState<string | null>(null);

  const onImageUpload = async (file: File) => {
    const data = await loadImage(file);
    setImageData(data);
  };

  const onRemoveImage = () => {
    setImageData(null);
  };

  return (
    <div>
      <ImageUploader
        uploadedImage={imageData}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        withHeader={false}
      />
    </div>
  );
}
