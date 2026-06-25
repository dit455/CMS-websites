import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const toParagraphs = (text) =>
  (text || '').split(/\n\n+/).map(s => s.trim()).filter(Boolean);

const OverviewDetailPage = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const paragraphs = toParagraphs(site.overviewDescription);

  return (
    <Container className="py-5 my-3" style={{ maxWidth: '780px' }}>

      <Button
        as="a"
        href="#"
        variant="outline-secondary"
        size="sm"
        className="rounded-pill px-3 mb-4 d-inline-flex align-items-center gap-2"
        onClick={(e) => { e.preventDefault(); window.history.back(); }}
      >
        <FaArrowLeft size={12} /> Back
      </Button>

      <span className="section-kicker d-block mb-2">Department Overview</span>
      <h1 className="fw-bold mb-4">{site.departmentName}</h1>

      <div style={{ lineHeight: '1.85', fontSize: '1.05rem', color: '#374151' }}>
        {paragraphs.map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>

      {site.governmentName && (
        <p className="mt-5 text-secondary small fw-semibold">
          — {site.governmentName}
        </p>
      )}
    </Container>
  );
};

export default OverviewDetailPage;
