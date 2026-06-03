import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBell, FaDownload, FaBriefcase, FaGavel, FaArrowRight, FaFileContract } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const resourceIcons = {
  bell: <FaBell size={22} />,
  download: <FaDownload size={22} />,
  briefcase: <FaBriefcase size={22} />,
  gavel: <FaGavel size={22} />,
  tender: <FaFileContract size={22} />,
};

const CitizenResources = () => {
  const { content } = useSiteContent();
  const [showAllResources, setShowAllResources] = useState(false);
  const visibleResourceCount = 3;
  const visibleResourceGroups = showAllResources
    ? content.resourceGroups
    : content.resourceGroups.slice(0, visibleResourceCount);
  const hasMoreResources = content.resourceGroups.length > visibleResourceCount;

  return (
    <Container className="citizen-resources-section py-4 my-2">
      <div className="text-center mb-4">
        <span className="section-kicker">Portal Access</span>
        <h2 className="display-6 fw-bold mb-2 mt-2">Important citizen resource areas</h2>
        <p className="section-intro mx-auto">
          A cleaner shortcut layer for the information people usually look for first: updates,
          downloads, business support, and public information routes.
        </p>
      </div>

      <Row className="g-3" id="citizen-resource-categories">
        {visibleResourceGroups.map((group) => (
          <Col key={group.id} md={6} xl={4}>
            <Card
              id={group.id}
              className="resource-card resource-card-compact h-100 border-0 rounded-4 p-3"
              style={{ '--resource-accent': group.accent, '--resource-surface': group.surface }}
            >
              <Card.Body className="p-0 d-flex flex-column">
                <div className="resource-card-header">
                  <div className="resource-icon">{resourceIcons[group.icon] || resourceIcons.bell}</div>
                  <div>
                    <span className="resource-eyebrow">{group.eyebrow}</span>
                    <Card.Title className="fw-bold fs-5 mt-1 mb-0">{group.title}</Card.Title>
                  </div>
                </div>
                <Card.Text className="resource-description text-secondary small mb-3">
                  {group.description}
                </Card.Text>
                <div className="resource-points resource-points-compact mb-3">
                  {group.points.slice(0, 2).map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
                <Button
                  as="a"
                  href={group.href}
                  variant="link"
                  className="resource-link mt-auto p-0 text-decoration-none fw-bold d-inline-flex align-items-center gap-2"
                >
                  {group.cta} <FaArrowRight size={12} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {hasMoreResources && (
        <div className="resource-view-all-row">
          <Button
            type="button"
            variant="primary"
            className="resource-view-all-btn"
            aria-expanded={showAllResources}
            aria-controls="citizen-resource-categories"
            onClick={() => setShowAllResources((current) => !current)}
          >
            {showAllResources ? 'Show fewer categories' : 'View all categories'}
            <FaArrowRight size={12} aria-hidden="true" />
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CitizenResources;
