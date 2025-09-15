import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { ImageCanvas } from "~/components/ImageCanvas";
import WatermarkCreator from "~/components/WatermarkCreator";
import { Spinner } from '@radix-ui/themes'

export default function Design() {
	return (
		<div className="min-h-screen bg-background dark">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<WatermarkCreator />

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
