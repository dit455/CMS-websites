import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCogs,
  FaFileAlt,
  FaBell,
  FaComments,
  FaHome,
  FaArrowUp,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaFileContract,
  FaGavel,
} from 'react-icons/fa';
import {
  EXTERNAL_GOVERNMENT_PORTALS,
  FOOTER_LINKS,
  MANDATORY_FOOTER_LINKS,
  SOCIAL_LINKS,
} from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useSiteContent();
  const { site } = content;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;

  const socialIcons = {
    Facebook: <FaFacebookF size={14} />,
    Twitter: <FaTwitter size={14} />,
    YouTube: <FaYoutube size={15} />,
    LinkedIn: <FaLinkedinIn size={14} />,
  };

  const handleSubscribe = (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage('Enter an email address to subscribe for updates.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage('Enter a valid email address.');
      return;
    }

    setMessage(`Thanks. ${cleanEmail} has been noted for future update alerts.`);
    setEmail('');
  };

  const getNavIcon = (link) => {
    switch (link) {
      case 'About Us':
        return <FaInfoCircle size={12} className="text-danger" />;
      case 'Home':
        return <FaHome size={12} className="text-danger" />;
      case 'Services':
        return <FaCogs size={12} className="text-danger" />;
      case 'Resource Centre':
        return <FaFileAlt size={12} className="text-danger" />;
      case 'Notifications':
        return <FaBell size={12} className="text-danger" />;
      case 'Tenders':
        return <FaFileContract size={12} className="text-danger" />;
      case 'RTI':
        return <FaGavel size={12} className="text-danger" />;
      case 'Grievance Portal':
        return <FaComments size={12} className="text-danger" />;
      case 'Contact Us':
        return <FaEnvelope size={12} className="text-danger" />;
      default:
        return <FaInfoCircle size={12} className="text-danger" />;
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', window.location.pathname);
  };

  const getFooterAnchorId = (href) => {
    if (!href.startsWith('#')) return undefined;
    if (['#contact', '#grievances', '#web-information-manager'].includes(href)) return undefined;
    return href.slice(1);
  };

  return (
    <footer className="site-footer text-white mt-4 position-relative overflow-hidden">
      <Container className="footer-shell position-relative">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <span className="footer-kicker">{site.governmentName}</span>
            <h4>{site.departmentName}</h4>
            <p>
              {site.footerDescription}
            </p>
          </div>

          <div className="footer-contact-card" aria-label="Department contact details">
            <a href={`tel:${site.phoneCompact}`} className="footer-contact-pill">
              <FaPhoneAlt aria-hidden="true" />
              <span>{site.phone}</span>
            </a>
            <a href={`mailto:${site.helpdeskEmail}`} className="footer-contact-pill">
              <FaEnvelope aria-hidden="true" />
              <span>{emailDisplay}</span>
            </a>
            {SOCIAL_LINKS.length > 0 && (
              <div className="footer-social-row">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-social-link"
                    aria-label={link.label}
                    title={link.label}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {socialIcons[link.label]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-link-grid">
          <nav className="footer-link-panel footer-link-panel-wide" aria-label="Footer navigation">
            <h5>Navigation</h5>
            <ul className="footer-link-list footer-link-list-columns">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {getNavIcon(link.label)} {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-link-panel" aria-label="Government portals">
            <h5>Govt. Portals</h5>
            <ul className="footer-link-list">
              {EXTERNAL_GOVERNMENT_PORTALS.map((portal) => (
                <li key={portal.name}>
                  <a
                    href={portal.url}
                    target={portal.url.startsWith('http') ? '_blank' : undefined}
                    rel={portal.url.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <FaExternalLinkAlt size={10} aria-hidden="true" /> {portal.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-link-panel footer-subscribe-panel">
            <h5>Stay Connected</h5>
            <Form className="footer-subscribe-form" onSubmit={handleSubscribe} noValidate>
              <Form.Control
                type="email"
                placeholder="Email for updates"
                aria-label="Email address for update alerts"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button type="submit" variant="danger" size="sm">
                Join
              </Button>
              {message && <span className="footer-feedback">{message}</span>}
            </Form>
          </div>
        </div>
      </Container>

      <div className="footer-bottom-bar">
        <Container>
          <div className="footer-bottom-grid">
            <div>
              <div className="footer-mandatory-links" aria-label="Mandatory website links">
                {MANDATORY_FOOTER_LINKS.map((link) => (
                  <a
                    key={link.label}
                    id={getFooterAnchorId(link.href)}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="footer-copyright">
                {'\u00A9'} {currentYear} {site.departmentName}, Puducherry. All rights
                reserved.
              </p>
              <p className="footer-wim-line">
                Last Updated: {site.lastUpdated} | Content Owner: {site.contentOwner} | Web Information Manager: {site.webInformationManager} | Designation: {site.webInformationManagerDesignation}
              </p>
            </div>
            <div className="footer-powered-row">
                <button
                  type="button"
                  className="footer-back-top"
                  onClick={handleBackToTop}
                  aria-label="Back to top"
                >
                  <FaArrowUp size={12} /> Back to Top
                </button>
              <span>Powered by</span>
              <strong>PeGS</strong>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
