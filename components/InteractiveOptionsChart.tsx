import React, { Suspense, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TooltipProvider } from "./ui/tooltip";
import ParameterSlider from "./ParameterSlider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronRight, Activity, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
} from "recharts";
import { StrategyVisualizer, StrategyLeg } from "./StrategyVisualizer";
import type { OptionsData } from "./GreeksExplainer";
import { optionsStrategies, OptionsStrategy } from "./strategies";
import {
  quickPresets,
  getCategoryColor,
  getComplexityColor,
  getRiskColor,
  walkthroughSteps,
} from "./config";
const GreeksExplainer = React.lazy(() =>
  import("./GreeksExplainer").then((m) => ({ default: m.GreeksExplainer })),
);

interface PayoffPoint {
  stockPrice: number;
  profitLoss: number;
}
// OptionsStrategy data lives in ./strategies

const safePayoffCalculation = (
  s: number,
  strategy: OptionsStrategy,
  o: OptionsData,
) => {
  try {
    return strategy.calculatePayoff(s, o);
  } catch (e) {
    console.warn("Payoff calculation error:", e);
    return 0;
  }
};

export const InteractiveOptionsChart = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"chart" | "education">(
    "chart",
  );
  const [optionsData, setOptionsData] = useState<OptionsData>({
    strikePrice: 100,
    currentPrice: 100,
    premium: 5,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  });
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const handlePreset = (p: OptionsData) => setOptionsData(p);
  const generatePayoffData = useMemo(() => {
    return (strategy: OptionsStrategy): PayoffPoint[] => {
      const data: PayoffPoint[] = [];
      const minPrice = Math.max(0, optionsData.strikePrice - 30);
      const maxPrice = optionsData.strikePrice + 30;
      for (let price = minPrice; price <= maxPrice; price += 2) {
        data.push({
          stockPrice: price,
          profitLoss: safePayoffCalculation(price, strategy, optionsData),
        });
      }
      return data;
    };
  }, [optionsData]);

  const sliders = [
    { label: "currentPrice", min: 50, max: 200, step: 1 },
    { label: "strikePrice", min: 50, max: 200, step: 5 },
    { label: "premium", min: 0.5, max: 30, step: 0.25 },
    { label: "daysToExpiry", min: 1, max: 365, step: 1 },
    { label: "impliedVolatility", min: 5, max: 100, step: 1 },
    { label: "interestRate", min: 0, max: 10, step: 0.1 },
    { label: "dividendYield", min: 0, max: 5, step: 0.1 },
  ] as const;

  const StrategyCard = ({ strategy }: { strategy: OptionsStrategy }) => {
    const isExpanded = expandedStrategy === strategy.id;
    const payoffData = generatePayoffData(strategy);
    const maxPayoff = Math.max(...payoffData.map((p) => p.profitLoss));
    const minPayoff = Math.min(...payoffData.map((p) => p.profitLoss));
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader
            onClick={() => setExpandedStrategy(isExpanded ? null : strategy.id)}
            className="cursor-pointer"
          >
            <CardTitle className="flex items-center gap-2">
              {strategy.title}
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                aria-hidden="true"
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
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <CardContent>
                  <Tabs defaultValue={selectedTab}>
                    <TabsList>
                      <div
                        onClick={() => setSelectedTab("chart")}
                        className="contents"
                      >
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                      </div>
                      <div
                        onClick={() => setSelectedTab("education")}
                        className="contents"
                      >
                        <TabsTrigger value="education">Education</TabsTrigger>
                      </div>
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
                                value: "Stock Price ($)",
                                position: "insideBottom",
                                offset: -5,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Profit/Loss ($)",
                                angle: -90,
                                position: "insideLeft",
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
                                  const val = payload[0].value as number;
                                  return (
                                    <div className="p-2 bg-white border rounded text-sm">
                                      <p>Stock: {label}</p>
                                      <p>P/L: {val}</p>
                                      <p>
                                        {val > 0
                                          ? "Above the breakeven price the strategy yields a profit"
                                          : "Below the breakeven price the strategy loses"}
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
                      <StrategyVisualizer legs={strategy.legs} />
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Options Trading Strategies</h1>
        <p className="text-gray-600">
          Explore different options strategies and learn how their payoffs and
          Greeks work.
        </p>
        <Button
          className="mt-4"
          aria-label="start walkthrough"
          onClick={() => {
            setWalkthroughStep(0);
            setShowWalkthrough(true);
            setShowCelebration(false);
          }}
        >
          Start Walkthrough
        </Button>
      </div>
      {showWalkthrough && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>{walkthroughSteps[walkthroughStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                {walkthroughSteps[walkthroughStep].content}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowWalkthrough(false)}
                >
                  Skip
                </Button>
                {walkthroughStep < walkthroughSteps.length - 1 ? (
                  <Button onClick={() => setWalkthroughStep((s) => s + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowWalkthrough(false);
                      setShowCelebration(true);
                    }}
                  >
                    Finish
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <Card className="max-w-sm">
            <CardContent className="p-6 text-center">
              <p className="text-lg mb-4">🎉 You're ready to explore!</p>
              <Button
                onClick={() => {
                  setShowCelebration(false);
                  setWalkthroughStep(0);
                  setShowWalkthrough(true);
                }}
              >
                Replay Tour
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <TooltipProvider>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" aria-hidden="true" />
              Market Parameters & Option Pricing Inputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sliders.map((s) => (
              <ParameterSlider
                key={s.label}
                label={s.label}
                min={s.min}
                max={s.max}
                step={s.step}
                value={optionsData[s.label]}
                onChange={(v) =>
                  setOptionsData((prev: OptionsData) => ({
                    ...prev,
                    [s.label]: v,
                  }))
                }
              />
            ))}
            <div className="flex gap-2 mt-4">
              {Object.entries(quickPresets).map(([k, v]) => (
                <Button key={k} onClick={() => handlePreset(v as OptionsData)}>
                  {k}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" aria-hidden="true" />
            Options Greeks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading Greeks...</div>}>
            <GreeksExplainer optionsData={optionsData} />
          </Suspense>
        </CardContent>
      </Card>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {optionsStrategies.map((s) => (
          <StrategyCard key={s.id} strategy={s} />
        ))}
      </div>
    </div>
  );
};
