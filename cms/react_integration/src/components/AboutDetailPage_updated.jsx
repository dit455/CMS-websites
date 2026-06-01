/**
 * AboutDetailPage.jsx — CMS-driven
 * ==================================
 * Replaces all hardcoded arrays and text with data from GET /api/about/
 * Falls back to the original hardcoded content if API is unavailable.
 * 
 * HOW TO USE:
 *   Replace your existing src/components/AboutDetailPage.jsx with this file.
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft, FaBullseye, FaCheckCircle, FaEye, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

// ── Fallback static content (same as original) ──────────────────────────────
const FALLBACK = {
  hero_kicker: 'About Us',
  hero_title: 'Empowering Digital Governance for a Smarter Puducherry',
  hero_description: 'The Directorate of Information Technology (DIT), Government of Puducherry, serves as the central agency driving digital transformation and e-Governance initiatives across the Union Territory.',
  intro_para1: 'Established with the vision of creating a technologically empowered administration, DIT plays a pivotal role in modernizing government services, strengthening digital infrastructure, and enabling citizen-centric governance.',
  intro_para2: 'With a commitment to innovation, transparency, and efficiency, the Directorate works closely with various Government Departments to design, implement, and manage robust IT solutions that enhance public service delivery and improve administrative performance.',
  vision_title: 'Our Vision',
  vision_text: 'To build a digitally connected, transparent, and technology-driven Puducherry by delivering innovative and accessible e-Governance solutions for citizens, businesses, and government institutions.',
  mission_title: 'Our Mission',
  mission_points: [
    { id: 1, text: 'To promote effective adoption of Information Technology across Government Departments.' },
    { id: 2, text: 'To provide secure, reliable, and citizen-friendly digital services.' },
    { id: 3, text: 'To strengthen digital infrastructure and governance frameworks.' },
    { id: 4, text: 'To support the implementation of national and state e-Governance initiatives.' },
    { id: 5, text: 'To encourage innovation, cybersecurity, and digital inclusiveness in public administration.' },
  ],
  citizen_services_title: 'Citizen-Centric Digital Services',
  citizen_services_text: 'DIT is committed to simplifying access to Government services through modern digital platforms, ensuring faster delivery, improved transparency, and enhanced user experience.',
  initiative_points: [
    { id: 1, text: 'Online public service delivery' },
    { id: 2, text: 'Digital records and workflow automation' },
    { id: 3, text: 'Integrated Government platforms' },
    { id: 4, text: 'Smart governance solutions' },
    { id: 5, text: 'Secure and scalable IT ecosystems' },
    { id: 6, text: 'Accessibility and inclusive digital access' },
  ],
  innovation_title: 'Driving Innovation & Digital Transformation',
  innovation_para1: 'As technology continues to evolve, the Directorate actively explores innovative solutions including cloud infrastructure, data analytics, automation, cybersecurity frameworks, and smart governance technologies.',
  innovation_para2: 'DIT continues to work towards creating a future-ready digital ecosystem that supports sustainable growth, administrative excellence, and seamless citizen engagement.',
  key_functions: [
    { id: 1, text: 'Implementation of e-Governance projects and digital transformation initiatives.' },
    { id: 2, text: 'Development and maintenance of Government portals, applications, and online services.' },
    { id: 3, text: 'Providing IT infrastructure support to Government Departments and institutions.' },
    { id: 4, text: 'Formulation and implementation of IT policies, standards, and guidelines.' },
    { id: 5, text: 'Coordination of Mission Mode Projects under Digital India and NeGP.' },
    { id: 6, text: 'Strengthening cybersecurity and data management practices within Government systems.' },
    { id: 7, text: 'Facilitating procurement and management of IT hardware, software, and networking solutions.' },
    { id: 8, text: 'Capacity building, technical training, and digital skill enhancement for Government officials.' },
    { id: 9, text: 'Technical consultancy and project support for departmental digitization initiatives.' },
  ],
  commitment_title: 'Commitment to Excellence',
  commitment_text: 'The Directorate of Information Technology remains dedicated to delivering reliable, transparent, and efficient digital governance solutions that contribute to the socio-economic development of Puducherry.',
  commitment_tagline: 'Together, we are building a smarter, digitally empowered Puducherry.',
};

const AboutDetailPage = () => {
  const [data, setData]     = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    fetch(`${BASE}/about/`)
      .then(r => { if (!r.ok) throw new Error('API unavailable'); return r.json(); })
      .then(json => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));  // Falls back to FALLBACK silently
  }, []);

  if (loading) {
    return (
      <section className="detail-page about-detail-page">
        <Container><div className="py-5 text-center text-muted">Loading about page…</div></Container>
      </section>
    );
  }

  return (
    <section className="detail-page about-detail-page">
      <Container>

        {/* ── Hero ── */}
        <div className="detail-hero about-detail-hero">
          <a href="#about" className="detail-back-link"><FaArrowLeft size={12} /> Back to leadership</a>
          <span className="section-kicker">{data.hero_kicker}</span>
          <h1>{data.hero_title}</h1>
          <p>{data.hero_description}</p>
        </div>

        {/* ── Intro ── */}
        <div className="about-content-panel shadow-soft">
          <p>{data.intro_para1}</p>
          {data.intro_para2 && <p>{data.intro_para2}</p>}
        </div>

        {/* ── Vision & Mission ── */}
        <Row className="g-4 my-1">
          <Col lg={6}>
            <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
              <Card.Body className="p-4">
                <span className="about-focus-icon"><FaEye /></span>
                <h2>{data.vision_title}</h2>
                <p>{data.vision_text}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
              <Card.Body className="p-4">
                <span className="about-focus-icon emerald"><FaBullseye /></span>
                <h2>{data.mission_title}</h2>
                <ul>
                  {(data.mission_points || []).map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ── Key Functions ── */}
        <div className="detail-section-block">
          <span className="section-kicker">What We Do</span>
          <h2>Key Functions</h2>
          <p>The Directorate undertakes a wide range of responsibilities aimed at advancing digital governance and IT-enabled services across Puducherry.</p>
          <div className="about-function-grid">
            {(data.key_functions || []).map((item) => (
              <div key={item.id} className="about-function-item">
                <FaCheckCircle />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Citizen Services + Innovation ── */}
        <Row className="g-4">
          <Col lg={6}>
            <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
              <Card.Body className="p-4">
                <span className="about-focus-icon"><FaShieldAlt /></span>
                <h2>{data.citizen_services_title}</h2>
                <p>{data.citizen_services_text}</p>
                <div className="about-pill-list">
                  {(data.initiative_points || []).map((item) => (
                    <span key={item.id}>{item.text}</span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="about-focus-card h-100 border-0 rounded-4 shadow-soft">
              <Card.Body className="p-4">
                <span className="about-focus-icon emerald"><FaLightbulb /></span>
                <h2>{data.innovation_title}</h2>
                <p>{data.innovation_para1}</p>
                {data.innovation_para2 && <p>{data.innovation_para2}</p>}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ── Commitment ── */}
        <div className="about-commitment">
          <h2>{data.commitment_title}</h2>
          <p>{data.commitment_text}</p>
          <strong>{data.commitment_tagline}</strong>
        </div>

      </Container>
    </section>
  );
};

export default AboutDetailPage;
