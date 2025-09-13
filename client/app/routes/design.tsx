import { useEffect, useRef, useState, useCallback } from "react";
import { ImageUploader } from "~/components/ImageUploader";
import { WatermarkControls } from "~/components/WatermarkControls";
import { AttackControls } from "~/components/AttackControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { ImageCanvas } from "~/components/ImageCanvas";
import { WatermarkAnalysis } from "~/components/WatermarkAnalysis";
import loadImage from "~/components/ImageProcessor";
import WatermarkSetting from "~/components/WatermarkSetting";
import { Card } from "~/components/ui/Card";

export default function Design() {
  const [ctype, setCType] = useState("text");
  const [opacity, setOpacity] = useState(100);
  return (
    <div className="min-h-screen bg-background dark">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-2">
          <Card className="p-2">
            <h3 className="text-xl">Image</h3>
            <ImageUploader
              onImageUpload={null}
              uploadedImage={null}
              onRemoveImage={null}
            />
          </Card>
          <WatermarkSetting
            type={ctype}
            setType={setCType}
            opacity={opacity}
            setOpacity={setOpacity}
          />
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">Image Processing</TabsTrigger>
              <TabsTrigger value="analysis">Watermark Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageCanvas imageData={null} />
                <ImageCanvas imageData={null} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageCanvas imageData={null} />
                <ImageCanvas imageData={null} />
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              {/* <WatermarkAnalysis
              hasWatermark={analysisResults.hasWatermark}
              confidence={analysisResults.confidence}
              robustness={analysisResults.robustness}
              attacksApplied={attacksApplied}
              detectionResults={analysisResults.detectionResults}
            /> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
