import { useEffect, useState } from "react";
import { getStoredTheme, setStoredTheme } from "../utils/session";

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setStoredTheme(theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
  };
}
