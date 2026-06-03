import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const MotionDiv = motion.div;

const getFileIcon = (type = '') => {
  const t = type.toUpperCase();
  if (t === 'PDF')  return <FaFilePdf size={22} />;
  if (t === 'DOC' || t === 'DOCX') return <FaFileWord size={22} />;
  if (t === 'XLS' || t === 'XLSX') return <FaFileExcel size={22} />;
  return <FaFileAlt size={22} />;
};

const getFileColour = (type = '') => {
  const t = type.toUpperCase();
  if (t === 'PDF')  return '#EF4444';
  if (t === 'DOC' || t === 'DOCX') return '#3B82F6';
  if (t === 'XLS' || t === 'XLSX') return '#10B981';
  return '#6B7280';
};

const Downloads = () => {
  const { content } = useSiteContent();
  const downloads = content.downloads || [];

  if (!downloads.length) return null;

  return (
    <Container id="downloads" className="py-5 my-3">
      <div className="text-center mb-5">
        <span className="section-kicker">Resources</span>
        <h2 className="display-6 fw-bold mb-2 mt-3">Downloads</h2>
        <div className="bg-danger mx-auto mb-4" style={{ height: '3px', width: '80px' }} />
        <p className="section-intro mx-auto">
          Download forms, guidelines, circulars and other official documents.
        </p>
      </div>

      <Row className="g-4 justify-content-center">
        {downloads.map((item, i) => {
          const colour = getFileColour(item.type);
          return (
            <Col key={item.id} sm={6} lg={4}>
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column"
                style={{ borderTop: `4px solid ${colour}` }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 48, height: 48, background: `${colour}18`, color: colour }}
                  >
                    {getFileIcon(item.type)}
                  </div>
                  <div>
                    <Badge pill style={{ background: colour, fontSize: 10 }}>{item.type}</Badge>
                    {item.category && (
                      <Badge bg="light" text="dark" pill className="ms-1 border" style={{ fontSize: 10 }}>
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-2">{item.title}</h6>

                {item.desc && (
                  <p className="text-secondary small mb-3 flex-grow-1">{item.desc}</p>
                )}

                {item.meta && (
                  <p className="text-muted small mb-3">{item.meta}</p>
                )}

                <div className="mt-auto">
                  {item.fileUrl ? (
                    <Button
                      as="a"
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2"
                    >
                      <FaDownload size={12} /> Download
                    </Button>
                  ) : (
                    <span className="text-muted small">File not available</span>
                  )}
                </div>
              </MotionDiv>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Downloads;
