import Link from "next/link"

export default function DocumentationIndexPage() {
  return (
    <div className="space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_a]:underline [&_a]:underline-offset-4">
      <h1>Documentation</h1>
      <p>Browse the docs.</p>

      <ul>
        <li>
          <Link href="/documentation/getting-started">Getting started</Link>
        </li>
      </ul>
    </div>
  )
}

