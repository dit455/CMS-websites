import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { GOVERNMENT_PARTNER_PORTALS } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const PartnerCard = ({ partner, duplicate = false }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = partner.logoImage && !imageFailed;

  return (
    <a
      href={partner.url}
      className={`partner-portal-card partner-tone-${partner.tone}`}
      target="_blank"
      rel="noreferrer"
      title={`Open ${partner.name}`}
      aria-label={`Open ${partner.name} official website`}
      aria-hidden={duplicate ? 'true' : undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <span className="partner-logo-shell">
        <span className="partner-logo-frame">
          {shouldShowImage ? (
            <img
              src={partner.logoImage}
              alt={partner.logoAlt || `${partner.name} logo`}
              className="partner-logo-img"
              loading="eager"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="partner-logo-initials" aria-hidden="true">
              {partner.initials}
            </span>
          )}
        </span>
        <span className="partner-logo-wordmark">{partner.logo}</span>
      </span>
    </a>
  );
};

const GovernmentPartners = () => {
  const { content } = useSiteContent();
  const partners =
    Array.isArray(content.partners) && content.partners.length > 0
      ? content.partners
      : GOVERNMENT_PARTNER_PORTALS;

  return (
    <section className="government-partners-section" aria-labelledby="government-partners-title">
      <Container>
        <div className="partners-heading">
          <h2 id="government-partners-title">Connected Government Platforms</h2>
        </div>

        <div className="partner-marquee" aria-label="Official government partner portals">
          <div className="partner-track">
            {partners.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
            {partners.map((partner) => (
              <PartnerCard key={`${partner.name}-duplicate`} partner={partner} duplicate />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GovernmentPartners;
