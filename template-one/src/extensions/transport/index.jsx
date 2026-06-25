/**
 * ┌─────────────────────────────────────────────────────────────┐
 *   SITE EXTENSION — transport
 *   Only this site loads this file. Other sites are not affected.
 * └─────────────────────────────────────────────────────────────┘
 *
 *  HOW TO USE
 *  ──────────
 *  1. Set fullPage = true  → You control the entire page layout.
 *     Import only the sections you want and list them below.
 *
 *  2. Set fullPage = false → Your sections are added AFTER the
 *     default page. Good for just appending extra sections.
 *
 *  AVAILABLE SECTIONS (uncomment to use)
 *  ──────────────────────────────────────
 *  import NewsTicker         from '../../components/NewsTicker';
 *  import HeroSlider         from '../../components/HeroSlider';
 *  import DepartmentOverview from '../../components/DepartmentOverview';
 *  import Officials          from '../../components/Officials';
 *  import Services           from '../../components/Services';
 *  import Activities         from '../../components/Activities';
 *  import CitizenResources   from '../../components/CitizenResources';
 *  import Documents          from '../../components/Documents';
 *  import Downloads          from '../../components/Downloads';
 *  import Notifications      from '../../components/Notifications';
 *  import Grievances         from '../../components/Grievances';
 *  import GovernmentPartners from '../../components/GovernmentPartners';
 *
 *  TO OVERRIDE A SECTION'S LAYOUT FOR THIS SITE ONLY
 *  ───────────────────────────────────────────────────
 *  1. Copy the component file into this folder:
 *       FROM: ../../components/HeroSlider.jsx
 *       TO:   ./HeroSlider.jsx
 *  2. Change the import to point to the local copy:
 *       import HeroSlider from './HeroSlider';
 *  3. Edit ./HeroSlider.jsx freely — other sites are not affected.
 */

export const fullPage = false; // change to true to control the full layout

import NewsTicker from '../../components/NewsTicker';
import SectionWrapper from '../../components/SectionWrapper';
import SchedulePage from './SchedulePage';

// ── New pages unique to this site ────────────────────────────────────────
// Map a hash to a page component. Set a menu item's href to the hash
// (e.g. #transport-schedule) in CMS Admin → Menu Manager → Menu Items,
// and clicking it will open this page. No CMS content needed for the page itself.
export const routes = {
  '#transport-schedule': SchedulePage,
};

const TransportExtension = () => (
  <>
    {/* Add your sections here */}
  </>
);

export default TransportExtension;
