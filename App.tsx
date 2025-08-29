import React, { useEffect, useState, Suspense, lazy } from "react";
import "./styles/globals.css";
import LandingPage from "./components/LandingPage";

const InteractiveOptionsChart = lazy(() =>
  import("./components/InteractiveOptionsChart").then((m) => ({
    default: m.InteractiveOptionsChart,
  })),
);

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (showDashboard) {
    return (
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <InteractiveOptionsChart />
      </Suspense>
    );
  }

  return (
    <LandingPage
      onStart={() => setShowDashboard(true)}
      theme={theme}
      onToggleTheme={() =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
      }
    />
  );
}
