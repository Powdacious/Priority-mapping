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

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 ${
        isDarkMode
          ? "bg-indigo-900 text-yellow-300 border-yellow-500 hover:bg-indigo-800 hover:text-yellow-200"
          : "bg-amber-100 text-indigo-600 border-amber-300 hover:bg-amber-200 hover:text-indigo-700"
      }`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Moon className="h-5 w-5 transition-all" /> : <Sun className="h-5 w-5 transition-all" />}
    </Button>
  )
}

