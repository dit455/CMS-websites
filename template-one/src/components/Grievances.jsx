import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaEnvelope,
  FaFileAlt,
  FaFileUpload,
  FaHeadset,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaUserTie,
} from 'react-icons/fa';
import {
  GRIEVANCE_REFERENCE_PREFIX,
  GRIEVANCE_STORAGE_KEY,
  MIN_GRIEVANCE_LENGTH,
} from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const BASE_RESOLVED_CASES = 11892;

const departmentOptions = [
  'Information Technology',
  'e-Governance',
  'Network Infrastructure',
  'Cyber Security',
  'Helpdesk & Portal Support',
];

const categoryOptions = [
  'Website Issue',
  'Service Delay',
  'Infrastructure',
  'Cyber Security',
  'General Complaint',
];

const workflowSteps = [
  { title: 'Submit', detail: 'Complaint registered', icon: FaPaperPlane },
  { title: 'Review', detail: 'Desk verification', icon: FaSearch },
  { title: 'Assign', detail: 'Officer mapped', icon: FaUserTie },
  { title: 'Action', detail: 'Resolution update', icon: FaClipboardList },
  { title: 'Resolve', detail: 'Citizen closure', icon: FaCheckCircle },
];

const trustIndicators = [
  { label: 'Reference ID for every submission', icon: FaFileAlt },
  { label: 'Evidence upload support', icon: FaShieldAlt },
  { label: 'Officer-level routing', icon: FaUserTie },
];

const initialFormData = {
  name: '',
  mobile: '',
  email: '',
  department: 'Information Technology',
  category: 'Website Issue',
  grievance: '',
  attachmentName: '',
};

const normalizeMobile = (value = '') => value.replace(/\D/g, '');

const formatIndianNumber = (value) => new Intl.NumberFormat('en-IN').format(value);

const loadStoredGrievances = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(GRIEVANCE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const createReferenceId = () => {
  const suffix = (() => {
    if (window.crypto?.getRandomValues) {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      return String((randomValues[0] % 9000) + 1000);
    }

    return String(Math.floor(Math.random() * 9000) + 1000);
  })();

  return `${GRIEVANCE_REFERENCE_PREFIX}-${new Date().getFullYear()}-${suffix}`;
};

const getExpectedResolution = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getMetricCards = (submittedCount) => [
  {
    value: '95%',
    label: 'Resolution Rate',
    detail: 'Cases closed within service standards',
    icon: FaCheckCircle,
  },
  {
    value: '4.2 days',
    label: 'Average Resolution Time',
    detail: 'Typical turnaround for routed requests',
    icon: FaClock,
  },
  {
    value: formatIndianNumber(BASE_RESOLVED_CASES + submittedCount),
    label: 'Complaints Resolved',
    detail: 'Citizen concerns addressed through the helpdesk',
    icon: FaClipboardList,
  },
];

const useGrievanceWorkflow = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [grievances, setGrievances] = useState(loadStoredGrievances);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [trackForm, setTrackForm] = useState({ reference: '', mobile: '' });
  const [trackResult, setTrackResult] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(GRIEVANCE_STORAGE_KEY, JSON.stringify(grievances));
  }, [grievances]);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSubmitMessage({ type: '', text: '' });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((current) => ({ ...current, attachmentName: '' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitMessage({ type: 'error', text: 'Attachment must be 5 MB or smaller.' });
      event.target.value = '';
      return;
    }

    setFormData((current) => ({ ...current, attachmentName: file.name }));
    setSubmitMessage({ type: '', text: '' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      department: formData.department,
      category: formData.category,
      grievance: formData.grievance.trim(),
      attachmentName: formData.attachmentName,
    };

    if (!trimmedData.name || !trimmedData.mobile || !trimmedData.email || !trimmedData.department || !trimmedData.category || !trimmedData.grievance) {
      setSubmitMessage({ type: 'error', text: 'Please complete every required field.' });
      return;
    }

    if (normalizeMobile(trimmedData.mobile).length !== 10) {
      setSubmitMessage({ type: 'error', text: 'Enter a valid 10 digit mobile number.' });
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

    const referenceId = createReferenceId();
    const nextRecord = {
      ...trimmedData,
      referenceId,
      status: 'Assigned',
      assignedTo: 'IT Support Officer',
      expectedResolution: getExpectedResolution(),
      progress: 80,
      submittedAt: new Date().toISOString(),
    };

    setGrievances((current) => [nextRecord, ...current]);
    setSubmitMessage({
      type: 'success',
      text: `Grievance captured successfully. Your reference ID is ${referenceId}.`,
    });
    setTrackForm({ reference: referenceId, mobile: trimmedData.mobile });
    setTrackResult({ type: 'found', record: nextRecord });
    setFormData(initialFormData);
  };

  const handleTrack = () => {
    const normalizedReference = trackForm.reference.trim();
    const normalizedMobile = normalizeMobile(trackForm.mobile);

    if (!normalizedReference || !normalizedMobile) {
      setTrackResult({ type: 'error', text: 'Enter both reference number and mobile number to track status.' });
      return;
    }

    if (normalizedMobile.length !== 10) {
      setTrackResult({ type: 'error', text: 'Enter a valid 10 digit mobile number.' });
      return;
    }

    const record = grievances.find((item) => (
      item.referenceId.toLowerCase() === normalizedReference.toLowerCase()
      && normalizeMobile(item.mobile) === normalizedMobile
    ));

    if (record) {
      setTrackResult({ type: 'found', record });
      return;
    }

    setTrackResult({
      type: 'error',
      text: `Reference ${normalizedReference} was not found for the provided mobile number.`,
    });
  };

  return {
    formData,
    grievances,
    submitMessage,
    trackForm,
    trackResult,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleTrack,
    resetForm,
    setSubmitMessage,
    setTrackForm,
  };
};

const TrackResultCard = ({ result }) => {
  if (!result) {
    return null;
  }

  if (result.type === 'error') {
    return <div className="form-feedback error mt-3" role="status">{result.text}</div>;
  }

  if (!result.record) {
    return null;
  }

  return (
    <div className="grievance-status-card" role="status">
      <span>Complaint ID</span>
      <strong>{result.record.referenceId}</strong>
      <div className="grievance-status-row">
        <span>Status</span>
        <b>{result.record.status}</b>
      </div>
      <div className="grievance-status-row">
        <span>Assigned To</span>
        <b>{result.record.assignedTo}</b>
      </div>
      <div className="grievance-status-row">
        <span>Expected Resolution</span>
        <b>{result.record.expectedResolution}</b>
      </div>
      <div className="grievance-progress-track" aria-label={`${result.record.progress}% complete`}>
        <span style={{ width: `${result.record.progress}%` }} />
      </div>
      <small>{result.record.progress}% progress</small>
    </div>
  );
};

const TrackStatusFields = ({
  idPrefix,
  trackForm,
  trackResult,
  onTrack,
  setTrackForm,
}) => (
  <Form
    className="grievance-track-form"
    onSubmit={(event) => {
      event.preventDefault();
      onTrack();
    }}
    noValidate
  >
    <Form.Group className="mb-3" controlId={`${idPrefix}-reference`}>
      <Form.Label className="small fw-bold text-secondary">Reference Number</Form.Label>
      <Form.Control
        type="text"
        placeholder={`${GRIEVANCE_REFERENCE_PREFIX}-2026-1234`}
        className="rounded-3 py-2 px-3 border-2 shadow-none"
        value={trackForm.reference}
        onChange={(event) => setTrackForm((current) => ({ ...current, reference: event.target.value }))}
        autoComplete="off"
        required
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId={`${idPrefix}-mobile`}>
      <Form.Label className="small fw-bold text-secondary">Mobile Number</Form.Label>
      <Form.Control
        type="tel"
        placeholder="9876543210"
        className="rounded-3 py-2 px-3 border-2 shadow-none"
        value={trackForm.mobile}
        onChange={(event) => setTrackForm((current) => ({ ...current, mobile: event.target.value }))}
        autoComplete="tel"
        required
      />
    </Form.Group>
    <Button
      type="submit"
      variant="outline-danger"
      className="w-100 rounded-pill py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-2"
    >
      <FaSearch size={13} aria-hidden="true" /> Track Status
    </Button>
    <TrackResultCard result={trackResult} />
  </Form>
);

const SubmitGrievanceCard = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  resetForm,
  submitMessage,
}) => (
  <Card className="grievance-form-card grievance-service-card border-0 shadow-soft">
    <Card.Body className="p-0">
      <div className="grievance-card-heading">
        <span>1</span>
        <div>
          <h2>Submit Complaint</h2>
          <p>Share issue details so the request can be routed to the correct team.</p>
        </div>
      </div>

      <Form className="grievance-form" onSubmit={handleSubmit} noValidate>
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
            <Form.Group className="mb-3" controlId="grievance-mobile">
              <Form.Label className="small fw-bold text-secondary">Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="9876543210"
                className="rounded-3 py-2 px-3 border-2 shadow-none"
                value={formData.mobile}
                onChange={handleChange('mobile')}
                autoComplete="tel"
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
          <Col md={6}>
            <Form.Group className="mb-3" controlId="grievance-department">
              <Form.Label className="small fw-bold text-secondary">Select Department</Form.Label>
              <Form.Select
                className="rounded-3 py-2 px-3 border-2 shadow-none"
                value={formData.department}
                onChange={handleChange('department')}
                required
              >
                {departmentOptions.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="grievance-category">
              <Form.Label className="small fw-bold text-secondary">Complaint Type</Form.Label>
              <Form.Select
                className="rounded-3 py-2 px-3 border-2 shadow-none"
                value={formData.category}
                onChange={handleChange('category')}
                required
              >
                {categoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="grievance-description">
          <Form.Label className="small fw-bold text-secondary">Grievance Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Please provide details about your concern..."
            className="rounded-3 py-2 px-3 border-2 shadow-none"
            value={formData.grievance}
            onChange={handleChange('grievance')}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="grievance-attachment">
          <Form.Label className="small fw-bold text-secondary">Upload Evidence</Form.Label>
          <label className="grievance-upload-box" htmlFor="grievance-attachment-input">
            <FaFileUpload size={18} aria-hidden="true" />
            <span>{formData.attachmentName || 'Choose PDF, JPG, or PNG file'}</span>
            <small>Max 5 MB</small>
          </label>
          <Form.Control
            id="grievance-attachment-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="visually-hidden"
            onChange={handleFileChange}
          />
        </Form.Group>

        <div className="grievance-action-row">
          <Button
            variant="danger"
            type="submit"
            className="rounded-pill px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-bold"
          >
            <FaPaperPlane size={14} aria-hidden="true" /> Submit Grievance
          </Button>
          <Button
            variant="outline-secondary"
            type="reset"
            className="rounded-pill px-4 py-2 fw-bold"
            onClick={resetForm}
          >
            Reset
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
);

const TrackComplaintCard = ({ trackForm, trackResult, handleTrack, setTrackForm }) => (
  <Card className="grievance-track-card grievance-service-card border-0 shadow-soft">
    <Card.Body className="p-0">
      <div className="grievance-card-heading compact">
        <span>2</span>
        <div>
          <h2>Track Complaint</h2>
          <p>Check assigned officer, status, progress, and expected resolution.</p>
        </div>
      </div>

      <TrackStatusFields
        idPrefix="grievance-track"
        trackForm={trackForm}
        trackResult={trackResult}
        onTrack={handleTrack}
        setTrackForm={setTrackForm}
      />

      <div className="grievance-track-help">
        <strong>Keep these details ready</strong>
        <ul>
          <li>Reference ID received after submission.</li>
          <li>Same mobile number used while lodging the complaint.</li>
          <li>Any supporting document shared with the helpdesk.</li>
        </ul>
      </div>
    </Card.Body>
  </Card>
);

const QuickHelpCard = ({ emailDisplay, site }) => (
  <Card className="grievance-help-card grievance-service-card border-0 shadow-soft">
    <Card.Body className="p-0">
      <div className="grievance-card-heading compact">
        <span>3</span>
        <div>
          <h2>Quick Help</h2>
          <p>Use assisted channels for urgent or guided filing.</p>
        </div>
      </div>

      <div className="grievance-help-list">
        <a href={`tel:${site.phoneCompact}`}>
          <FaPhoneAlt aria-hidden="true" />
          <span>
            <small>Helpdesk Line</small>
            <strong>{site.phone}</strong>
          </span>
        </a>
        <a href={`mailto:${site.helpdeskEmail}`}>
          <FaEnvelope aria-hidden="true" />
          <span>
            <small>Email Support</small>
            <strong>{emailDisplay}</strong>
          </span>
        </a>
        <div>
          <FaBuilding aria-hidden="true" />
          <span>
            <small>Office Hours</small>
            <strong>09:00 AM - 05:45 PM</strong>
          </span>
        </div>
        <div>
          <FaUserTie aria-hidden="true" />
          <span>
            <small>Escalation Contact</small>
            <strong>{site.webInformationManager}</strong>
          </span>
        </div>
      </div>

      <div className="grievance-help-note">
        <strong>Filing checklist</strong>
        <ul>
          <li>Choose the closest complaint type for faster routing.</li>
          <li>Add screenshots or documents when available.</li>
          <li>Mention dates, service names, and error messages clearly.</li>
        </ul>
      </div>
    </Card.Body>
  </Card>
);

const GrievanceWorkflowTimeline = () => (
  <div className="grievance-workflow-timeline" aria-label="Grievance workflow timeline">
    <div className="grievance-workflow-heading">
      <span className="section-kicker">Workflow</span>
      <h3>Transparent processing from submission to closure</h3>
    </div>
    <div className="grievance-workflow-steps">
      {workflowSteps.map((step, index) => {
        const StepIcon = step.icon;
        return (
          <div className="grievance-workflow-step" key={step.title}>
            <span className="grievance-workflow-icon">
              <StepIcon size={16} aria-hidden="true" />
            </span>
            <strong>{step.title}</strong>
            <small>{step.detail}</small>
            <b>{String(index + 1).padStart(2, '0')}</b>
          </div>
        );
      })}
    </div>
  </div>
);

const ContactSection = ({ emailDisplay, mapEmbedUrl, mapOpenUrl, site }) => (
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
            <FaMapMarkerAlt size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="h5 fw-bold mb-2">Visit Us</h3>
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
            <FaEnvelope size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="h5 fw-bold mb-2">Email Us</h3>
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
            <FaPhoneAlt size={24} aria-hidden="true" />
          </div>
          <div>
            <h3 className="h5 fw-bold mb-2">Call Us</h3>
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
          <FaMapMarkerAlt className="text-danger me-1" aria-hidden="true" /> {site.officeName}
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
);

const useContactDetails = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;
  const mapQuery = encodeURIComponent(`${site.officeName}, ${site.address}`);

  return {
    emailDisplay,
    mapEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&z=17&output=embed`,
    mapOpenUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    site,
  };
};

const Grievances = () => {
  const contact = useContactDetails();
  const {
    grievances,
    handleTrack,
    setTrackForm,
    trackForm,
    trackResult,
  } = useGrievanceWorkflow();
  const [showTrackModal, setShowTrackModal] = useState(false);
  const metricCards = useMemo(() => getMetricCards(grievances.length), [grievances.length]);

  return (
    <Container id="grievances" className="grievance-section grievance-promo-section py-5 my-3">
      <section className="grievance-promo-shell" aria-labelledby="grievance-promo-title">
        <div className="grievance-promo-grid">
          <div className="grievance-promo-copy">
            <span className="section-kicker">Public Grievance Redressal</span>
            <h2 id="grievance-promo-title">
              A simpler, accountable path for IT service complaints.
            </h2>
            <p>
              Lodge concerns with the Directorate of Information Technology, receive a reference
              number, and track progress through a transparent resolution workflow.
            </p>

            <div className="grievance-promo-visual-row">
              <div className="grievance-illustration-card" aria-hidden="true">
                <span className="grievance-illustration-badge">DIT</span>
                <div className="grievance-illustration-document">
                  <FaFileAlt size={34} />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="grievance-illustration-seal">
                  <FaShieldAlt size={24} />
                </div>
              </div>

              <div className="grievance-trust-list" aria-label="Trust indicators">
                {trustIndicators.map((item) => {
                  const TrustIcon = item.icon;
                  return (
                    <span key={item.label}>
                      <TrustIcon size={14} aria-hidden="true" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grievance-promo-stats" aria-label="Grievance performance statistics">
              {metricCards.map((metric) => {
                const MetricIcon = metric.icon;
                return (
                  <div className="grievance-promo-stat" key={metric.label}>
                    <span>
                      <MetricIcon size={16} aria-hidden="true" />
                    </span>
                    <strong>{metric.value}</strong>
                    <b>{metric.label}</b>
                    <small>{metric.detail}</small>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="grievance-cta-panel" aria-labelledby="grievance-actions-title">
            <span className="grievance-cta-kicker">Citizen Service Desk</span>
            <h3 id="grievance-actions-title">Start or track your complaint</h3>
            <p>
              Use the dedicated grievance portal for detailed submission, evidence upload, and
              routed departmental handling.
            </p>
            <div className="grievance-cta-actions">
              <Button
                as="a"
                href="#grievance-portal"
                variant="danger"
                className="grievance-cta-button primary"
                aria-label="Lodge grievance in the dedicated grievance portal"
              >
                <FaPaperPlane aria-hidden="true" />
                Lodge Grievance
                <FaArrowRight aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline-danger"
                className="grievance-cta-button secondary"
                onClick={() => setShowTrackModal(true)}
                aria-haspopup="dialog"
              >
                <FaSearch aria-hidden="true" />
                Track Status
              </Button>
            </div>
            <div className="grievance-cta-support">
              <a href={`tel:${contact.site.phoneCompact}`}>
                <FaHeadset aria-hidden="true" />
                <span>
                  <small>Helpdesk</small>
                  <strong>{contact.site.phone}</strong>
                </span>
              </a>
              <a href={`mailto:${contact.site.helpdeskEmail}`}>
                <FaEnvelope aria-hidden="true" />
                <span>
                  <small>Email</small>
                  <strong>{contact.emailDisplay}</strong>
                </span>
              </a>
            </div>
          </aside>
        </div>

        <GrievanceWorkflowTimeline />
      </section>

      <Modal
        show={showTrackModal}
        onHide={() => setShowTrackModal(false)}
        centered
        dialogClassName="grievance-track-modal"
        aria-labelledby="grievance-track-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="grievance-track-modal-title">Track Grievance Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-secondary small mb-4">
            Enter the complaint reference number and the mobile number used while lodging the
            grievance.
          </p>
          <TrackStatusFields
            idPrefix="grievance-modal-track"
            trackForm={trackForm}
            trackResult={trackResult}
            onTrack={handleTrack}
            setTrackForm={setTrackForm}
          />
        </Modal.Body>
      </Modal>

      <ContactSection {...contact} />
    </Container>
  );
};

export const GrievancePortalPage = () => {
  const contact = useContactDetails();
  const workflow = useGrievanceWorkflow();

  return (
    <Container className="grievance-section grievance-portal-page py-5">
      <div className="grievance-page-hero">
        <a href="#grievances" className="detail-back-link">Back to homepage</a>
        <span className="section-kicker">Dedicated Portal</span>
        <h1>Public Grievance Redressal</h1>
        <p>
          Submit IT service grievances with department routing, complaint type selection, evidence
          upload, reference generation, and status tracking.
        </p>
      </div>

      <Row className="g-3 grievance-card-grid">
        <Col xl={7} lg={12}>
          <SubmitGrievanceCard
            formData={workflow.formData}
            handleChange={workflow.handleChange}
            handleFileChange={workflow.handleFileChange}
            handleSubmit={workflow.handleSubmit}
            resetForm={workflow.resetForm}
            submitMessage={workflow.submitMessage}
          />
        </Col>
        <Col xl={5} lg={12}>
          <div className="grievance-portal-side-grid">
            <TrackComplaintCard
              trackForm={workflow.trackForm}
              trackResult={workflow.trackResult}
              handleTrack={workflow.handleTrack}
              setTrackForm={workflow.setTrackForm}
            />
            <QuickHelpCard emailDisplay={contact.emailDisplay} site={contact.site} />
          </div>
        </Col>
      </Row>

      <GrievanceWorkflowTimeline />
      <ContactSection {...contact} />
    </Container>
  );
};

export default Grievances;
