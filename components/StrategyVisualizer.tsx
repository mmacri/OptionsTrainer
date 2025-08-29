import React from 'react';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export interface StrategyLeg {
  action: 'Buy' | 'Sell';
  type: 'Call' | 'Put' | 'Stock';
  strike?: number;
  premium?: number;
}

const getActionColor = (action: string) => {
  return action === 'Buy'
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-red-100 text-red-800 border-red-300';
};

const getTypeIcon = (type: string) => {
  return type === 'Call' ? (
    <TrendingUp className="w-3 h-3" />
  ) : type === 'Put' ? (
    <TrendingDown className="w-3 h-3" />
  ) : (
    <DollarSign className="w-3 h-3" />
  );
};

interface StrategyVisualizerProps {
  legs: StrategyLeg[];
}

export const StrategyVisualizer: React.FC<StrategyVisualizerProps> = ({ legs }) => {
  const netPremium = legs.reduce((sum, leg) => {
    const sign = leg.action === 'Buy' ? -1 : 1;
    return sum + (leg.premium ?? 0) * sign;
  }, 0);

  return (
    <div className="space-y-2">
      {legs.map((leg, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 border px-2 py-1 rounded text-sm ${getActionColor(
            leg.action
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
