import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft, FaBullseye, FaCheckCircle, FaEye, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const fallbackMissionItems = [
  'To promote effective adoption of Information Technology across Government Departments.',
  'To provide secure, reliable, and citizen-friendly digital services.',
  'To strengthen digital infrastructure and governance frameworks.',
  'To support the implementation of national and state e-Governance initiatives.',
  'To encourage innovation, cybersecurity, and digital inclusiveness in public administration.',
];

const fallbackKeyFunctions = [
  'Implementation of e-Governance projects and digital transformation initiatives.',
  'Development and maintenance of Government portals, applications, and online services.',
  'Providing IT infrastructure support to Government Departments and institutions.',
  'Formulation and implementation of IT policies, standards, and guidelines.',
  'Coordination of Mission Mode Projects under Digital India and National e-Governance Plan (NeGP).',
  'Strengthening cybersecurity and data management practices within Government systems.',
  'Facilitating procurement and management of IT hardware, software, and networking solutions.',
  'Capacity building, technical training, and digital skill enhancement for Government officials.',
  'Technical consultancy and project support for departmental digitization initiatives.',
];

const fallbackInitiativeFocus = [
  'Online public service delivery',
  'Digital records and workflow automation',
  'Integrated Government platforms',
  'Smart governance solutions',
  'Secure and scalable IT ecosystems',
  'Accessibility and inclusive digital access',
];

const AboutDetailPage = () => {
  const { content } = useSiteContent();
  const about = content.about || {};

  const heroTitle = about.heroTitle || 'Empowering Digital Governance for a Smarter Puducherry';
  const heroDescription = about.heroDescription ||
    'The Directorate of Information Technology (DIT), Government of Puducherry, serves as the central agency driving digital transformation and e-Governance initiatives across the Union Territory.';
  const introPara1 = about.introPara1 ||
    'Established with the vision of creating a technologically empowered administration, DIT plays a pivotal role in modernizing government services, strengthening digital infrastructure, and enabling citizen-centric governance.';
  const introPara2 = about.introPara2 ||
    'With a commitment to innovation, transparency, and efficiency, the Directorate works closely with various Government Departments to design, implement, and manage robust IT solutions that enhance public service delivery and improve administrative performance.';
  const visionTitle = about.visionTitle || 'Our Vision';
  const visionText = about.visionText ||
    'To build a digitally connected, transparent, and technology-driven Puducherry by delivering innovative and accessible e-Governance solutions for citizens, businesses, and government institutions.';
  const missionTitle = about.missionTitle || 'Our Mission';
  const missionItems = (about.missionPoints && about.missionPoints.length) ? about.missionPoints : fallbackMissionItems;
  const keyFunctions = (about.keyFunctions && about.keyFunctions.length) ? about.keyFunctions : fallbackKeyFunctions;
  const initiativeFocus = (about.initiativeFocus && about.initiativeFocus.length) ? about.initiativeFocus : fallbackInitiativeFocus;
  const citizenServicesTitle = about.citizenServicesTitle || 'Citizen-Centric Digital Services';
  const citizenServicesText = about.citizenServicesText ||
    'DIT is committed to simplifying access to Government services through modern digital platforms, ensuring faster delivery, improved transparency, and enhanced user experience for citizens and stakeholders.';
  const innovationTitle = about.innovationTitle || 'Driving Innovation & Digital Transformation';
  const innovationPara1 = about.innovationPara1 ||
    'As technology continues to evolve, the Directorate actively explores innovative solutions including cloud infrastructure, data analytics, automation, cybersecurity frameworks, and smart governance technologies.';
  const innovationPara2 = about.innovationPara2 ||
    'DIT continues to work towards creating a future-ready digital ecosystem that supports sustainable growth, administrative excellence, and seamless citizen engagement.';
  const commitmentTitle = about.commitmentTitle || 'Commitment to Excellence';
  const commitmentText = about.commitmentText ||
    'The Directorate of Information Technology remains dedicated to delivering reliable, transparent, and efficient digital governance solutions that contribute to the socio-economic development of Puducherry and improve the quality of public services for every citizen.';
  const commitmentTagline = about.commitmentTagline ||
    'Together, we are building a smarter, digitally empowered Puducherry.';

  return (
  <section className="detail-page about-detail-page">
    <Container>
      <div className="detail-hero about-detail-hero">
        <a href="#about" className="detail-back-link">
          <FaArrowLeft size={12} /> Back to leadership
        </a>
        <span className="section-kicker">{about.heroKicker || 'About Us'}</span>
        <h1>{heroTitle}</h1>
        <p>{heroDescription}</p>
      </div>

      <div className="about-content-panel shadow-soft">
        <p>{introPara1}</p>
        {introPara2 && <p>{introPara2}</p>}
      </div>

      <Row className="g-4 my-1">
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon"><FaEye /></span>
              <h2>{visionTitle}</h2>
              <p>{visionText}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon emerald"><FaBullseye /></span>
              <h2>{missionTitle}</h2>
              <ul>
                {missionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="detail-section-block">
        <span className="section-kicker">What We Do</span>
        <h2>Key Functions</h2>
        <p>
          The Directorate undertakes a wide range of responsibilities aimed at advancing digital
          governance and IT-enabled services across Puducherry.
        </p>
        <div className="about-function-grid">
          {keyFunctions.map((item) => (
            <div key={item} className="about-function-item">
              <FaCheckCircle />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon"><FaShieldAlt /></span>
              <h2>{citizenServicesTitle}</h2>
              <p>{citizenServicesText}</p>
              <div className="about-pill-list">
                {initiativeFocus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon emerald"><FaLightbulb /></span>
              <h2>{innovationTitle}</h2>
              <p>{innovationPara1}</p>
              {innovationPara2 && <p>{innovationPara2}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="about-commitment">
        <h2>{commitmentTitle}</h2>
        <p>{commitmentText}</p>
        <strong>{commitmentTagline}</strong>
      </div>
    </Container>
  </section>
  );
};

export default AboutDetailPage;
