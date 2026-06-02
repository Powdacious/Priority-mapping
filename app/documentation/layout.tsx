import Link from "next/link"

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8" role="main" aria-label="Documentation">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back to app
          </Link>
          <Link href="/documentation" className="text-sm text-muted-foreground hover:underline">
            Documentation home
          </Link>
        </div>
        {children}
      </div>
    </main>
  )
}

