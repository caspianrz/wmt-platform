import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Label } from "./ui/Label";
import { Slider } from "./ui/Slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/Select";
import { RotateCcw } from "lucide-react";

interface AttackControlsProps {
	setAttackType : (attack : string) => void;
	noiseLevel: number;
	setNoiseLevel: (level: number) => void;
	/*
	blurStrength: number;
	setBlurStrength: (strength: number) => void;
	compressionQuality: number;
	setCompressionQuality: (quality: number) => void;
	rotationAngle: number;
	setRotationAngle: (angle: number) => void;
	onResetImage: () => void;
	disabled: boolean;
	*/
}

export function AttackControls({
	setAttackType,
	noiseLevel,
	setNoiseLevel,
	/* blurStrength,
	setBlurStrength,
	compressionQuality,
	setCompressionQuality,
	rotationAngle,
	setRotationAngle,
	onResetImage,
	disabled,
	*/
}: AttackControlsProps) {
	return (
		<Card className="p-6">
			<h3 className="mb-4">Attack Simulation</h3>

			<div className="space-y-4">
				<div>
					<Label>Noise Level: {noiseLevel}%</Label>
					<Slider
						min={0}
						max={50}
						step={1}
						value={[noiseLevel]}
						onValueChange={(value) => setNoiseLevel(value[0])}
						className="mt-2"
					/>
					<Button
						onClick={() => setAttackType("gaussian_noise")}
						variant="outline"
						size="sm"
						className="mt-2 w-full"
					>
						Apply Noise
					</Button>
				</div>

				{/*
				<div>
					<Label>Blur Strength: {blurStrength}px</Label>
					<Slider
						min={0}
						max={10}
						step={0.5}
						value={[blurStrength]}
						onValueChange={(value) => setBlurStrength(value[0])}
						className="mt-2"
					/>
					<Button
						onClick={() => onApplyAttack("blur")}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="mt-2 w-full"
					>
						Apply Blur
					</Button>
				</div>

				<div>
					<Label>JPEG Quality: {compressionQuality}%</Label>
					<Slider
						min={10}
						max={100}
						step={5}
						value={[compressionQuality]}
						onValueChange={(value) => setCompressionQuality(value[0])}
						className="mt-2"
					/>
					<Button
						onClick={() => onApplyAttack("compression")}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="mt-2 w-full"
					>
						Apply Compression
					</Button>
				</div>

				<div>
					<Label>Rotation: {rotationAngle}°</Label>
					<Slider
						min={-45}
						max={45}
						step={1}
						value={[rotationAngle]}
						onValueChange={(value) => setRotationAngle(value[0])}
						className="mt-2"
					/>
					<Button
						onClick={() => onApplyAttack("rotation")}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="mt-2 w-full"
					>
						Apply Rotation
					</Button>
				</div>

				<div className="pt-4 border-t border-border">
					<Button
						onClick={() => onApplyAttack("crop")}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="w-full mb-2"
					>
						Apply Random Crop
					</Button>

					<Button
						onClick={() => onApplyAttack("resize")}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="w-full mb-2"
					>
						Resize (50% → 100%)
					</Button>

					<Button
						onClick={onResetImage}
						disabled={disabled}
						variant="secondary"
						size="sm"
						className="w-full"
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Reset to Watermarked
					</Button>
				</div>

			*/}
			</div>
		</Card>
	);
}
