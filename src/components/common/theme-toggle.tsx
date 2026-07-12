"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ThemeToggleButton } from "@/components/vendor/theme-toggler-button";

export function ThemeToggle({ ...props }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const icon =
    theme === "system" ? (
      resolvedTheme === "dark" ? (
        <Moon />
      ) : (
        <Sun />
      )
    ) : theme === "dark" ? (
      <Moon />
    ) : (
      <Sun />
    );

  return (
    <div className="flex gap-1">
      <Label htmlFor="themeBtn">{icon}</Label>
      <ThemeToggleButton variant="polygon" className="hidden" />
    </div>
  );
}
