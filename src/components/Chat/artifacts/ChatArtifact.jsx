import EmailArtifact from './EmailArtifact'
import EmailDraftArtifact from './EmailDraftArtifact'
import EmailListArtifact from './EmailListArtifact'
import EmailSentArtifact from './EmailSentArtifact'

export default function ChatArtifact({ data }) {
  if (!data?.type) return null

  switch (data.type) {
    case 'email':
      return <EmailArtifact {...data} />
    case 'email-list':
      return <EmailListArtifact title={data.title} emails={data.emails} />
    case 'email-draft':
      return <EmailDraftArtifact to={data.to} subject={data.subject} body={data.body} />
    case 'email-sent':
      return (
        <EmailSentArtifact to={data.to} subject={data.subject} status={data.status} />
      )
    default:
      return (
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-zinc-900 p-3 text-xs text-zinc-400">
          {JSON.stringify(data, null, 2)}
        </pre>
      )
  }
}
