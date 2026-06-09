import { visit } from 'unist-util-visit'

/** Single newlines inside paragraphs become <br> (ChatGPT-style). */
export function remarkBreaks() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const next = []
      for (const child of node.children) {
        if (child.type !== 'text' || !child.value.includes('\n')) {
          next.push(child)
          continue
        }
        const parts = child.value.split('\n')
        parts.forEach((part, i) => {
          if (part) next.push({ type: 'text', value: part })
          if (i < parts.length - 1) next.push({ type: 'break' })
        })
      }
      node.children = next
    })
  }
}
