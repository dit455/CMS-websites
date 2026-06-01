import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import serviceIconMap from './serviceIconMap';
import { useSiteContent } from '../content/useSiteContent';

const ServicesDetailPage = () => {
  const { content } = useSiteContent();

  return (
    <section className="detail-page service-detail-page">
      <Container>
        <div className="detail-hero">
          <a href="#services" className="detail-back-link">
            <FaArrowLeft size={12} /> Back to services
          </a>
          <span className="section-kicker">Digital Services</span>
          <h1>Complete Services Directory</h1>
          <p>
            Explore the Directorate's core infrastructure, citizen-service, security, and
            consultancy offerings supporting modern e-Governance across Puducherry.
          </p>
        </div>

        <Row className="g-4">
          {content.services.map((service, index) => {
            const Icon = serviceIconMap[service.icon] || serviceIconMap.server;

            return (
              <Col key={service.title || index} lg={6}>
                <Card className="detail-service-card h-100 border-0 rounded-4 shadow-soft">
                  <Card.Body className="p-4">
                    <div className="detail-service-head">
                      <span
                        className="detail-service-icon"
                        style={{ backgroundColor: service.surface, color: service.accent }}
                      >
                        <Icon size={26} />
                      </span>
                      <div>
                        <span>Service {String(index + 1).padStart(2, '0')}</span>
                        <h2>{service.title}</h2>
                      </div>
                    </div>
                    <p>{service.desc}</p>
                    <div className="detail-service-actions">
                      {(service.links || []).slice(0, 2).map((link, linkIndex) => (
                        <Button
                          key={`${service.title}-${link.label}`}
                          as="a"
                          href={link.href}
                          variant={linkIndex === 0 ? 'danger' : 'outline-danger'}
                          size="sm"
                          className="rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-2"
                        >
                          {link.label}
                          {linkIndex === 0 && <FaArrowRight size={11} />}
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default ServicesDetailPage;
