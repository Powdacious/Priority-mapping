"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Meh,
  ThumbsUp,
  Smile,
  Star,
  Award,
  Feather,
  PenToolIcon as Tool,
  Wrench,
  Hammer,
  Cog,
  Plus,
  X,
  Download,
  Grid,
  BarChart3,
  InfoIcon,
  Share2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

// Define the feature type
interface Feature {
  id: string
  name: string
  value: number // 1-5 (Meh to Amazing)
  cost: number // 1-5 (Easy to Extreme)
}

// Value and cost options with their corresponding icons
const valueOptions = [
  { value: 5, label: "Amazing", icon: Award, description: "Users are delighted" },
  { value: 4, label: "Great", icon: Star, description: "Users are enthusiastic" },
  { value: 3, label: "Good", icon: Smile, description: "Users are clearly satisfied" },
  { value: 2, label: "OK", icon: ThumbsUp, description: "Users are mildly satisfied" },
  { value: 1, label: "Meh", icon: Meh, description: "Users are indifferent" },
]

const costOptions = [
  { value: 5, label: "Extreme", icon: Cog, description: "Highly complex and resource-intensive" },
  { value: 4, label: "Difficult", icon: Hammer, description: "Complex implementation" },
  { value: 3, label: "Challenging", icon: Wrench, description: "Requires significant effort" },
  { value: 2, label: "Doable", icon: Tool, description: "Straightforward work" },
  { value: 1, label: "Easy", icon: Feather, description: "Simple implementation" },
]

// Get background color and rank based on position in the matrix
const getBackgroundColorAndRank = (value: number, cost: number): { color: string; rank: number } => {
  const colorAndRankMap = {
    // value = Meh (1)
    "1-5": { color: "bg-red-700 hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-950", rank: 8 }, // dark red
    "1-4": { color: "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800", rank: 7 }, // medium red
    "1-3": { color: "bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600", rank: 6 }, // light red
    "1-2": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "1-1": { color: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700", rank: 5 }, // medium blue

    // value = OK (2)
    "2-5": { color: "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800", rank: 7 }, // medium red
    "2-4": { color: "bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600", rank: 6 }, // light red
    "2-3": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "2-2": { color: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700", rank: 5 }, // medium blue
    "2-1": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue

    // value = Good (3)
    "3-5": { color: "bg-red-300 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600", rank: 6 }, // light red
    "3-4": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "3-3": { color: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700", rank: 5 }, // medium blue
    "3-2": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "3-1": { color: "bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-800", rank: 2 }, // light green

    // value = Great (4)
    "4-5": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "4-4": { color: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700", rank: 5 }, // medium blue
    "4-3": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "4-2": { color: "bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-800", rank: 2 }, // light green
    "4-1": { color: "bg-green-400 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700", rank: 2 }, // medium green

    // value = Amazing (5)
    "5-5": { color: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700", rank: 5 }, // medium blue
    "5-4": { color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800", rank: 4 }, // light blue
    "5-3": { color: "bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-800", rank: 2 }, // light green
    "5-2": { color: "bg-green-400 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700", rank: 2 }, // medium green
    "5-1": { color: "bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900", rank: 1 }, // dark green
  }

  const key = `${value}-${cost}` as keyof typeof colorAndRankMap
  return (
    colorAndRankMap[key] || { color: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700", rank: 0 }
  )
}

export default function FeaturePriorityMatrix() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [newValue, setNewValue] = useState<number | null>(null)
  const [newCost, setNewCost] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("matrix")
  const [shareUrl, setShareUrl] = useState("")

  const matrixRef = useRef<HTMLDivElement>(null)
  const affinityRef = useRef<HTMLDivElement>(null)
  const stackedRankRef = useRef<HTMLDivElement>(null)
  const featureNameInputRef = useRef<HTMLInputElement>(null)
  const valueSelectRef = useRef<HTMLButtonElement>(null)
  const costSelectRef = useRef<HTMLButtonElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  const { toast } = useToast()

  // Focus feature name input when component mounts
  useEffect(() => {
    if (featureNameInputRef.current) {
      featureNameInputRef.current.focus()
    }
  }, [])

  const addFeature = () => {
    if (!newFeature.trim()) {
      setError("Please enter a feature name")
      return
    }

    if (newValue === null) {
      setError("Please select a value")
      return
    }

    if (newCost === null) {
      setError("Please select a cost")
      return
    }

    if (features.length >= 12) {
      setError("Maximum of 12 features allowed")
      return
    }

    const feature: Feature = {
      id: Date.now().toString(),
      name: newFeature,
      value: newValue,
      cost: newCost,
    }

    setFeatures([...features, feature])
    setNewFeature("")
    // We're not resetting newValue and newCost here, allowing repeated selections
    setError(null)

    // Return focus to feature name input for smooth workflow
    if (featureNameInputRef.current) {
      featureNameInputRef.current.focus()
    }
  }

  const removeFeature = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id))
  }

  // Sort features by rank
  const sortedFeatures = [...features].sort((a, b) => {
    const rankA = getBackgroundColorAndRank(a.value, a.cost).rank
    const rankB = getBackgroundColorAndRank(b.value, b.cost).rank
    return rankA - rankB
  })

  const exportAsImage = async () => {
    setIsExporting(true)

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default

      // Create a container for all views
      const container = document.createElement("div")
      container.style.backgroundColor = document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff"
      container.style.padding = "20px"
      container.style.width = "1000px"

      // Add title
      const title = document.createElement("h1")
      title.textContent = "Feature Priority Visualizations"
      title.style.textAlign = "center"
      title.style.marginBottom = "20px"
      title.style.fontSize = "24px"
      title.style.fontWeight = "bold"
      title.style.color = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"
      container.appendChild(title)

      // Temporarily switch to each tab to capture it
      const originalTab = activeTab

      // Capture Matrix View
      setActiveTab("matrix")
      await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for render
      if (matrixRef.current) {
        const matrixCanvas = await html2canvas(matrixRef.current, {
          backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
        })

        const matrixTitle = document.createElement("h2")
        matrixTitle.textContent = "Matrix View"
        matrixTitle.style.marginTop = "30px"
        matrixTitle.style.marginBottom = "10px"
        matrixTitle.style.fontSize = "18px"
        matrixTitle.style.fontWeight = "bold"
        matrixTitle.style.color = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"
        container.appendChild(matrixTitle)

        const matrixImg = document.createElement("img")
        matrixImg.src = matrixCanvas.toDataURL()
        matrixImg.style.width = "100%"
        matrixImg.style.marginBottom = "30px"
        container.appendChild(matrixImg)
      }

      // Capture Affinity View
      setActiveTab("affinity")
      await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for render
      if (affinityRef.current) {
        const affinityCanvas = await html2canvas(affinityRef.current, {
          backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
        })

        const affinityTitle = document.createElement("h2")
        affinityTitle.textContent = "Affinity View"
        affinityTitle.style.marginTop = "30px"
        affinityTitle.style.marginBottom = "10px"
        affinityTitle.style.fontSize = "18px"
        affinityTitle.style.fontWeight = "bold"
        affinityTitle.style.color = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"
        container.appendChild(affinityTitle)

        const affinityImg = document.createElement("img")
        affinityImg.src = affinityCanvas.toDataURL()
        affinityImg.style.width = "100%"
        affinityImg.style.marginBottom = "30px"
        container.appendChild(affinityImg)
      }

      // Capture Stacked Rank View
      setActiveTab("stacked")
      await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for render
      if (stackedRankRef.current) {
        const stackedCanvas = await html2canvas(stackedRankRef.current, {
          backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
        })

        const stackedTitle = document.createElement("h2")
        stackedTitle.textContent = "Stacked Rank View"
        stackedTitle.style.marginTop = "30px"
        stackedTitle.style.marginBottom = "10px"
        stackedTitle.style.fontSize = "18px"
        stackedTitle.style.fontWeight = "bold"
        stackedTitle.style.color = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000"
        container.appendChild(stackedTitle)

        const stackedImg = document.createElement("img")
        stackedImg.src = stackedCanvas.toDataURL()
        stackedImg.style.width = "100%"
        container.appendChild(stackedImg)
      }

      // Restore original tab
      setActiveTab(originalTab)

      // Append container to document temporarily
      document.body.appendChild(container)

      // Capture the entire container
      const finalCanvas = await html2canvas(container, {
        backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      })

      // Remove container
      document.body.removeChild(container)

      // Convert to blob and download
      finalCanvas.toBlob((blob) => {
        if (!blob) {
          toast({
            title: "Export failed",
            description: "Could not generate image",
            variant: "destructive",
          })
          return
        }

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `feature-priority-visualizations-${new Date().toISOString().split("T")[0]}.png`
        link.href = url
        link.click()

        // Clean up
        URL.revokeObjectURL(url)

        toast({
          title: "Export successful",
          description: "Your visualizations have been downloaded as an image",
        })
      }, "image/png")
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the image",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Update feature value
  const updateFeatureValue = (featureId: string, newValue: number) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, value: newValue } : feature)),
    )
  }

  // Update feature cost
  const updateFeatureCost = (featureId: string, newCost: number) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, cost: newCost } : feature)),
    )
  }

  // Handle key press in feature name input
  const handleFeatureNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (valueSelectRef.current) {
        valueSelectRef.current.click()
      }
    }
  }

  // Handle value selection
  const handleValueChange = (value: string) => {
    setNewValue(Number(value))
    // Focus cost select after value is selected
    setTimeout(() => {
      if (costSelectRef.current) {
        costSelectRef.current.click()
      }
    }, 100)
  }

  // Handle cost selection
  const handleCostChange = (value: string) => {
    setNewCost(Number(value))
    // Focus add button after cost is selected
    setTimeout(() => {
      if (addButtonRef.current) {
        addButtonRef.current.focus()
      }
    }, 100)
  }

  // Share functionality
  const shareApp = () => {
    // Get the current URL
    const url = window.location.href

    // Check if the Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: "Feature Priority Mapping",
          text: "Check out this feature priority mapping tool!",
          url: url,
        })
        .then(() => {
          toast({
            title: "Shared successfully",
            description: "The link has been shared",
          })
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          // Fallback to copy to clipboard
          copyToClipboard(url)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(url)
    }
  }

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShareUrl(text)
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it",
        })
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error)
        toast({
          title: "Failed to copy link",
          description: "Please try again",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Form */}
      <Card className="lg:col-span-1">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/30 rounded-t-lg">
          <CardTitle>Add Feature</CardTitle>
          <CardDescription>Enter feature details and rate its value to users and cost to build</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-name">Feature Name</Label>
              <Input
                id="feature-name"
                placeholder="Enter feature name"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleFeatureNameKeyDown}
                ref={featureNameInputRef}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value-select">Value to User (How will users react?)</Label>
              <Select value={newValue?.toString()} onValueChange={handleValueChange}>
                <SelectTrigger id="value-select" ref={valueSelectRef}>
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {valueOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComponent = option.icon;
                          return <IconComponent className="h-4 w-4" />;
                        })()}
                        <span>
                          {option.label} - {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-select">Cost to Build (How difficult is implementation?)</Label>
              <Select value={newCost?.toString()} onValueChange={handleCostChange}>
                <SelectTrigger id="cost-select" ref={costSelectRef}>
                  <SelectValue placeholder="Select cost" />
                </SelectTrigger>
                <SelectContent>
                  {costOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComponent = option.icon;
                          return <IconComponent className="h-4 w-4" />;
                        })()}
                        <span>
                          {option.label} - {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={addFeature} className="w-full" ref={addButtonRef}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature ({features.length}/12)
          </Button>
        </CardContent>
      </Card>

      {/* Matrix and Affinity Views */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Feature Priority Visualization</CardTitle>
            <CardDescription>Visualize and compare features based on value and cost</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareApp}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportAsImage}
              disabled={isExporting || features.length === 0}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export as Image"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="matrix" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Matrix View
              </TabsTrigger>
              <TabsTrigger value="affinity" className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="14" y2="12"></line>
                  <line x1="4" y1="18" x2="18" y2="18"></line>
                  <circle cx="16" cy="6" r="2"></circle>
                  <circle cx="8" cy="12" r="2"></circle>
                  <circle cx="20" cy="18" r="2"></circle>
                </svg>
                Affinity View
              </TabsTrigger>
              <TabsTrigger value="stacked" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Stacked Rank
              </TabsTrigger>
            </TabsList>

            {/* Matrix View */}
            <TabsContent value="matrix">
              <div className="relative" ref={matrixRef}>
                {/* Matrix Headers */}
                <div className="flex mb-2">
                  <div className="w-1/6"></div>
                  <div className="w-5/6 flex justify-between px-2">
                    {costOptions.map((option) => (
                      <div key={option.value} className="text-center flex flex-col items-center">
                        {(() => {
                          const IconComponent = option.icon;
                          return <IconComponent className="h-6 w-6" />;
                        })()}
                        <span className="text-xs whitespace-nowrap">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex">
                  {/* Y-axis Labels */}
                  <div className="w-1/6 flex flex-col justify-between items-center">
                    {valueOptions.map((option) => (
                      <div key={option.value} className="text-center flex flex-col items-center">
                        {(() => {
                          const IconComponent = option.icon;
                          return <IconComponent className="h-6 w-6" />;
                        })()}
                        <span className="text-xs whitespace-nowrap">{option.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Matrix Grid */}
                  <div className="w-5/6 relative pb-[100%]">
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 border border-gray-200 dark:border-gray-700">
                      {Array.from({ length: 25 }).map((_, index) => {
                        const row = Math.floor(index / 5)
                        const col = index % 5
                        const value = 5 - row
                        const cost = 5 - col
                        const cellFeatures = features.filter((f) => f.value === value && f.cost === cost)
                        const { color } = getBackgroundColorAndRank(value, cost)

                        return (
                          <div
                            key={index}
                            className={`border border-gray-200 dark:border-gray-700 p-1 ${color} relative`}
                          >
                            {cellFeatures.map((feature) => (
                              <div key={feature.id} className="group relative">
                                <Badge
                                  className={`m-0.5 cursor-pointer flex items-center gap-1 max-w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white ${
                                    feature.name.length > 15 ? 'h-auto min-h-[1.5rem] max-h-[3rem] items-start pt-1' : ''
                                  }`}
                                  variant="secondary"
                                >
                                  <span className={`${feature.name.length > 15 ? 'line-clamp-2' : 'truncate'}`}>{feature.name}</span>
                                  <button
                                    onClick={() => removeFeature(feature.id)}
                                    className="text-xs opacity-60 hover:opacity-100 mt-0.5 ml-1 flex-shrink-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                                <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 shadow-lg min-w-[150px] max-w-[250px] -mt-1 left-0">
                                  <div className="font-medium break-words">{feature.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <span>Value: {valueOptions.find((o) => o.value === feature.value)?.label}</span>
                                    <span>•</span>
                                    <span>Cost: {costOptions.find((o) => o.value === feature.cost)?.label}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Axis Labels */}
                <div className="absolute -rotate-90 origin-center left-[-80px] top-1/2 text-sm font-medium w-40 text-center">
                  Value to User
                </div>
                <div className="text-center text-sm font-medium mt-2">Cost to Build</div>

                {/* Quadrant Labels */}
                <div
                  className="absolute top-[10%] right-[10%] text-white font-extrabold rotate-12 text-xl md:text-2xl"
                  style={{ textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                >
                  Build this stuff
                </div>
                <div
                  className="absolute bottom-[10%] left-[10%] text-white font-extrabold rotate-12 text-xl md:text-2xl"
                  style={{ textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                >
                  Don&apos;t build it!
                </div>
              </div>
            </TabsContent>

            {/* Affinity View */}
            <TabsContent value="affinity">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium">
                  <span className="italic font-bold bg-gradient-to-r from-gray-200 via-amber-100 to-green-200 dark:from-gray-800 dark:via-amber-950/70 dark:to-green-900/70 px-2 py-1 rounded mr-2">
                    Interactive
                  </span>
                  Compare and Adjust Feature Ratings
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <InfoIcon className="h-4 w-4" />
                        <span className="sr-only">Information</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Compare features by adjusting their position on these sliders. Move the sliders left or right to change the value or cost rating for each feature.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div ref={affinityRef} className="space-y-8">
                {features.length > 0 ? (
                  features.map((feature) => (
                    <div key={feature.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-medium text-lg">{feature.name}</div>
                        <Button variant="ghost" size="sm" onClick={() => removeFeature(feature.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Value Slider */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Value to User</Label>
                          <div className="flex items-center">
                            {(() => {
                              const IconComponent = valueOptions.find(o => o.value === feature.value)?.icon;
                              return IconComponent && <IconComponent className="h-4 w-4 mr-1" />;
                            })()}
                            <span className="text-sm">{valueOptions.find(o => o.value === feature.value)?.label}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="h-8 bg-gradient-to-r from-gray-200 via-amber-100 to-green-200 dark:from-gray-800 dark:via-amber-950/70 dark:to-green-900/70 rounded-md overflow-hidden">
                            <Slider
                              value={[feature.value]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) => updateFeatureValue(feature.id, value[0])}
                              className="py-1"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                            {valueOptions.slice().reverse().map((option) => (
                              <div key={option.value} className="flex flex-col items-center">
                                {(() => {
                                  const IconComponent = option.icon;
                                  return <IconComponent className="h-3 w-3" />;
                                })()}
                                <span>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Cost Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Cost to Build</Label>
                          <div className="flex items-center">
                            {(() => {
                              const IconComponent = costOptions.find(o => o.value === feature.cost)?.icon;
                              return IconComponent && <IconComponent className="h-4 w-4 mr-1" />;
                            })()}
                            <span className="text-sm">{costOptions.find(o => o.value === feature.cost)?.label}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="h-8 bg-gradient-to-r from-green-200 via-blue-100 to-red-200 dark:from-green-900/70 dark:via-blue-950/70 dark:to-red-900/70 rounded-md overflow-hidden">
                            <Slider
                              value={[feature.cost]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) => updateFeatureCost(feature.id, value[0])}
                              className="py-1"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                            {costOptions.slice().reverse().map((option) => (
                              <div key={option.value} className="flex flex-col items-center">
                                {(() => {
                                  const IconComponent = option.icon;
                                  return <IconComponent className="h-3 w-3" />;
                                })()}
                                <span>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Add features to compare them on the affinity sliders
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Stacked Rank View */}
            <TabsContent value="stacked">
              <div ref={stackedRankRef}>
                {features.length > 0 ? (
                  <div className="space-y-4">
                    {sortedFeatures.map((feature) => {
                      const valueOption = valueOptions.find((o) => o.value === feature.value)
                      const costOption = costOptions.find((o) => o.value === feature.cost)
                      const { color, rank } = getBackgroundColorAndRank(feature.value, feature.cost)

                      return (
                        <div key={feature.id} className={`${color} border rounded-lg p-4 flex items-center justify-between`}>
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="mt-1 text-sm">
                              <span className="text-muted-foreground">Value: </span>
                              {valueOption && (
                                <span className="flex items-center gap-1 inline-flex">
                                  {(() => {
                                    const IconComponent = valueOption.icon;
                                    return <IconComponent className="h-4 w-4" />;
                                  })()}
                                  {valueOption.label}
                                </span>
                              )}
                              <span className="text-muted-foreground ml-2">Cost: </span>
                              {costOption && (
                                <span className="flex items-center gap-1 inline-flex">
                                  {(() => {
                                    const IconComponent = costOption.icon;
                                    return <IconComponent className="h-4 w-4" />;
                                  })()}
                                  {costOption.label}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Rank: {rank}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeFeature(feature.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Add features to see them ranked by priority
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

