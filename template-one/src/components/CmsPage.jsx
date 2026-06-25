/**
 * Generic renderer for CMS-driven static pages (Django app: custom_pages).
 * Works for ANY site, ANY slug — no per-page code needed.
 *
 * Triggered by a hash like '#page-transport-schedule'. The slug after
 * '#page-' is looked up via /api/pages/<slug>/?site=<key>.
 */
import { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE, SITE_KEY } from '../services/cmsApi';

const CmsPage = ({ slug }) => {
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    let cancelled = false;
    const sep = SITE_KEY ? `?site=${encodeURIComponent(SITE_KEY)}` : '';
    fetch(`${API_BASE}/pages/${slug}/${sep}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => { if (!cancelled) { setPage(data); setStatus('ok'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <Container className="py-5 my-3" style={{ maxWidth: '900px' }}>
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

      {status === 'loading' && (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      )}

      {status === 'error' && (
        <div className="text-secondary">This page is not available yet.</div>
      )}

      {status === 'ok' && page && (
        <>
          <h1 className="fw-bold mb-4">{page.title}</h1>
          <div
            className="cms-page-content"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </>
      )}
    </Container>
  );
};

export default CmsPage;
