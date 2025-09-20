import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { ImageCanvas } from "~/components/ImageCanvas";
import WatermarkCreator from "~/components/WatermarkCreator";
import { useState } from 'react';
import { WatermarkAnalysis } from '~/components/WatermarkAnalysis';

export default function Design() {
	const [appliedWM, setAppliedWM] = useState<string | null>(null);
	const [watermark, setWatermark] = useState<string | null>(null);

	return (
		<div className="min-h-screen bg-background dark">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<WatermarkCreator
					appliedImg={appliedWM}
					setAppliedImg={setAppliedWM}
					watermark={watermark}
					setWatermark={setWatermark}
				/>

				<div className="lg:col-span-3">
					<Tabs defaultValue="images" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="images">Image Processing</TabsTrigger>
							<TabsTrigger value="analysis">Watermark Analysis</TabsTrigger>
						</TabsList>

						<TabsContent value="images" className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<ImageCanvas imageData={appliedWM} useCanvas={true} />
								<ImageCanvas imageData={watermark} useCanvas={true} />
							</div>
						</TabsContent>

						<TabsContent value="analysis">
							<WatermarkAnalysis
								hasWatermark={false}
								confidence={100}
								robustness={100}
								attacksApplied={[]}
								detectionResults={{
									textDetection: 100,
									frequencyAnalysis: 100,
									correlationScore: 100
								}}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
