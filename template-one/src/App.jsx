import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import HeroSlider from './components/HeroSlider';
import DepartmentOverview from './components/DepartmentOverview';
import Officials from './components/Officials';
import Services from './components/Services';
import Activities from './components/Activities';
import CitizenResources from './components/CitizenResources';
import Documents from './components/Documents';
import Downloads from './components/Downloads';
import Notifications from './components/Notifications';
import Grievances, { GrievancePortalPage } from './components/Grievances';
import Chatbot from './components/Chatbot';
import GovernmentPartners from './components/GovernmentPartners';
import Footer from './components/Footer';
import PageMetadata from './components/PageMetadata';
import AboutDetailPage from './components/AboutDetailPage';
import ServicesDetailPage from './components/ServicesDetailPage';
import SectionWrapper from './components/SectionWrapper';
import { ContentProvider } from './content/ContentContext';
import { CMS_ENABLED } from './config/portalConfig';
import { SITE_KEY } from './services/cmsApi';
import './App.css';

const CMSDashboard = lazy(() => import('./components/CMSDashboard'));

// ── Default sections (shown on all sites that don't have a fullPage extension) ──
const DefaultSections = () => (
  <>
    <NewsTicker />
    <SectionWrapper><HeroSlider /></SectionWrapper>
    <SectionWrapper><DepartmentOverview /></SectionWrapper>
    <SectionWrapper><Officials /></SectionWrapper>
    <SectionWrapper><Services /></SectionWrapper>
    <SectionWrapper><Activities /></SectionWrapper>
    <SectionWrapper><CitizenResources /></SectionWrapper>
    <SectionWrapper><Documents /></SectionWrapper>
    <SectionWrapper><Downloads /></SectionWrapper>
    <SectionWrapper><Notifications /></SectionWrapper>
    <SectionWrapper><Grievances /></SectionWrapper>
    <SectionWrapper><GovernmentPartners /></SectionWrapper>
  </>
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

// Dynamically load the site extension.
// ext.Component  — the default export (React component)
// ext.fullPage   — if true, Component replaces the entire DefaultSections layout
//                  if false/absent, Component is appended after DefaultSections
const useExtension = () => {
  const [ext, setExt] = useState({ Component: null, fullPage: false });

  useEffect(() => {
    if (!SITE_KEY) return;
    import(`./extensions/${SITE_KEY}/index.jsx`)
      .then(mod => setExt({
        Component: mod.default  || null,
        fullPage:  mod.fullPage === true,
      }))
      .catch(() => {});
  }, []);

  return ext;
};

const PortalApp = () => {
  const hash = useHashView();
  const ext  = useExtension();

  const isCms            = CMS_ENABLED && hash === '#cms';
  const isAboutDetail    = hash === '#about-detail';
  const isServicesDetail = hash === '#services-detail';
  const isGrievancePortal = hash === '#grievance-portal';

  useEffect(() => {
    if (isAboutDetail || isServicesDetail || isGrievancePortal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAboutDetail, isGrievancePortal, isServicesDetail]);

  const renderMain = () => {
    if (isCms)             return <Suspense fallback={<div className="page-loader">Loading CMS...</div>}><CMSDashboard /></Suspense>;
    if (isAboutDetail)     return <AboutDetailPage />;
    if (isServicesDetail)  return <ServicesDetailPage />;
    if (isGrievancePortal) return <GrievancePortalPage />;

    // fullPage extension: extension controls the entire layout
    if (ext.fullPage && ext.Component) return <ext.Component />;

    // Default layout + optional extra sections from extension
    return (
      <>
        <DefaultSections />
        {ext.Component && <ext.Component />}
      </>
    );
  };

  return (
    <div className="App bg-light">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {renderMain()}
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
