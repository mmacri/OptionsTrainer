import type { OptionsData } from "./GreeksExplainer";

export const quickPresets: Record<string, OptionsData> = {
  ATMOption: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 3,
    daysToExpiry: 30,
    impliedVolatility: 20,
    interestRate: 5,
    dividendYield: 2,
  },
  OTMCall: {
    strikePrice: 105,
    currentPrice: 100,
    premium: 2,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  },
  OTMPut: {
    strikePrice: 95,
    currentPrice: 100,
    premium: 2,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  },
  HighVol: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 8,
    daysToExpiry: 7,
    impliedVolatility: 50,
    interestRate: 5,
    dividendYield: 1,
  },
};

export const parameterTooltips: Record<
  keyof OptionsData,
  { title: string; content: string }
> = {
  currentPrice: {
    title: "Current Stock Price (S)",
    content:
      "The current market price of the underlying stock. This determines option moneyness.",
  },
  strikePrice: {
    title: "Strike Price (K)",
    content: "The exercise price of the option contract.",
  },
  premium: {
    title: "Option Premium",
    content:
      "The price paid for the option contract. For short strategies this is the credit received.",
  },
  daysToExpiry: {
    title: "Days to Expiry (T)",
    content:
      "Number of days until the option expires. Shorter durations increase time decay (Theta).",
  },
  impliedVolatility: {
    title: "Implied Volatility (IV)",
    content:
      "Expected volatility of the underlying over the life of the option. Higher IV increases option premiums.",
  },
  interestRate: {
    title: "Risk-free Interest Rate (r)",
    content:
      "Annualized interest rate used in option pricing models. Higher rates generally raise call values and lower put values.",
  },
  dividendYield: {
    title: "Dividend Yield (q)",
    content:
      "Expected annual dividend yield of the underlying stock. Dividends decrease call values and increase put values.",
  },
};

export const getCategoryColor = (c: string) =>
  c === "Bullish"
    ? "bg-green-50 text-green-700 border-green-200"
    : c === "Bearish"
      ? "bg-red-50 text-red-700 border-red-200"
      : c === "Neutral"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-purple-50 text-purple-700 border-purple-200";

export const getComplexityColor = (c: string) =>
  c === "Basic"
    ? "bg-green-50 text-green-700 border-green-200"
    : c === "Intermediate"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : c === "Advanced"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-gray-50 text-gray-700 border-gray-200";

export const getRiskColor = (r: string) =>
  r === "Low"
    ? "bg-green-50 text-green-700 border-green-200"
    : r === "Medium"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : r === "High"
        ? "bg-orange-50 text-orange-700 border-orange-200"
        : r === "Unlimited"
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-gray-50 text-gray-700 border-gray-200";

export const walkthroughSteps = [
  {
    title: "Welcome",
    content: "This tour will guide you through the dashboard.",
  },
  {
    title: "Parameters",
    content: "Use these sliders to set market conditions and option inputs.",
  },
  {
    title: "Strategies",
    content:
      "Expand a strategy card to view its payoff chart or educational tips.",
  },
  {
    title: "Greeks",
    content: "Learn how the Greeks measure option sensitivity.",
  },
];
