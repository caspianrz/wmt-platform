import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import { useState, useCallback } from "react";
import { ImageUploader } from "~/components/ImageUploader";
import { WatermarkControls } from "~/components/WatermarkControls";
import { AttackControls } from "~/components/AttackControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ImageCanvas } from "~/components/ImageCanvas";
import { WatermarkAnalysis } from "~/components/WatermarkAnalysis";
import loadImage from "~/components/ImageProcessor";
import { Card } from "~/components/ui/Card";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [attackedImage, setAttackedImage] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    const imageData = await loadImage(file);
    setOriginalImage(imageData);
  }, []);
  const handleRemoveImage = useCallback(() => {}, []);

  // Watermark settings
  const [watermarkText, setWatermarkText] = useState("© Watermark Test");
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");
  const [watermarkType, setWatermarkType] = useState("text");
  const [watermarkPositionType, setWatermarkPositionType] =
    useState("relative");
  const [watermarkX, setWatermarkX] = useState(50);
  const [watermarkY, setWatermarkY] = useState(50);

  const [noiseLevel, setNoiseLevel] = useState(10);
  const [blurStrength, setBlurStrength] = useState(2);
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [rotationAngle, setRotationAngle] = useState(0);

  const [attacksApplied, setAttacksApplied] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState({
    hasWatermark: false,
    confidence: 0,
    robustness: 100,
    detectionResults: {
      textDetection: 0,
      frequencyAnalysis: 0,
      correlationScore: 0,
    },
  });

  const handleApplyWatermark = useCallback(async (data: string) => {
    const imageData = data;
    setWatermarkImage(imageData);
  }, []);
  const handleApplyAttack = useCallback(async (attackType: string) => {}, []);
  const handleResetImage = useCallback(() => {}, []);

  return (
    <div className="min-h-screen bg-background p-6 dark">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-8 text-center">Watermark Testing Platform</h1>
        <p className="text-center text-muted-foreground mb-8">
          Upload an image, apply watermarks, simulate attacks, and analyze
          watermark robustness in real-time
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <ImageUploader
                onImageUpload={handleImageUpload}
                uploadedImage={originalImage}
                onRemoveImage={handleRemoveImage}
                withHeader={true}
              />
            </Card>

            <WatermarkControls
              watermarkText={watermarkText}
              setWatermarkText={setWatermarkText}
              watermarkOpacity={watermarkOpacity}
              setWatermarkOpacity={setWatermarkOpacity}
              watermarkPosition={watermarkPosition}
              setWatermarkPosition={setWatermarkPosition}
              watermarkType={watermarkType}
              setWatermarkType={setWatermarkType}
              watermarkPositionType={watermarkPositionType}
              setWatermarkPositionType={setWatermarkPositionType}
              watermarkX={watermarkX}
              setWatermarkX={setWatermarkX}
              watermarkY={watermarkY}
              setWatermarkY={setWatermarkY}
              onApplyWatermark={handleApplyWatermark}
              disabled={!originalImage}
            />

            <AttackControls
              noiseLevel={noiseLevel}
              setNoiseLevel={setNoiseLevel}
              blurStrength={blurStrength}
              setBlurStrength={setBlurStrength}
              compressionQuality={compressionQuality}
              setCompressionQuality={setCompressionQuality}
              rotationAngle={rotationAngle}
              setRotationAngle={setRotationAngle}
              onApplyAttack={handleApplyAttack}
              onResetImage={handleResetImage}
              disabled={false}
            />
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images">Image Processing</TabsTrigger>
                <TabsTrigger value="analysis">Watermark Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="images" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageCanvas imageData={originalImage} />
                  <ImageCanvas imageData={watermarkImage} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageCanvas imageData={watermarkedImage} />
                  <ImageCanvas imageData={attackedImage} />
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <WatermarkAnalysis
                  hasWatermark={analysisResults.hasWatermark}
                  confidence={analysisResults.confidence}
                  robustness={analysisResults.robustness}
                  attacksApplied={attacksApplied}
                  detectionResults={analysisResults.detectionResults}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}