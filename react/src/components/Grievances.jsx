import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaSearch, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock } from 'react-icons/fa';
import {
  GRIEVANCE_REFERENCE_PREFIX,
  GRIEVANCE_STORAGE_KEY,
  MIN_GRIEVANCE_LENGTH,
} from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const loadStoredGrievances = () => {
  try {
    const stored = window.localStorage.getItem(GRIEVANCE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const createReferenceId = () => {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  const suffix = String((randomValues[0] % 9000) + 1000);
  return `${GRIEVANCE_REFERENCE_PREFIX}-${new Date().getFullYear()}-${suffix}`;
};

const Grievances = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;
  const mapQuery = encodeURIComponent(`${site.officeName}, ${site.address}`);
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&z=17&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const [formData, setFormData] = useState({ name: '', email: '', grievance: '' });
  const [grievances, setGrievances] = useState(loadStoredGrievances);
  const [referenceId, setReferenceId] = useState('');
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingMessage, setTrackingMessage] = useState('');

  useEffect(() => {
    window.localStorage.setItem(GRIEVANCE_STORAGE_KEY, JSON.stringify(grievances));
  }, [grievances]);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      grievance: formData.grievance.trim(),
    };

    if (!trimmedData.name || !trimmedData.email || !trimmedData.grievance) {
      setSubmitMessage({ type: 'error', text: 'Please complete every required field.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedData.email)) {
      setSubmitMessage({ type: 'error', text: 'Enter a valid email address.' });
      return;
    }

    if (trimmedData.grievance.length < MIN_GRIEVANCE_LENGTH) {
      setSubmitMessage({
        type: 'error',
        text: `Please add at least ${MIN_GRIEVANCE_LENGTH} characters describing the grievance.`,
      });
      return;
    }

    const nextReference = createReferenceId();
    const nextRecord = {
      ...trimmedData,
      referenceId: nextReference,
      status: 'Submitted successfully and awaiting review',
      submittedAt: new Date().toISOString(),
    };

    setGrievances((current) => [nextRecord, ...current]);
    setReferenceId(nextReference);
    setSubmitMessage({
      type: 'success',
      text: `Grievance captured successfully. Your reference ID is ${nextReference}.`,
    });
    setTrackingInput(nextReference);
    setTrackingMessage(`Status for ${nextReference}: Submitted successfully and awaiting review.`);
    setFormData({ name: '', email: '', grievance: '' });
  };

  const handleTrack = () => {
    const normalized = trackingInput.trim();
    if (!normalized) {
      setTrackingMessage('Enter a grievance reference ID to track its status.');
      return;
    }

    const record = grievances.find((item) => item.referenceId.toLowerCase() === normalized.toLowerCase());

    if (record || normalized === referenceId) {
      setTrackingMessage(`Status for ${normalized}: ${record?.status || 'Submitted successfully and awaiting review'}.`);
      return;
    }

    setTrackingMessage(
      `Reference ${normalized} was not found. Please verify the ID and try again.`,
    );
  };

  return (
    <Container id="grievances" className="py-5 my-3">
      <Row className="g-4">
        <Col lg={7}>
          <div className="mb-4">
            <span className="section-kicker">Support Desk</span>
            <h2 className="display-6 fw-bold mb-2 mt-3">Public Grievance Redressal</h2>
            <div className="bg-danger mb-4" style={{ height: '3px', width: '80px' }} />
            <p className="text-secondary">
              We are committed to providing efficient and transparent services. Please use the form
              below to submit your grievances or feedback related to IT services in Puducherry.
            </p>
          </div>

          <Card className="border-0 shadow-soft rounded-4 p-4">
            <Card.Body className="p-0">
              <Form onSubmit={handleSubmit} noValidate>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="grievance-name">
                      <Form.Label className="small fw-bold text-secondary">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        className="rounded-3 py-2 px-3 border-2 shadow-none"
                        value={formData.name}
                        onChange={handleChange('name')}
                        autoComplete="name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="grievance-email">
                      <Form.Label className="small fw-bold text-secondary">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="john@example.com"
                        className="rounded-3 py-2 px-3 border-2 shadow-none"
                        value={formData.email}
                        onChange={handleChange('email')}
                        autoComplete="email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4" controlId="grievance-description">
                  <Form.Label className="small fw-bold text-secondary">
                    Description of Grievance
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Please provide details about your concern..."
                    className="rounded-3 py-2 px-3 border-2 shadow-none"
                    value={formData.grievance}
                    onChange={handleChange('grievance')}
                    required
                  />
                </Form.Group>
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    variant="danger"
                    type="submit"
                    className="rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 fw-bold"
                  >
                    <FaPaperPlane size={14} /> SUBMIT GRIEVANCE
                  </Button>
                  <Button
                    variant="outline-secondary"
                    type="reset"
                    className="rounded-pill px-4 py-2 fw-bold"
                    onClick={() => {
                      setFormData({ name: '', email: '', grievance: '' });
                      setSubmitMessage({ type: '', text: '' });
                    }}
                  >
                    RESET
                  </Button>
                </div>
                {submitMessage.text && (
                  <div className={`form-feedback ${submitMessage.type} mt-4`} role="status">
                    {submitMessage.text}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <div className="mb-4">
            <h3 className="fs-4 fw-bold mb-3 d-flex align-items-center gap-2">
              <FaSearch className="text-danger" size={20} /> Track Status
            </h3>
            <Card className="border-0 shadow-soft rounded-4 p-4 mb-4">
              <Card.Body className="p-0">
                <p className="text-secondary small mb-4">
                  Already submitted a grievance? Enter your reference ID below to check its current
                  status.
                </p>
                <Form.Control
                  type="text"
                  placeholder="GRI-2026-XXXX"
                  aria-label="Grievance reference ID"
                  className="rounded-pill py-2 px-4 border-2 shadow-none mb-3"
                  value={trackingInput}
                  onChange={(event) => setTrackingInput(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline-danger"
                  className="w-100 rounded-pill py-2 fw-bold"
                  onClick={handleTrack}
                >
                  TRACK NOW
                </Button>
                {trackingMessage && <div className="form-feedback mt-3">{trackingMessage}</div>}
              </Card.Body>
            </Card>

            <h3 className="fs-4 fw-bold mb-3 d-flex align-items-center gap-2">
              <FaClock className="text-danger" size={20} /> Working Hours
            </h3>
            <Card className="border-0 shadow-soft rounded-4 p-4">
              <Card.Body className="p-0 small text-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <span>Monday - Friday:</span>
                  <span className="fw-bold text-dark">09:00 AM - 05:45 PM</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Lunch Break:</span>
                  <span className="fw-bold text-dark">01:00 PM - 02:00 PM</span>
                </div>
                <hr />
                <p className="m-0 fst-italic">Closed on Saturdays, Sundays and Public Holidays.</p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <div id="contact" className="mt-5 pt-4">
        <div className="text-center mb-5">
          <span className="section-kicker">Contact</span>
          <h2 className="display-6 fw-bold mb-2 mt-3">Connect With Us</h2>
          <div className="bg-danger mx-auto" style={{ height: '3px', width: '80px' }} />
        </div>

        <Row className="g-4">
          <Col lg={4}>
            <div className="d-flex align-items-start gap-3 bg-white p-4 rounded-4 shadow-soft h-100 lift-on-hover">
              <div
                className="p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(59,130,246,0.12)',
                  color: '#3B82F6',
                  width: '56px',
                  height: '56px',
                }}
              >
                <FaMapMarkerAlt size={24} />
              </div>
              <div>
                <h5 className="fw-bold mb-2">Visit Us</h5>
                <p className="text-secondary small m-0 lh-lg">
                  {site.officeName}
                  <br />
                  {site.address}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="d-flex align-items-start gap-3 bg-white p-4 rounded-4 shadow-soft h-100 lift-on-hover">
              <div
                className="p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(79,70,229,0.12)',
                  color: '#4F46E5',
                  width: '56px',
                  height: '56px',
                }}
              >
                <FaEnvelope size={24} />
              </div>
              <div>
                <h5 className="fw-bold mb-2">Email Us</h5>
                <p className="text-secondary small m-0 lh-lg">
                  For official queries:
                  <br />
                  <a
                    href={`mailto:${site.helpdeskEmail}`}
                    className="text-danger text-decoration-none fw-bold"
                  >
                    {emailDisplay}
                  </a>
                </p>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="d-flex align-items-start gap-3 bg-white p-4 rounded-4 shadow-soft h-100 lift-on-hover">
              <div
                className="p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(16,185,129,0.12)',
                  color: '#10B981',
                  width: '56px',
                  height: '56px',
                }}
              >
                <FaPhoneAlt size={24} />
              </div>
              <div>
                <h5 className="fw-bold mb-2">Call Us</h5>
                <p className="text-secondary small m-0 lh-lg">
                  Helpdesk Support Line:
                  <br />
                  <span className="text-dark fw-bold">{site.phone}</span>
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Card className="border-0 shadow-soft rounded-4 overflow-hidden mt-4" style={{ height: '350px' }}>
          <iframe
            title="Directorate Of Information Technology location map"
            src={mapEmbedUrl}
            className="h-100 w-100 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="position-absolute bottom-0 start-0 p-3 bg-white bg-opacity-90 m-3 rounded-3 shadow-sm border border-light">
            <p className="m-0 small fw-bold">
              <FaMapMarkerAlt className="text-danger me-1" /> {site.officeName}
            </p>
            <a
              href={mapOpenUrl}
              target="_blank"
              rel="noreferrer"
              className="small text-danger text-decoration-none fw-semibold"
            >
              Open in Google Maps
            </a>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default Grievances;
