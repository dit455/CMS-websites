import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import HeroSlider from './components/HeroSlider';
import DepartmentOverview from './components/DepartmentOverview';
import Officials from './components/Officials';
import Services from './components/Services';
import Activities from './components/Activities';
import CitizenResources from './components/CitizenResources';
import Documents from './components/Documents';
import Grievances, { GrievancePortalPage } from './components/Grievances';
import Chatbot from './components/Chatbot';
import GovernmentPartners from './components/GovernmentPartners';
import Footer from './components/Footer';
import PageMetadata from './components/PageMetadata';
import AboutDetailPage from './components/AboutDetailPage';
import ServicesDetailPage from './components/ServicesDetailPage';
import { ContentProvider } from './content/ContentContext';
import { CMS_ENABLED } from './config/portalConfig';
import './App.css';

const MotionSection = motion.section;
const CMSDashboard = lazy(() => import('./components/CMSDashboard'));

const SectionWrapper = ({ children }) => (
  <MotionSection
    className="section-shell"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    {children}
  </MotionSection>
);

const useHashView = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
};

const PortalApp = () => {
  const hash = useHashView();
  const isCms = CMS_ENABLED && hash === '#cms';
  const isAboutDetail = hash === '#about-detail';
  const isServicesDetail = hash === '#services-detail';
  const isGrievancePortal = hash === '#grievance-portal';

  useEffect(() => {
    if (isAboutDetail || isServicesDetail || isGrievancePortal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAboutDetail, isGrievancePortal, isServicesDetail]);

  return (
    <div className="App bg-light">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {isCms ? (
          <Suspense fallback={<div className="page-loader">Loading CMS...</div>}>
            <CMSDashboard />
          </Suspense>
        ) : isAboutDetail ? (
          <AboutDetailPage />
        ) : isServicesDetail ? (
          <ServicesDetailPage />
        ) : isGrievancePortal ? (
          <GrievancePortalPage />
        ) : (
          <>
            <NewsTicker />
            <SectionWrapper>
              <HeroSlider />
            </SectionWrapper>

            <SectionWrapper>
              <DepartmentOverview />
            </SectionWrapper>

            <SectionWrapper>
              <Officials />
            </SectionWrapper>

            <SectionWrapper>
              <Services />
            </SectionWrapper>

            <SectionWrapper>
              <Activities />
            </SectionWrapper>

            <SectionWrapper>
              <CitizenResources />
            </SectionWrapper>

            <SectionWrapper>
              <Documents />
            </SectionWrapper>

            <SectionWrapper>
              <Grievances />
            </SectionWrapper>

            <SectionWrapper>
              <GovernmentPartners />
            </SectionWrapper>
          </>
        )}
      </main>
      {!isCms && <PageMetadata />}
      {!isCms && <Chatbot />}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ContentProvider>
      <PortalApp />
    </ContentProvider>
  );
}

export default App;
