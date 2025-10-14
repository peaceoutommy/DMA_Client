import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Target } from "lucide-react";

export default function Campaign({
  id,
  name,
  description,
  fundGoal,
  currentAmount = 0,
  companyName,
  status,
  imageUrl
}) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const progress = Math.min((currentAmount / fundGoal) * 100, 100);
  const isCompleted = status === 'completed' || progress >= 100;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-muted" >
      <div className="flex flex-row">
        {/* Hero Image */}
        <div className="relative w-64 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-muted">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/30" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Target className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Status Badge */}
          {isCompleted && (
            <Badge className="absolute top-3 right-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Funded
            </Badge>
          )}

          {/* Company Badge */}
          {companyName && (
            <Badge
              variant="secondary"
              className="absolute bottom-3 left-3 backdrop-blur-md bg-background/90 shadow-sm text-xs"
            >
              <Building2 className="w-3 h-3 mr-1" />
              {companyName}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold line-clamp-1 leading-tight mb-1">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">{formatCurrency(currentAmount)}</span>
                <span className="font-semibold text-primary tabular-nums">{progress.toFixed(0)}%</span>
              </div>

              <Progress
                value={progress}
                className="h-2"
              />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>of {formatCurrency(fundGoal)} goal</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              className="w-full h-10 font-medium"
              disabled={isCompleted}
            >
              {isCompleted ? "Goal Reached" : "Back This Project"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}