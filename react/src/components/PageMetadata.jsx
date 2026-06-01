import { Container } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const PageMetadata = () => {
  const { content } = useSiteContent();
  const { site } = content;
  const managerEmail = site.webInformationManagerEmail || site.helpdeskEmail;
  const managerEmailDisplay =
    site.webInformationManagerEmailDisplay || site.helpdeskEmailDisplay || managerEmail;

  const metadataItems = [
    { label: 'Last Updated', value: site.lastUpdated },
    { label: 'Content Owner', value: site.contentOwner },
    { label: 'Department', value: site.departmentName },
    { label: 'Web Information Manager', value: site.webInformationManager },
    { label: 'Designation', value: site.webInformationManagerDesignation },
  ];

  return (
    <aside id="web-information-manager" className="page-metadata" aria-label="Government website information">
      <Container>
        <dl className="page-metadata-grid">
          {metadataItems.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>Contact</dt>
            <dd>
              <a href={`mailto:${managerEmail}`}>
                <FaEnvelope size={12} aria-hidden="true" />
                {managerEmailDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt>Helpdesk</dt>
            <dd>
              <a href={`tel:${site.phoneCompact}`}>
                <FaPhoneAlt size={12} aria-hidden="true" />
                {site.phone}
              </a>
            </dd>
          </div>
        </dl>
      </Container>
    </aside>
  );
};

export default PageMetadata;
