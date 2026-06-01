import { Container, Row, Col } from 'react-bootstrap';
import {
  FaBuilding,
  FaUsers,
  FaProjectDiagram,
  FaFileSignature,
  FaFileContract,
  FaArrowRight,
} from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const overviewIcons = {
  department: <FaBuilding size={22} />,
  citizen: <FaUsers size={22} />,
  schemes: <FaProjectDiagram size={22} />,
  circulars: <FaFileSignature size={22} />,
  tenders: <FaFileContract size={22} />,
};

const DepartmentOverview = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;

  return (
    <section id="department-overview" className="department-overview-section py-4 my-2" aria-labelledby="department-overview-title">
      <Container>
        <Row className="g-3 align-items-stretch department-overview-layout">
          <Col lg={5}>
            <div className="department-overview-copy h-100">
              <span className="section-kicker">Department Overview</span>
              <h2 id="department-overview-title" className="fw-bold mb-3 mt-3">
                Digital governance services for Puducherry
              </h2>
              <p>
                {site.footerDescription}
              </p>
              <div className="overview-action-row">
                <a href="#services">
                  Explore services <FaArrowRight size={12} aria-hidden="true" />
                </a>
                <a href="#documents">
                  View resources <FaArrowRight size={12} aria-hidden="true" />
                </a>
              </div>
              <dl className="overview-contact-list">
                <div>
                  <dt>Department</dt>
                  <dd>{site.departmentName}</dd>
                </div>
                <div>
                  <dt>Government</dt>
                  <dd>{site.governmentName}</dd>
                </div>
                <div>
                  <dt>Helpdesk</dt>
                  <dd>
                    <a href={`mailto:${site.helpdeskEmail}`}>{emailDisplay}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </Col>

          <Col lg={7}>
            <div className="overview-card-grid">
              {content.homeHighlights.map((item) => (
                <a key={item.title} href={item.href} className="overview-card">
                  <span className="overview-card-icon" aria-hidden="true">
                    {overviewIcons[item.icon] || overviewIcons.department}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DepartmentOverview;
