import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Progress } from "./ui/Progress";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface WatermarkAnalysisProps {
  hasWatermark: boolean;
  confidence: number;
  robustness: number;
  attacksApplied: string[];
  detectionResults: {
    textDetection: number;
    frequencyAnalysis: number;
    correlationScore: number;
  };
}

export function WatermarkAnalysis({
  hasWatermark,
  confidence,
  robustness,
  attacksApplied,
  detectionResults,
}: WatermarkAnalysisProps) {
  const getStatusIcon = () => {
    if (confidence > 80)
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (confidence > 50)
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (confidence > 80) return "bg-green-500";
    if (confidence > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRobustnessLevel = () => {
    if (robustness > 80) return { level: "High", color: "bg-green-500" };
    if (robustness > 60) return { level: "Medium", color: "bg-yellow-500" };
    if (robustness > 40) return { level: "Low", color: "bg-orange-500" };
    return { level: "Very Low", color: "bg-red-500" };
  };

  const robustnessInfo = getRobustnessLevel();

  return (
    <Card className="p-6">
      <h3 className="mb-4">Watermark Analysis</h3>

      <div className="space-y-4">
        {/* Detection Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Watermark Detection</span>
          </div>
          <Badge variant={hasWatermark ? "default" : "secondary"}>
            {hasWatermark ? "Detected" : "Not Detected"}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Detection Confidence</Label>
            <span className="text-sm">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>

        {/* Robustness Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Robustness Level</Label>
            <Badge
              variant="outline"
              className={`${robustnessInfo.color} text-white border-transparent`}
            >
              {robustnessInfo.level}
            </Badge>
          </div>
          <Progress value={robustness} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {robustness}% - Ability to survive attacks
          </p>
        </div>

        {/* Detection Methods */}
        <div>
          <Label className="mb-2 block">Detection Analysis</Label>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Text Recognition:</span>
              <span>{detectionResults.textDetection}%</span>
            </div>
            <div className="flex justify-between">
              <span>Frequency Analysis:</span>
              <span>{detectionResults.frequencyAnalysis}%</span>
            </div>
            <div className="flex justify-between">
              <span>Correlation Score:</span>
              <span>{detectionResults.correlationScore}%</span>
            </div>
          </div>
        </div>

        {/* Applied Attacks */}
        {attacksApplied.length > 0 && (
          <div>
            <Label className="mb-2 block">Applied Attacks</Label>
            <div className="flex flex-wrap gap-1">
              {attacksApplied.map((attack, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {attack}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="pt-3 border-t border-border">
          <Label className="mb-2 block">Recommendations</Label>
          <div className="text-xs text-muted-foreground space-y-1">
            {confidence < 50 && (
              <p>
                • Consider increasing watermark opacity or using a different
                position
              </p>
            )}
            {robustness < 60 && (
              <p>
                • Watermark may be vulnerable to attacks - consider invisible
                embedding
              </p>
            )}
            {attacksApplied.includes("compression") && robustness > 70 && (
              <p>• Good resistance to JPEG compression detected</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Label({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
}
