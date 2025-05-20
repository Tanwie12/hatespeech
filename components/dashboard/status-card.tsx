// components/dashboard/status-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils/formatters";
import { StatusCardProps } from "@/types";
import { cn } from "@/lib/utils";

export default function StatusCard({
  title,
  value,
  change,
  changeText,
  progressValue,
  icon,
  variant = "default",
}: StatusCardProps) {
  const getBorderColor = () => {
    switch (variant) {
      case "warning":
        return "border-l-4 border-amber-500";
      case "danger":
        return "border-l-4 border-red-500";
      case "success":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-500";
      case "danger":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className={cn("shadow-sm", getBorderColor())}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-gray-500">{icon}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold">{formatNumber(value)}</div>
        
        {change !== undefined && (
          <div className={`text-xs flex items-center mt-1 ${parseFloat(change.toString()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {changeText}
          </div>
        )}
        
        {progressValue !== undefined && (
          <div className="mt-3">
            <Progress 
              value={progressValue} 
              className={`h-2 ${getProgressColor()}`} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
