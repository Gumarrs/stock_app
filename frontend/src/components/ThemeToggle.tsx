"use client";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
