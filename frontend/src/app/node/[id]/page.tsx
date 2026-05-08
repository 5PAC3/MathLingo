import { readFileSync } from 'fs'
import { join } from 'path'
import NodePage from './NodePage'

export function generateStaticParams() {
  const data = JSON.parse(
    readFileSync(join(process.cwd(), '..', 'skilltree.json'), 'utf-8')
  )
  return data.nodes.map((n: { id: string }) => ({ id: n.id }))
}

export default function Page() {
  return <NodePage />
}
