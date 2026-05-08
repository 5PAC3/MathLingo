import { readFileSync } from 'fs'
import { join } from 'path'
import MacroPage from './MacroPage'

export function generateStaticParams() {
  const data = JSON.parse(
    readFileSync(join(process.cwd(), '..', 'skilltree.json'), 'utf-8')
  )
  return data.macros.map((m: { id: string }) => ({ macro: m.id }))
}

export default function Page() {
  return <MacroPage />
}
