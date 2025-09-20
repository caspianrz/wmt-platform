import { useEffect, useRef } from "react";
import { Card } from "./ui/Card";

interface ImageCanvasProps {
  imageData: string | null;
  width?: number;
  height?: number;
	useCanvas?: boolean;
}

export function ImageCanvas({
  imageData,
  width = 512,
  height = 512,
	useCanvas = true,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      };
      img.src = imageData;
    }
  }, [imageData]);

  return (
    <Card className="p-4">
			{useCanvas && (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded bg-muted/20"
        style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
      />)}
			{(!useCanvas && imageData != null) && (
				<img src={imageData} />
			)}
    </Card>
  );
}
