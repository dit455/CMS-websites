import { Container } from 'react-bootstrap';
import {
  FaArrowUp,
  FaBell,
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaDownload,
  FaEnvelope,
  FaFacebook,
  FaGavel,
  FaLinkedin,
  FaLink,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaProjectDiagram,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from 'react-icons/fa';
import { MANDATORY_FOOTER_LINKS } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';
import siteLogo from '../assets/img/Site_logo.png';

const footerLinkIcons = {
  gavel: FaGavel, clipboard: FaClipboardList, bell: FaBell,
  download: FaDownload, briefcase: FaProjectDiagram, users: FaUsers, link: FaLink,
};

const utilityLabels = [
  'Privacy Policy',
  'Website Policies',
  'Accessibility Statement',
  'Hyperlinking Policy',
  'Disclaimer',
  'Sitemap',
];

const getFooterAnchorId = (href) => {
  if (!href.startsWith('#')) return undefined;
  if (['#contact', '#grievances', '#web-information-manager'].includes(href)) return undefined;
  return href.slice(1);
};

const FooterLinkList = ({ ariaLabel, links }) => (
  <ul className="footer-modern-links" aria-label={ariaLabel}>
    {links.map((link) => {
      const LinkIcon = link.icon;
      return (
        <li key={link.label}>
          <a href={link.href}>
            <LinkIcon aria-hidden="true" />
            <span>{link.label}</span>
          </a>
        </li>
      );
    })}
  </ul>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useSiteContent();
  const { site } = content;
  // CMS-only — no hardcoded fallback links
  const quickLinks = (content.quickLinks || []).map((l) => ({ label: l.label, href: l.href || '#', icon: FaLink }));
  const citizenLinks = (content.footerLinks || []).map((l) => ({
    label: l.label, href: l.href || '#', icon: footerLinkIcons[l.icon] || FaLink,
  }));

  const socialLinks = [
    site.facebookUrl && { href: site.facebookUrl, label: 'Facebook',  Icon: FaFacebook,  color: '#1877F2' },
    site.twitterUrl  && { href: site.twitterUrl,  label: 'Twitter/X', Icon: FaTwitter,   color: '#1DA1F2' },
    site.youtubeUrl  && { href: site.youtubeUrl,  label: 'YouTube',   Icon: FaYoutube,   color: '#FF0000' },
    site.linkedinUrl && { href: site.linkedinUrl, label: 'LinkedIn',  Icon: FaLinkedin,  color: '#0A66C2' },
  ].filter(Boolean);
  const emailDisplay = site.helpdeskEmailDisplay || site.helpdeskEmail;
  const utilityLinks = MANDATORY_FOOTER_LINKS.filter((link) => utilityLabels.includes(link.label));

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <footer className="site-footer footer-modern text-white mt-4" aria-labelledby="footer-heading">
      <Container className="footer-shell">
        <h2 id="footer-heading" className="visually-hidden">
          {site.departmentName} footer navigation
        </h2>

        <div className="footer-modern-grid">
          <section className="footer-modern-column footer-about-column" aria-labelledby="footer-about-title">
            <div className="footer-logo-row">
              <span className="footer-logo-tile">
                <img src={siteLogo} alt={`${site.departmentName} logo`} />
              </span>
              <div>
                <span className="footer-kicker">{site.governmentName}</span>
                <h3 id="footer-about-title">{site.departmentName}</h3>
              </div>
            </div>
            {site.footerDescription && <p>{site.footerDescription}</p>}
            <span className="footer-trust-badge">
              <FaCheckCircle aria-hidden="true" />
              Official Government Website
            </span>
          </section>

          {quickLinks.length > 0 && (
            <nav className="footer-modern-column" aria-labelledby="footer-quick-title">
              <h3 id="footer-quick-title">
                <FaLink aria-hidden="true" />
                Quick Links
              </h3>
              <FooterLinkList ariaLabel="Quick links" links={quickLinks} />
            </nav>
          )}

          {citizenLinks.length > 0 && (
            <nav className="footer-modern-column" aria-labelledby="footer-citizen-title">
              <h3 id="footer-citizen-title">
                <FaUsers aria-hidden="true" />
                Citizen Services
              </h3>
              <FooterLinkList ariaLabel="Citizen service links" links={citizenLinks} />
            </nav>
          )}

          <section className="footer-modern-column" aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title">
              <FaBuilding aria-hidden="true" />
              Contact Information
            </h3>
            <address className="footer-contact-list">
              <span>
                <FaBuilding aria-hidden="true" />
                <b>{site.officeName}</b>
                <small>{site.governmentName}</small>
              </span>
              <a href={`mailto:${site.helpdeskEmail}`}>
                <FaEnvelope aria-hidden="true" />
                <b>Email</b>
                <small>{emailDisplay}</small>
              </a>
              <a href={`tel:${site.phoneCompact}`}>
                <FaPhoneAlt aria-hidden="true" />
                <b>Phone</b>
                <small>{site.phone}</small>
              </a>
              <span>
                <FaMapMarkerAlt aria-hidden="true" />
                <b>Office Address</b>
                <small>{site.address}</small>
              </span>
            </address>
          </section>

          {socialLinks.length > 0 && (
            <section className="footer-modern-column" aria-labelledby="footer-social-title">
              <h3 id="footer-social-title">
                <FaLink aria-hidden="true" />
                Connect With Us
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                {socialLinks.map(({ href, label, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: '50%',
                      background: color, color: '#fff', fontSize: 18,
                      textDecoration: 'none', transition: 'opacity .15s',
                    }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>

      <div className="footer-utility-bar" aria-label="Website policies and utility links">
        <Container>
          <nav className="footer-utility-links" aria-label="Mandatory website links">
            {utilityLinks.map((link) => (
              <a
                key={link.label}
                id={getFooterAnchorId(link.href)}
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <div className="footer-bottom-bar">
        <Container>
          <div className="footer-bottom-modern" aria-label="Copyright and website metadata">
            <div className="footer-copyright-stack">
              <p>
                {'\u00A9'} {currentYear} {site.departmentName}, {site.governmentName}
              </p>
              <div className="footer-meta-row">
                <span>All Rights Reserved</span>
                <span>Last Updated: {site.lastUpdated}</span>
              </div>
              <small>
                Content Owner: {site.contentOwner} | Web Information Manager: {site.webInformationManager} | Designation: {site.webInformationManagerDesignation}
              </small>
            </div>

            <div className="footer-powered-row-modern">
              <button
                type="button"
                className="footer-back-top"
                onClick={handleBackToTop}
                aria-label="Back to top"
              >
                <FaArrowUp size={12} aria-hidden="true" />
                Back to Top
              </button>
              <span>Powered by</span>
              <strong>PEGS</strong>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
