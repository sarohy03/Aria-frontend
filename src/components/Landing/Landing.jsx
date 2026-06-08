import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import CTASection from './CTASection'
import Footer from './Footer'

export default function Landing({ onGetStarted }) {
  return (
    <div className="relative min-h-screen bg-[#030303]">
      <Navbar onGetStarted={onGetStarted} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <HowItWorks />
        <CTASection onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </div>
  )
}
