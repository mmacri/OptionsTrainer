import React from "react";

interface LandingPageProps {
  onStart: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Options Trainer</h1>
        <button
          onClick={onToggleTheme}
          aria-label="toggle theme"
          className="px-2 py-1 border rounded"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-semibold mb-4">
          Master Options Strategies
        </h2>
        <p className="mb-6 max-w-xl">
          Interactive tools to visualize payoffs and understand Greeks before
          you trade.
        </p>
        <ul className="mb-6 space-y-2">
          <li>Visualize payoff diagrams</li>
          <li>Learn options Greeks with examples</li>
          <li>Apply quick market presets</li>
        </ul>
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-6 py-2 rounded"
          aria-label="launch dashboard"
        >
          Launch Dashboard
        </button>
      </main>
      <footer className="p-4 text-center text-sm">
        <p>© 2024 Options Trainer. For educational purposes only.</p>
        <nav className="mt-2">
          <a href="#docs" className="underline mx-2">
            Documentation
          </a>
          <a href="#disclaimer" className="underline mx-2">
            Disclaimer
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
