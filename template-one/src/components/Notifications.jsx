import { useState } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaBell, FaPaperclip, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const MotionDiv = motion.div;

const Notifications = () => {
  const { content } = useSiteContent();
  const [showAll, setShowAll] = useState(false);

  const notifications = content.notifications || [];
  const visible = showAll ? notifications : notifications.slice(0, 5);

  if (!notifications.length) return null;

  return (
    <Container id="notifications" className="py-5 my-3">
      <div className="text-center mb-5">
        <span className="section-kicker">Latest Updates</span>
        <h2 className="display-6 fw-bold mb-2 mt-3">Notifications &amp; Announcements</h2>
        <div className="bg-danger mx-auto mb-4" style={{ height: '3px', width: '80px' }} />
      </div>

      <Row className="justify-content-center">
        <Col lg={9}>
          {visible.map((n, i) => (
            <MotionDiv
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="d-flex gap-3 align-items-start bg-white rounded-4 shadow-sm p-4 mb-3"
              style={{ borderLeft: `4px solid ${n.isImportant ? '#EF4444' : '#3B82F6'}` }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 44, height: 44,
                  background: n.isImportant ? 'rgba(239,68,68,.1)' : 'rgba(59,130,246,.1)',
                  color: n.isImportant ? '#EF4444' : '#3B82F6',
                }}
              >
                {n.isImportant ? <FaExclamationCircle size={18} /> : <FaBell size={18} />}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap mb-1">
                  <h6 className="fw-bold mb-0 text-dark">{n.title}</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {n.isImportant && <Badge bg="danger" pill>Important</Badge>}
                    {n.category && <Badge bg="light" text="dark" pill className="border">{n.category}</Badge>}
                  </div>
                </div>

                {n.description && (
                  <p className="text-secondary small mb-2">{n.description}</p>
                )}

                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {n.publishDate && (
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FaCalendarAlt size={12} /> {n.publishDate}
                    </span>
                  )}
                  {n.attachmentUrl && (
                    <a
                      href={n.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary small fw-semibold d-flex align-items-center gap-1 text-decoration-none"
                    >
                      <FaPaperclip size={12} /> View Attachment
                    </a>
                  )}
                </div>
              </div>
            </MotionDiv>
          ))}

          {notifications.length > 5 && (
            <div className="text-center mt-3">
              <Button
                variant={showAll ? 'outline-secondary' : 'danger'}
                className="rounded-pill px-4 fw-bold"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `View All (${notifications.length})`}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;
