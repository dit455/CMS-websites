import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import serviceIconMap from './serviceIconMap';
import { useSiteContent } from '../content/useSiteContent';

const Services = () => {
  const { content } = useSiteContent();
  const services = content.services.slice(0, 6);

  return (
    <Container id="services" className="py-5 my-3">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 section-heading-row">
        <div>
          <span className="section-kicker">Services</span>
          <h2 className="display-6 fw-bold mb-2 mt-3">Our Key Services</h2>
          <p className="section-intro mb-0">
            A focused view of the infrastructure and citizen access platforms managed by the
            Directorate.
          </p>
        </div>
        <a href="#services-detail" className="text-danger fw-bold text-decoration-none d-flex align-items-center gap-2 mt-3">
          VIEW ALL SERVICES <FaArrowRight />
        </a>
      </div>

      <Row className="g-4">
        {services.map((service, index) => {
          const Icon = serviceIconMap[service.icon] || serviceIconMap.server;

          return (
            <Col key={service.title || index} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-soft rounded-4 p-4 lift-on-hover">
                <Card.Body className="d-flex flex-column">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      backgroundColor: service.surface,
                      color: service.accent,
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    <Icon size={30} />
                  </div>
                  <Card.Title className="fw-bold fs-5 mb-3">{service.title}</Card.Title>
                  <Card.Text className="text-secondary small mb-4">{service.desc}</Card.Text>
                  <div className="mt-auto d-flex gap-2">
                    {(service.links || []).slice(0, 2).map((link, linkIndex) => (
                      <Button
                        key={`${service.title}-${link.label}`}
                        as="a"
                        href={link.href}
                        variant={linkIndex === 0 ? 'danger' : 'outline-danger'}
                        size="sm"
                        className={`rounded-pill px-3 ${linkIndex === 0 ? 'shadow-sm' : ''}`}
                      >
                        {link.label}
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
  );
};

export default Services;
