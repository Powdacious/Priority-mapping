import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { readDocumentationSource, renderMarkdoc } from "@/lib/markdoc"

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const title = slug?.length ? slug.join(" / ") : "Documentation"
  return { title: `${title} | Documentation` }
}

export default async function DocumentationPage(props: PageProps) {
  const { slug = [] } = await props.params

  try {
    const source = await readDocumentationSource(slug)
    const node = renderMarkdoc(source)

    return (
      <div className="space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4">
        {node}
      </div>
    )
  } catch {
    notFound()
  }
}

