# AI Agent Instructions for Options Trading Strategies Dashboard

This document outlines how to build the **Interactive Options Trading Strategies Dashboard**. Follow all instructions unless directed otherwise.

## Technology Stack
- React 18+ with TypeScript
- Tailwind CSS v4
- motion/react for animations (not framer-motion)
- recharts for charts
- lucide-react for icons
- shadcn/ui components imported from `./components/ui/`

## File Structure
```
/App.tsx
/components/
  InteractiveOptionsChart.tsx  # main dashboard
  StrategyVisualizer.tsx       # strategy breakdown
  GreeksExplainer.tsx          # Greeks education
  figma/ImageWithFallback.tsx  # do not modify
  ui/                          # shadcn/ui components (do not modify)
/styles/globals.css            # Tailwind tokens
/guidelines/Guidelines.md      # development guidelines
```

## Core State
```typescript
const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
const [selectedTab, setSelectedTab] = useState<'chart' | 'education'>('chart');
const [optionsData, setOptionsData] = useState<OptionsData>({
  strikePrice: 100,
  currentPrice: 100,
  premium: 5,
  daysToExpiry: 30,
  impliedVolatility: 25,
  interestRate: 5,
  dividendYield: 2,
});
```

## Strategies
Exactly four strategies must be implemented with these payoff functions and when‑to‑use lists:
- **Long Call** – `max(stockPrice - strikePrice,0) - premium`
- **Long Put** – `max(strikePrice - stockPrice,0) - premium`
- **Covered Call** – stock payoff + short call payoff
- **Protective Put** – stock payoff + long put payoff

Include all descriptive properties (category, complexity, riskLevel, etc.) and legs as shown in the spec.

## Market Parameters
Use sliders with exact ranges:
- Current Price 50‑200 step 1 default 100
- Strike Price 50‑200 step 5 default 100
- Premium 0.5‑30 step 0.25 default 5
- Days to Expiry 1‑365 step 1 default 30
- Implied Volatility 5‑100 step 1 default 25
- Interest Rate 0‑10% step 0.1 default 5
- Dividend Yield 0‑5% step 0.1 default 2

Provide parameter tooltips and quick presets (ATMOption, OTMCall, OTMPut, HighVol).

## Chart Requirements
Use recharts with `ResponsiveContainer`, `LineChart`, reference lines at P/L=0 and current price, and custom tooltip. Shade profit/loss zones and explain axes on hover. Use `useMemo` to generate payoff data from `optionsData`.

## GreeksExplainer
Implement five Greeks (Delta, Gamma, Theta, Vega, Rho) with simplified calculations. Provide tabs: Examples, Key Factors, Trading Tips. Memoize calculations with `useMemo`.

## StrategyVisualizer
Display legs of a strategy using colour coding and icons:
```typescript
interface StrategyLeg {
  action: 'Buy' | 'Sell';
  type: 'Call' | 'Put' | 'Stock';
  strike?: number;
  premium?: number;
}
```
Use `getActionColor`, `getTypeIcon`, and existing badge colour helpers.

## Layout & Animation
Follow the exact hierarchy described in the spec. Animate card expansion with `motion` and `AnimatePresence`.

## Accessibility & Responsiveness
- Provide ARIA labels and keyboard navigation for all interactive elements.
- Strategies grid uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- Chart container: `w-full h-96` on mobile.

## Performance
Memoize payoff data and Greek calculations. Consider debouncing slider input if needed.

## Error Handling
Validate parameters: strikePrice>0, premium>=0, daysToExpiry>0, etc. Wrap payoff in `safePayoffCalculation` with try/catch.

## Walkthrough & Education
Implement guided onboarding with welcome modal, sequential callouts, celebration messages, and ability to skip/replay. Tooltips must have titles and descriptions. Strategy cards include “When to Use” bullet lists verbatim from spec.

## Component Size Limits
- InteractiveOptionsChart.tsx ≤400 lines
- GreeksExplainer.tsx ≤300 lines
- StrategyVisualizer.tsx ≤150 lines

## Coding Standards
- Use TypeScript strict mode
- Do not modify files in `components/ui` or `figma/ImageWithFallback.tsx`
- Use motion/react, not framer-motion
- Keep colour functions and typography from globals.css

This Agent.md serves as the single source of truth for building the dashboard.
