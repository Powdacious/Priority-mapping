"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme based on system preference or stored preference
  useEffect(() => {
    // Default to light mode
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    } else {
      // Ensure light mode is set by default
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  }

  const getThemeLabel = () => {
    return isDarkMode ? "Switch to light mode" : "Switch to dark mode"
  }

  const getThemeDescription = () => {
    return isDarkMode 
      ? "Currently using dark theme. Click to switch to light theme." 
      : "Currently using light theme. Click to switch to dark theme."
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] ${
        isDarkMode
          ? "bg-indigo-900 text-yellow-300 border-yellow-500 hover:bg-indigo-800 hover:text-yellow-200"
          : "bg-amber-100 text-indigo-600 border-amber-300 hover:bg-amber-200 hover:text-indigo-700"
      }`}
      aria-label={getThemeLabel()}
      title={getThemeLabel()}
      role="button"
      tabIndex={0}
      aria-describedby="theme-description"
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? <Moon className="h-5 w-5 transition-all" /> : <Sun className="h-5 w-5 transition-all" />}
      <span id="theme-description" className="sr-only">
        {getThemeDescription()}
      </span>
    </Button>
  )
}

