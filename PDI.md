# Project Definition & Implementation (PDI)

## Project Overview
**Interactive Options Trading Strategies Dashboard** – an educational app to explore options strategies, visualise profit/loss, and learn the Greeks with guided onboarding.

### Target Audience
- Beginners learning options
- Intermediate traders analysing scenarios
- Educators and students
- Trading enthusiasts

## Technical Architecture
- React 18 + TypeScript
- Tailwind CSS v4
- motion/react animations
- Recharts for payoff charts
- shadcn/ui components
- lucide-react icons

## Project Structure
```
App.tsx
components/
  InteractiveOptionsChart.tsx
  StrategyVisualizer.tsx
  GreeksExplainer.tsx
  figma/ImageWithFallback.tsx
  ui/* (from shadcn, unmodified)
styles/globals.css
Guidelines.md
Agent.md
```

## Core Features
1. **Interactive Options Strategies Dashboard** – supports Long Call, Long Put, Covered Call, Protective Put with expandable cards, badges for category/complexity/risk, and leg breakdown via StrategyVisualizer.
2. **Market Parameters Panel** – sliders for stock price, strike, premium, days to expiry, implied volatility, interest rate, dividend yield; includes tooltips and quick presets.
3. **Profit/Loss Visualisation** – responsive Recharts line chart with reference lines, breakeven marker, shaded profit/loss zones, and explanatory tooltips.
4. **Options Greeks Education** – GreeksExplainer calculates Delta, Gamma, Theta, Vega, Rho and provides Examples, Key Factors, Trading Tips tabs.
5. **Guided Walkthrough** – first‑time tour with welcome modal, sequential callouts, celebration messages, and replay option.

## User Flow
1. Load dashboard with defaults and optional walkthrough.
2. Adjust parameters; payoffs and Greeks update instantly.
3. Expand strategies to view chart or education tab.
4. Explore Greeks and tooltips for deeper understanding.

## Accessibility & Performance
- ARIA labels and keyboard navigation throughout.
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- Memoization via `useMemo` for payoff data and Greeks; consider debouncing slider changes.

## Future Enhancements
- Additional strategies and Greeks
- Live market data and portfolio features
- Historical analysis and paper trading

This PDI summarises the requirements for implementing the dashboard.
