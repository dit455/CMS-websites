import { Container } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';

const CmsPlaceholder = ({ section }) => (
  <Container className="py-5 my-3">
    <div style={{
      border: '2px dashed #cbd5e1',
      borderRadius: '1rem',
      padding: '3rem 2rem',
      textAlign: 'center',
      background: '#f8fafc',
      color: '#94a3b8',
    }}>
      <FaTools size={32} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
      <h5 style={{ color: '#64748b', marginBottom: '0.5rem' }}>{section}</h5>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>
        No content yet — go to <strong>CMS Admin</strong> and add <strong>{section}</strong> content for this site.
      </p>
    </div>
  </Container>
);

export default CmsPlaceholder;
