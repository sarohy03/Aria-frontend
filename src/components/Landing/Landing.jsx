import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import CTASection from './CTASection'
import Footer from './Footer'

export default function Landing({ onGetStarted }) {
  const handleGetStarted = onGetStarted ?? (() => {
    console.info('Get started — auth coming next')
  })

  return (
    <div className="relative min-h-screen bg-[#030303]">
      <Navbar onGetStarted={handleGetStarted} />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <Footer />
    </div>
  )
}
