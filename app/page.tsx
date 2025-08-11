import FeaturePriorityMatrix from "@/components/feature-priority-matrix"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Feature Priority Mapping</h1>
          <ThemeToggle />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Who is this for?</h2>
          <p className="mb-2">
            This tool is primarily designed for <strong>product managers</strong> to visualize and prioritize features
            based on their value to users versus cost to build.
          </p>
          <p>
            However, this prioritization approach has applications in all areas of life! Whether you're planning home
            improvements, deciding which skills to learn, or organizing your personal projects - this matrix helps you
            make better decisions about where to invest your time and resources.
          </p>
        </div>

        <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
          Add features to map their comparative value/cost in relation to each other, these views will hopefully help
          you to make better product decisions.
        </p>
        <FeaturePriorityMatrix />
      </div>
    </main>
  )
}

