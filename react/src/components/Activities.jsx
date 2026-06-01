import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { FaLightbulb, FaRunning, FaRegNewspaper, FaChevronRight } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const activityIcons = {
  lightbulb: FaLightbulb,
  running: FaRunning,
  newspaper: FaRegNewspaper,
};

const Activities = () => {
  const { content } = useSiteContent();

  return (
    <Container id="activities" className="py-5 my-3">
      <Row className="g-4">
        {content.activities.map((group) => {
          const Icon = activityIcons[group.icon] || FaLightbulb;
          return (
            <Col key={group.title} md={4}>
              <div className={`bg-white p-4 rounded-4 shadow-soft border-top border-${group.color} border-4 h-100`}>
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(79,70,229,0.12)' }}>
                    <Icon className={`text-${group.color} fs-4`} />
                  </div>
                  <h3 className={`fs-5 fw-bold text-${group.color} m-0`}>{group.title}</h3>
                </div>
                <ListGroup variant="flush">
                  {group.items.map((item, idx) => (
                    <ListGroup.Item key={idx} className="border-0 px-0 d-flex align-items-center gap-2 small hover-translate-x" style={{ transition: '0.2s' }}>
                      <FaChevronRight size={10} className="text-secondary" /> {item}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Activities;
