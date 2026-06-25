import { Container, Row, Col, Button } from 'react-bootstrap';
import {
  FaBuilding, FaUsers, FaProjectDiagram,
  FaFileSignature, FaFileContract, FaServer, FaHeadset, FaArrowRight,
} from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';
import CmsPlaceholder from './CmsPlaceholder';

const overviewIcons = {
  department:     <FaBuilding size={22} />,
  citizen:        <FaUsers size={22} />,
  schemes:        <FaProjectDiagram size={22} />,
  circulars:      <FaFileSignature size={22} />,
  tenders:        <FaFileContract size={22} />,
  infrastructure: <FaServer size={22} />,
  helpdesk:       <FaHeadset size={22} />,
};

const DepartmentOverview = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;

  if (!site.departmentName && !site.overviewDescription) {
    return <CmsPlaceholder section="Department Overview" />;
  }

  const fullText    = (site.overviewDescription || '').trim();
  const LIMIT       = 220;
  const previewText = fullText.length > LIMIT
    ? fullText.slice(0, LIMIT).replace(/\s+\S*$/, '') + '…'
    : fullText;
  const hasMore  = fullText.length > 0;
  const hasCards = content.homeHighlights.length > 0;

  return (
    <section id="department-overview" className="department-overview-section py-4 my-2" aria-labelledby="department-overview-title">
      <Container>
        <Row className="g-3 align-items-stretch department-overview-layout">

          <Col lg={hasCards ? 5 : 8}>
            <div className="department-overview-copy h-100">
              <span className="section-kicker">Department Overview</span>
              <h2 id="department-overview-title" className="fw-bold mb-3 mt-3">
                {site.departmentName || 'Department Overview'}
              </h2>

              {/* Truncated preview + Read More */}
              {previewText && (
                <>
                  <p className="mb-3 text-secondary" style={{ lineHeight: '1.7' }}>
                    {previewText}
                  </p>
                  {hasMore && (
                    <Button
                      as="a"
                      href="#overview-detail"
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-4 mb-4 d-inline-flex align-items-center gap-2 fw-semibold"
                    >
                      Read More <FaArrowRight size={12} />
                    </Button>
                  )}
                </>
              )}

              <div className="overview-action-row">
                <a href="#services">Explore services <FaArrowRight size={12} aria-hidden="true" /></a>
                <a href="#documents">View resources <FaArrowRight size={12} aria-hidden="true" /></a>
              </div>

              <dl className="overview-contact-list">
                {site.departmentName && (
                  <div><dt>Department</dt><dd>{site.departmentName}</dd></div>
                )}
                {site.governmentName && (
                  <div><dt>Government</dt><dd>{site.governmentName}</dd></div>
                )}
                {site.helpdeskEmail && (
                  <div>
                    <dt>Helpdesk</dt>
                    <dd><a href={`mailto:${site.helpdeskEmail}`}>{emailDisplay}</a></dd>
                  </div>
                )}
              </dl>
            </div>
          </Col>

          {hasCards && (
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
          )}

        </Row>
      </Container>
    </section>
  );
};

export default DepartmentOverview;
