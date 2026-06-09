import ChatArtifact from './ChatArtifact'
import { dedupeArtifacts } from './parseArtifacts'

export default function LiveArtifacts({ artifacts }) {
  const items = dedupeArtifacts(artifacts ?? [])
  if (!items.length) return null

  return (
    <div className="space-y-3">
      {items.map((data) => (
        <ChatArtifact key={data.id || `${data.type}-${data.title}`} data={data} />
      ))}
    </div>
  )
}
