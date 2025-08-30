import React from "react";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

/**
 * Visualises the individual legs of an options strategy.
 * Each leg shows the action, instrument type and optional
 * strike/premium values. A summary of the net premium paid
 * or received is also displayed.
 */

export interface StrategyLeg {
  action: "Buy" | "Sell";
  type: "Call" | "Put" | "Stock";
  strike?: number;
  premium?: number;
}

// Highlight buys in green and sells in red for quick scanning.
const getActionColor = (action: string) => {
  return action === "Buy"
    ? "bg-green-100 text-green-800 border-green-300"
    : "bg-red-100 text-red-800 border-red-300";
};

// Map leg types to icons for a quick visual cue.
const getTypeIcon = (type: string) => {
  return type === "Call" ? (
    <TrendingUp className="w-3 h-3" aria-hidden="true" />
  ) : type === "Put" ? (
    <TrendingDown className="w-3 h-3" aria-hidden="true" />
  ) : (
    <DollarSign className="w-3 h-3" aria-hidden="true" />
  );
};

interface StrategyVisualizerProps {
  legs: StrategyLeg[];
}

export const StrategyVisualizer: React.FC<StrategyVisualizerProps> = ({
  legs,
}) => {
  // Positive values imply a credit received; negative implies a debit.
  const netPremium = legs.reduce((sum, leg) => {
    const sign = leg.action === "Buy" ? -1 : 1;
    return sum + (leg.premium ?? 0) * sign;
  }, 0);

  return (
    <div className="space-y-2">
      {legs.map((leg, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 border px-2 py-1 rounded text-sm ${getActionColor(
            leg.action,
          )}`}
        >
          {getTypeIcon(leg.type)}
          <span>{`${leg.action} ${leg.type}`}</span>
          {leg.strike && <Badge variant="outline">Strike: {leg.strike}</Badge>}
          {leg.premium && <Badge variant="outline">Prem: {leg.premium}</Badge>}
        </div>
      ))}
      <div className="text-sm">Net Premium: {netPremium}</div>
    </div>
  );
};
