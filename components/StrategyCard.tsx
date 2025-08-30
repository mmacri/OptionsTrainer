import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { StrategyVisualizer } from './StrategyVisualizer';
import type { OptionsStrategy, PayoffPoint } from '../lib/strategies';
import type { OptionsData } from './GreeksExplainer';
import {
  getCategoryColor,
  getComplexityColor,
  getRiskColor,
} from '../lib/optionsUtils';

interface StrategyCardProps {
  strategy: OptionsStrategy;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  optionsData: OptionsData;
  generatePayoffData: (strategy: OptionsStrategy) => PayoffPoint[];
}

export const StrategyCard = ({
  strategy,
  isExpanded,
  onToggle,
  optionsData,
  generatePayoffData,
}: StrategyCardProps) => {
  const payoffData = generatePayoffData(strategy);
  const maxPayoff = Math.max(...payoffData.map((p) => p.profitLoss));
  const minPayoff = Math.min(...payoffData.map((p) => p.profitLoss));
  const [selectedTab, setSelectedTab] = useState<'chart' | 'education'>('chart');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader
          onClick={() => onToggle(strategy.id)}
          className="cursor-pointer"
        >
          <CardTitle className="flex items-center gap-2">
            {strategy.title}
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
          <div className="flex gap-1 mt-2">
            <Badge className={getCategoryColor(strategy.category)}>
              {strategy.category}
            </Badge>
            <Badge className={getComplexityColor(strategy.complexity)}>
              {strategy.complexity}
            </Badge>
            <Badge className={getRiskColor(strategy.riskLevel)}>
              {strategy.riskLevel}
            </Badge>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <Tabs
                  value={selectedTab}
                  onValueChange={(v) => setSelectedTab(v as 'chart' | 'education')}
                >
                  <TabsList>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart">
                    <div className="w-full h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={payoffData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="stockPrice"
                            label={{
                              value: 'Stock Price ($)',
                              position: 'insideBottom',
                              offset: -5,
                            }}
                          />
                          <YAxis
                            label={{
                              value: 'Profit/Loss ($)',
                              angle: -90,
                              position: 'insideLeft',
                            }}
                          />
                          <ReferenceArea
                            y1={0}
                            y2={maxPayoff}
                            fill="rgba(34,197,94,0.1)"
                          />
                          <ReferenceArea
                            y1={minPayoff}
                            y2={0}
                            fill="rgba(239,68,68,0.1)"
                          />
                          <Line
                            type="monotone"
                            dataKey="profitLoss"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                          />
                          <ReferenceLine
                            y={0}
                            stroke="#374151"
                            strokeDasharray="2 2"
                            strokeWidth={2}
                          />
                          <ReferenceLine
                            x={optionsData.currentPrice}
                            stroke="#2563eb"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                          />
                          <RechartsTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="p-2 bg-white border rounded text-sm">
                                    <p>Stock: {label}</p>
                                    <p>P/L: {payload[0].value}</p>
                                    <p>
                                      {payload[0].value > 0
                                        ? 'Above the breakeven price the strategy yields a profit'
                                        : 'Below the breakeven price the strategy loses'}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="education">
                    <StrategyVisualizer
                      legs={strategy.legs}
                      optionsData={optionsData}
                    />
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {strategy.whenToUse.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

