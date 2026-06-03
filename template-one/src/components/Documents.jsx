import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaFilePdf,
  FaFileSignature,
  FaFileAlt,
  FaFileContract,
  FaFileInvoice,
  FaFolderOpen,
} from 'react-icons/fa';
import { DOCUMENT_CATEGORIES, DOCUMENT_UNAVAILABLE_MESSAGE } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const MotionDiv = motion.div;

const getDocumentIcon = (category) => {
  switch (category) {
    case 'Guidelines':
      return <FaFileContract size={24} />;
    case 'Orders':
      return <FaFileSignature size={24} />;
    case 'Templates':
      return <FaFileAlt size={24} />;
    case 'Reports':
      return <FaFileInvoice size={24} />;
    case 'Tenders':
      return <FaFileContract size={24} />;
    default:
      return <FaFilePdf size={24} />;
  }
};

const getCategoryStyles = (category) => {
  switch (category) {
    case 'Guidelines':
      return { iconBg: 'rgba(59,130,246,0.12)', iconColor: '#3B82F6', textClass: 'text-primary' };
    case 'Orders':
      return { iconBg: 'rgba(79,70,229,0.12)', iconColor: '#4F46E5', textClass: 'text-danger' };
    case 'Templates':
      return { iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10B981', textClass: 'text-success' };
    case 'Reports':
      return { iconBg: 'rgba(124,58,237,0.12)', iconColor: '#7C3AED', textClass: 'text-warning' };
    case 'Tenders':
      return { iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10B981', textClass: 'text-success' };
    default:
      return { iconBg: 'rgba(108,117,125,0.12)', iconColor: '#6c757d', textClass: 'text-secondary' };
  }
};

const defaultDocumentSizes = {
  'CSC Registration Template v2.1': '128 KB',
  'State IT Policy - 2024 (Official)': '1.8 MB',
  'Digital Literacy Campaign Report': '3.2 MB',
  'IT Procurement Tender Reference': '760 KB',
};

const fileSizePattern = /^\d+(?:\.\d+)?\s*(?:B|KB|MB|GB)$/i;

const getDocumentFileSize = (doc) => {
  const candidate = String(doc.fileSize || doc.meta || '').trim();
  if (fileSizePattern.test(candidate)) return candidate.replace(/\s+/g, ' ');
  return defaultDocumentSizes[doc.title] || 'N/A';
};

const Documents = () => {
  const { content } = useSiteContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [showAllDocuments, setShowAllDocuments] = useState(false);

  const filteredDocs = content.documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' || doc.category === category;
    return matchesSearch && matchesCategory;
  });
  const previewDocs = content.documents.slice(0, 3);
  const visibleCards = showAllDocuments ? [] : previewDocs;

  const handleDocumentAction = (doc, action) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setActionMessage(`${action} unavailable for "${doc.title}". ${DOCUMENT_UNAVAILABLE_MESSAGE}`);
  };

  return (
    <Container id="documents" className="py-5 my-3">
      <div className="text-center mb-5">
        <span className="section-kicker">Resource Centre</span>
        <h2 className="display-6 fw-bold mb-2 mt-3">Policies, orders, and downloadable forms</h2>
        <div className="bg-danger mx-auto mb-4" style={{ height: '3px', width: '80px' }} />
        <p className="section-intro mx-auto">
          Search policy documents, implementation orders, citizen-facing templates, and
          downloadable reference material from one place.
        </p>

        {showAllDocuments && (
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <Row className="g-3">
                  <Col md={7}>
                    <InputGroup className="border rounded-pill overflow-hidden ps-2 bg-light">
                      <InputGroup.Text className="bg-transparent border-0 text-secondary pe-0">
                        <FaSearch size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search documents by title..."
                        aria-label="Search documents by title"
                        className="border-0 shadow-none ps-3 bg-transparent"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={5}>
                    <InputGroup className="border rounded-pill overflow-hidden ps-2 bg-light">
                      <InputGroup.Text className="bg-transparent border-0 text-secondary pe-0">
                        <FaFilter size={16} />
                      </InputGroup.Text>
                      <Form.Select
                        className="border-0 shadow-none ps-3 bg-transparent"
                        aria-label="Filter documents by category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                      >
                        <option value="">All Categories</option>
                        {DOCUMENT_CATEGORIES.map((categoryOption) => (
                          <option key={categoryOption} value={categoryOption}>
                            {categoryOption}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}

        <div className="resource-summary mt-4">
          <span>
            {showAllDocuments
              ? `${filteredDocs.length} resources visible`
              : `${visibleCards.length} featured resources`}
          </span>
          <span>{showAllDocuments ? `Categories: ${DOCUMENT_CATEGORIES.join(', ')}` : 'Open full table for every document'}</span>
        </div>
        {actionMessage && (
          <div className="form-feedback info mt-3 mx-auto" role="status">
            {actionMessage}
          </div>
        )}
      </div>

      {!showAllDocuments ? (
        <>
          <Row className="g-4">
            <AnimatePresence mode="popLayout">
              {visibleCards.map((doc) => {
                const styles = getCategoryStyles(doc.category);
                return (
                  <Col key={doc.id} md={6} lg={4}>
                    <MotionDiv
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="h-100"
                    >
                      <Card
                        className="document-card h-100 border-0 shadow-sm rounded-4 p-4 lift-on-hover transition-all"
                        style={{ borderTop: `4px solid ${styles.iconColor}` }}
                      >
                        <Card.Body className="d-flex flex-column p-0">
                          <div className="d-flex justify-content-between align-items-start mb-4">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: styles.iconBg,
                                color: styles.iconColor,
                                width: '56px',
                                height: '56px',
                              }}
                            >
                              {getDocumentIcon(doc.category)}
                            </div>
                            <span className="badge rounded-pill bg-white border border-light shadow-sm text-dark py-2 px-3 small fw-semibold">
                              {doc.category}
                            </span>
                          </div>
                          <Card.Title className="fw-bold fs-5 mb-3 text-dark lh-sm" style={{ minHeight: '48px' }}>
                            {doc.title}
                          </Card.Title>
                          <Card.Text
                            className="text-secondary small mb-4 flex-grow-1"
                            style={{ fontSize: '0.9rem', lineHeight: '1.6' }}
                          >
                            {doc.desc}
                          </Card.Text>
                          <div className="document-meta-row mb-4">
                            <span>{doc.type}</span>
                            <span>{getDocumentFileSize(doc)}</span>
                          </div>
                          <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top border-light">
                            <Button
                              type="button"
                              variant="outline-dark"
                              size="sm"
                              className="rounded-pill px-4 py-2 hover-bg-dark d-flex align-items-center gap-2 small fw-bold transition-all"
                              onClick={() => handleDocumentAction(doc, 'Download')}
                            >
                              <FaDownload size={12} /> DOWNLOAD
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className={`${styles.textClass} fw-bold text-decoration-none d-flex align-items-center gap-2 p-0 hover-opacity-75 transition-all`}
                              onClick={() => handleDocumentAction(doc, 'View')}
                            >
                              <FaEye size={16} /> VIEW
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </MotionDiv>
                  </Col>
                );
              })}
            </AnimatePresence>
          </Row>

          {content.documents.length > 3 && (
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="danger"
                className="rounded-pill px-4 py-2 fw-bold"
                onClick={() => setShowAllDocuments(true)}
              >
                View all documents
              </Button>
            </div>
          )}
        </>
      ) : (
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="document-table-panel rounded-4 shadow-soft"
        >
          <div className="document-table-toolbar">
            <div>
              <h3 className="fs-5 fw-bold mb-1">All documents</h3>
              <p className="text-secondary small mb-0">Filename, description, file type, size, and download action.</p>
            </div>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              className="rounded-pill px-3 fw-bold"
              onClick={() => {
                setShowAllDocuments(false);
                setSearchTerm('');
                setCategory('');
              }}
            >
              Show thumbnails
            </Button>
          </div>

          <div className="table-responsive">
            <table className="document-table mb-0">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Description</th>
                  <th>File type</th>
                  <th>File size</th>
                  <th className="text-end">Download</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => {
                  const styles = getCategoryStyles(doc.category);
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className="document-file-cell">
                          <span
                            className="document-file-icon"
                            style={{ backgroundColor: styles.iconBg, color: styles.iconColor }}
                          >
                            {getDocumentIcon(doc.category)}
                          </span>
                          <div>
                            <strong>{doc.title}</strong>
                            <span>{doc.category}</span>
                          </div>
                        </div>
                      </td>
                      <td>{doc.desc}</td>
                      <td>
                        <span className="document-table-pill">{doc.type}</span>
                      </td>
                      <td>{getDocumentFileSize(doc)}</td>
                      <td className="text-end">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          className="rounded-pill px-3 d-inline-flex align-items-center gap-2 fw-bold"
                          onClick={() => handleDocumentAction(doc, 'Download')}
                        >
                          <FaDownload size={12} /> Download
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredDocs.length === 0 && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-secondary py-5"
            >
              <div className="fs-1 mb-3 text-danger">
                <FaFolderOpen />
              </div>
              <h5 className="fw-bold text-dark">No documents found</h5>
              <p className="m-0">Try adjusting your search or filter criteria.</p>
            </MotionDiv>
          )}
        </MotionDiv>
      )}
    </Container>
  );
};

export default Documents;
