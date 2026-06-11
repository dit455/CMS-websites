import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowRight, FaEnvelope } from 'react-icons/fa';
import itMinister from '../assets/img/itminister.png';
import secIT from '../assets/img/secit25b.jpg';
import director from '../assets/img/director.jpeg';
import { useSiteContent } from '../content/useSiteContent';
import CmsPlaceholder from './CmsPlaceholder';

const officialImages = {
  minister: itMinister,
  secretary: secIT,
  director,
};

const Officials = () => {
  const { content } = useSiteContent();
  const { site } = content;

  if (!content.officials.length) return <CmsPlaceholder section="Officials" />;

  return (
    <Container id="about" className="py-5 my-3">
      <div className="text-center mb-5">
        <span className="section-kicker">Leadership</span>
        <h2 className="display-6 fw-bold mb-2">Leadership & Officials</h2>
        <div className="bg-danger mx-auto" style={{ height: '3px', width: '80px' }}></div>
        <p className="section-intro mx-auto mt-3">
          Key officials guiding digital governance, infrastructure, and citizen service delivery.
        </p>
        <Button
          as="a"
          href="#about-detail"
          variant="outline-danger"
          className="rounded-pill px-4 mt-3 fw-bold d-inline-flex align-items-center gap-2"
        >
          Detailed About Us <FaArrowRight size={12} />
        </Button>
      </div>
      
      <Row className="g-4 justify-content-center">
        {content.officials.map((official, index) => (
          <Col key={index} md={4}>
            <Card className="text-center border-0 shadow-soft h-100 rounded-4 p-4 lift-on-hover border-top border-danger border-4">
              <div className="position-relative d-inline-block mx-auto mb-4">
                <div className="position-absolute bg-danger rounded-circle opacity-10" style={{ width: '150px', height: '150px', top: '-10px', left: '-10px', zIndex: 0 }}></div>
                {officialImages[official.imageKey] ? (
                  <Card.Img
                    variant="top"
                    src={officialImages[official.imageKey]}
                    alt={`${official.name}, ${official.role}`}
                    loading="lazy"
                    className="rounded-circle position-relative object-fit-cover shadow-sm border border-white border-4"
                    style={{ width: '130px', height: '130px', zIndex: 1 }}
                  />
                ) : (
                  <div className="official-initials rounded-circle position-relative shadow-sm border border-white border-4">
                    {official.initials}
                  </div>
                )}
              </div>
              <Card.Body className="p-0">
                <Card.Title className="fs-5 fw-bold mb-2">{official.name}</Card.Title>
                <Card.Text className="text-danger small fw-semibold text-uppercase tracking-wider mb-4" style={{ height: '40px' }}>{official.role}</Card.Text>
                
                <div className="d-flex justify-content-center gap-3 border-top pt-3">
                  <a
                    href={`mailto:${site.helpdeskEmail}`}
                    className="btn btn-link text-secondary p-0"
                    aria-label={`Email office regarding ${official.name}`}
                  >
                    <FaEnvelope size={18} />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Officials;
