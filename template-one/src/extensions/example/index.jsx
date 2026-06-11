/**
 * Site Extension: example
 *
 * This file is ONLY loaded when VITE_SITE_KEY=example.
 * Other sites never see this code.
 *
 * You can import any shared component:
 *   import SectionWrapper from '../../components/SectionWrapper';
 *
 * You can also fetch CMS data here using the same cmsApi:
 *   import { cmsApi } from '../../services/cmsApi';
 */
import SectionWrapper from '../../components/SectionWrapper';

const ExampleExtension = () => {
  return (
    <SectionWrapper>
      <section style={{ padding: '3rem 2rem', background: '#f0fdf4', textAlign: 'center' }}>
        <h2 style={{ color: '#166534', marginBottom: '1rem' }}>
          Example Site — Custom Section
        </h2>
        <p style={{ color: '#4b5563', maxWidth: '600px', margin: '0 auto' }}>
          This section only appears on the <strong>example</strong> site.
          Replace this with your unique content.
        </p>
      </section>
    </SectionWrapper>
  );
};

export default ExampleExtension;
