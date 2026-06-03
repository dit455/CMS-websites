import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft, FaBullseye, FaCheckCircle, FaEye, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

const missionItems = [
  'To promote effective adoption of Information Technology across Government Departments.',
  'To provide secure, reliable, and citizen-friendly digital services.',
  'To strengthen digital infrastructure and governance frameworks.',
  'To support the implementation of national and state e-Governance initiatives.',
  'To encourage innovation, cybersecurity, and digital inclusiveness in public administration.',
];

const keyFunctions = [
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

const initiativeFocus = [
  'Online public service delivery',
  'Digital records and workflow automation',
  'Integrated Government platforms',
  'Smart governance solutions',
  'Secure and scalable IT ecosystems',
  'Accessibility and inclusive digital access',
];

const AboutDetailPage = () => (
  <section className="detail-page about-detail-page">
    <Container>
      <div className="detail-hero about-detail-hero">
        <a href="#about" className="detail-back-link">
          <FaArrowLeft size={12} /> Back to leadership
        </a>
        <span className="section-kicker">About Us</span>
        <h1>Empowering Digital Governance for a Smarter Puducherry</h1>
        <p>
          The Directorate of Information Technology (DIT), Government of Puducherry, serves as
          the central agency driving digital transformation and e-Governance initiatives across
          the Union Territory.
        </p>
      </div>

      <div className="about-content-panel shadow-soft">
        <p>
          Established with the vision of creating a technologically empowered administration, DIT
          plays a pivotal role in modernizing government services, strengthening digital
          infrastructure, and enabling citizen-centric governance.
        </p>
        <p>
          With a commitment to innovation, transparency, and efficiency, the Directorate works
          closely with various Government Departments to design, implement, and manage robust IT
          solutions that enhance public service delivery and improve administrative performance.
        </p>
      </div>

      <Row className="g-4 my-1">
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon"><FaEye /></span>
              <h2>Our Vision</h2>
              <p>
                To build a digitally connected, transparent, and technology-driven Puducherry by
                delivering innovative and accessible e-Governance solutions for citizens,
                businesses, and government institutions.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
            <Card.Body className="p-4">
              <span className="about-focus-icon emerald"><FaBullseye /></span>
              <h2>Our Mission</h2>
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
              <h2>Citizen-Centric Digital Services</h2>
              <p>
                DIT is committed to simplifying access to Government services through modern
                digital platforms, ensuring faster delivery, improved transparency, and enhanced
                user experience for citizens and stakeholders.
              </p>
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
              <h2>Driving Innovation & Digital Transformation</h2>
              <p>
                As technology continues to evolve, the Directorate actively explores innovative
                solutions including cloud infrastructure, data analytics, automation, cybersecurity
                frameworks, and smart governance technologies.
              </p>
              <p>
                DIT continues to work towards creating a future-ready digital ecosystem that
                supports sustainable growth, administrative excellence, and seamless citizen
                engagement.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="about-commitment">
        <h2>Commitment to Excellence</h2>
        <p>
          The Directorate of Information Technology remains dedicated to delivering reliable,
          transparent, and efficient digital governance solutions that contribute to the
          socio-economic development of Puducherry and improve the quality of public services for
          every citizen.
        </p>
        <strong>Together, we are building a smarter, digitally empowered Puducherry.</strong>
      </div>
    </Container>
  </section>
);

export default AboutDetailPage;
