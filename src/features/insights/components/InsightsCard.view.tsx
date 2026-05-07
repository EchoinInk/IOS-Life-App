import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { IntelligentEmptyState } from "@/components/ui/IntelligentEmptyState";
import { Lightbulb, TrendingUp, Target, Zap } from "lucide-react";

export interface InsightsCardViewModel {
  insights: Array<{
    id: string;
    type: "achievement" | "encouragement" | "warning" | "tip";
    message: string;
    priority: "high" | "medium" | "low";
  }>;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case "achievement":
      return <TrendingUp size={15} className="text-success" />;
    case "encouragement":
      return <Zap size={15} className="text-info" />;
    case "warning":
      return <Target size={15} className="text-warning" />;
    case "tip":
      return <Lightbulb size={15} className="text-accent" />;
    default:
      return <Lightbulb size={15} className="text-muted" />;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case "achievement":
      return "bg-success/10 border-success/20 hover:bg-success/15 dark:bg-success/5 dark:border-success/15";
    case "encouragement":
      return "bg-info/10 border-info/20 hover:bg-info/15 dark:bg-info/5 dark:border-info/15";
    case "warning":
      return "bg-warning/10 border-warning/20 hover:bg-warning/15 dark:bg-warning/5 dark:border-warning/15";
    case "tip":
      return "bg-accent/10 border-accent/20 hover:bg-accent/15 dark:bg-accent/5 dark:border-accent/15";
    default:
      return "bg-muted/50 border-muted hover:bg-muted/60 dark:bg-muted/10 dark:border-muted/50";
  }
};

export const InsightsCardView = ({ model }: { model: InsightsCardViewModel }) => {
  const { insights } = model;

  if (insights.length === 0) {
    return (
      <IntelligentEmptyState
        context="insights"
        isFirstTime={true}
        showMomentum={true}
        momentumScore={0}
        className="p-3.5"
      />
    );
  }

  return (
    <Card className="p-3.5">
      <div className="space-y-2.5">
        <Text className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Lightbulb size={15} className="text-warning" />
          Insights
        </Text>
        
        <div className="space-y-1.5">
          {insights.slice(0, 2).map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-2 p-2 rounded-lg border ${getInsightColor(
                insight.type
              )} hover:shadow-sm transition-shadow duration-200`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <Text className="text-xs font-medium leading-relaxed text-text-primary flex-1">
                {insight.message}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
