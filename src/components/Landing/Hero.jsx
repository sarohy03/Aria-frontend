import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import ChatPreview from './ChatPreview'

export default function Hero({ onGetStarted }) {
  return (
    <>
      <HeroGeometric onGetStarted={onGetStarted} />
      <ChatPreview />
    </>
  )
}
