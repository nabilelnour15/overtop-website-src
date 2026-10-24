import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileContactBar } from './components/layout/MobileContactBar'
import { UtilityBar } from './components/layout/UtilityBar'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { RouteSteps } from './components/sections/RouteSteps'
import { ServicesIndex } from './components/sections/ServicesIndex'
import { ServiceSection } from './components/sections/ServiceSection'
import { TradeLanes } from './components/sections/TradeLanes'
import { useReveal } from './hooks/useReveal'
import { useI18n } from './i18n/context'

export default function App() {
  const { t } = useI18n()
  useReveal()

  return (
    <>
      <a
        href="#main"
        className="action-type fixed top-2 z-50 -translate-y-24 bg-ink px-4 py-3 text-bone focus:translate-y-0 ltr:left-2 rtl:right-2"
      >
        {t.a11y.skipToContent}
      </a>
      <div id="top">
        <UtilityBar />
      </div>
      <Header />
      <main id="main">
        <Hero />
        <TradeLanes />
        <ServicesIndex />
        <ServiceSection id="import" />
        <ServiceSection id="export" flip />
        <ServiceSection id="transport" tone="ink" footer={<RouteSteps />} />
        <ServiceSection id="customs" flip />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileContactBar />
    </>
  )
}
