import fs from "node:fs/promises"
import path from "node:path"

import Markdoc from "@markdoc/markdoc"
import React from "react"

const DOCS_ROOT = path.join(process.cwd(), "content", "documentation")

function assertSafeSlugParts(slugParts: string[]) {
  for (const part of slugParts) {
    if (!/^[a-z0-9-]+$/i.test(part)) {
      throw new Error("Invalid documentation path")
    }
  }
}

export async function readDocumentationSource(slugParts: string[]): Promise<string> {
  const normalized = slugParts.length === 0 ? ["index"] : slugParts
  assertSafeSlugParts(normalized)

  const filePath = path.join(DOCS_ROOT, `${normalized.join("/")}.mdoc`)
  return await fs.readFile(filePath, "utf8")
}

export function renderMarkdoc(source: string): React.ReactNode {
  const ast = Markdoc.parse(source)
  const content = Markdoc.transform(ast)
  return Markdoc.renderers.react(content, React)
}

