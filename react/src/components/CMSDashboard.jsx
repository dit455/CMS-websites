import { useMemo, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import {
  FaArrowLeft,
  FaBullhorn,
  FaCheckCircle,
  FaEye,
  FaFileAlt,
  FaHome,
  FaLayerGroup,
  FaNewspaper,
  FaPlus,
  FaRedo,
  FaSave,
  FaSearch,
  FaSlidersH,
  FaTrash,
  FaUndo,
  FaUsers,
} from 'react-icons/fa';
import { DOCUMENT_CATEGORIES } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

const cloneContent = (content) => JSON.parse(JSON.stringify(content));

const cmsTabs = [
  {
    id: 'site',
    label: 'Site',
    title: 'Site settings',
    description: 'Manage identity, contact details, and footer copy.',
    icon: <FaHome />,
    countKey: 'site',
  },
  {
    id: 'hero',
    label: 'Home',
    title: 'Homepage content',
    description: 'Control the news ticker and hero banner slides.',
    icon: <FaNewspaper />,
    countKey: 'heroSlides',
  },
  {
    id: 'services',
    label: 'Services',
    title: 'Service catalogue',
    description: 'Add, edit, and route the service cards shown on the portal.',
    icon: <FaCheckCircle />,
    countKey: 'services',
  },
  {
    id: 'officials',
    label: 'Officials',
    title: 'Leadership profiles',
    description: 'Maintain official names, roles, photos, and initials.',
    icon: <FaUsers />,
    countKey: 'officials',
  },
  {
    id: 'documents',
    label: 'Documents',
    title: 'Resources and documents',
    description: 'Manage document cards and citizen resource areas.',
    icon: <FaFileAlt />,
    countKey: 'documents',
  },
];

const createTemplate = (section) => {
  const templates = {
    newsItems: 'New portal update',
    heroSlides: {
      id: `hero-${Date.now()}`,
      imageKey: 'hero1',
      kicker: 'NEW UPDATE',
      title: 'New digital service update',
      description: 'Add a concise description for this homepage banner.',
      primaryCta: 'Learn More',
      primaryHref: '#services',
      secondaryCta: '',
      secondaryHref: '',
      variant: 'danger',
    },
    services: {
      icon: 'server',
      accent: '#3B82F6',
      surface: 'rgba(59,130,246,0.12)',
      title: 'New Service',
      desc: 'Describe the service and who it helps.',
      links: [
        { label: 'Learn more', href: '#documents' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    officials: {
      name: 'Official Name',
      role: 'Designation',
      imageKey: '',
      initials: 'ON',
    },
    documents: {
      id: Date.now(),
      title: 'New Document',
      category: 'Guidelines',
      desc: 'Short description of the document.',
      type: 'PDF',
      meta: 'Reference',
    },
  };

  return cloneContent(templates[section]);
};

const searchableTabs = ['services', 'officials', 'documents'];

const CMSDashboard = () => {
  const { content, setContent, resetContent } = useSiteContent();
  const [draft, setDraft] = useState(() => cloneContent(content));
  const [activeTab, setActiveTab] = useState('site');
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');

  const activeMeta = cmsTabs.find((tab) => tab.id === activeTab) || cmsTabs[0];
  const isDirty = JSON.stringify(draft) !== JSON.stringify(content);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const stats = useMemo(
    () => [
      { label: 'News items', value: draft.newsItems.length, icon: <FaBullhorn /> },
      { label: 'Hero slides', value: draft.heroSlides.length, icon: <FaLayerGroup /> },
      { label: 'Services', value: draft.services.length, icon: <FaCheckCircle /> },
      { label: 'Documents', value: draft.documents.length, icon: <FaFileAlt /> },
    ],
    [draft],
  );

  const filteredServices = useMemo(
    () =>
      draft.services
        .map((service, index) => ({ service, index }))
        .filter(({ service }) => {
          if (!normalizedSearch) return true;
          return `${service.title} ${service.desc}`.toLowerCase().includes(normalizedSearch);
        }),
    [draft.services, normalizedSearch],
  );

  const filteredOfficials = useMemo(
    () =>
      draft.officials
        .map((official, index) => ({ official, index }))
        .filter(({ official }) => {
          if (!normalizedSearch) return true;
          return `${official.name} ${official.role}`.toLowerCase().includes(normalizedSearch);
        }),
    [draft.officials, normalizedSearch],
  );

  const filteredDocuments = useMemo(
    () =>
      draft.documents
        .map((doc, index) => ({ doc, index }))
        .filter(({ doc }) => {
          const matchesSearch =
            !normalizedSearch || `${doc.title} ${doc.desc} ${doc.category}`.toLowerCase().includes(normalizedSearch);
          const matchesCategory = !documentCategory || doc.category === documentCategory;
          return matchesSearch && matchesCategory;
        }),
    [documentCategory, draft.documents, normalizedSearch],
  );

  const updateSite = (field, value) => {
    setDraft((current) => ({
      ...current,
      site: { ...current.site, [field]: value },
    }));
  };

  const updateArrayItem = (section, index, patch) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const updateServiceLink = (serviceIndex, linkIndex, field, value) => {
    setDraft((current) => ({
      ...current,
      services: current.services.map((service, index) => {
        if (index !== serviceIndex) return service;
        return {
          ...service,
          links: service.links.map((link, currentLinkIndex) =>
            currentLinkIndex === linkIndex ? { ...link, [field]: value } : link,
          ),
        };
      }),
    }));
  };

  const updateTextList = (section, index, field, value) => {
    updateArrayItem(section, index, {
      [field]: value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const updateNewsItem = (index, value) => {
    setDraft((current) => ({
      ...current,
      newsItems: current.newsItems.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addItem = (section) => {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], createTemplate(section)],
    }));
    setMessage({ type: 'info', text: 'New item added. Review it and save when ready.' });
  };

  const removeItem = (section, index) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }));
    setMessage({ type: 'info', text: 'Item removed from the draft. Save to publish the change.' });
  };

  const saveChanges = () => {
    setContent(cloneContent(draft));
    setMessage({ type: 'success', text: 'Content saved. The public website has been updated in this browser.' });
  };

  const discardChanges = () => {
    setDraft(cloneContent(content));
    setMessage({ type: 'info', text: 'Unsaved draft changes were discarded.' });
  };

  const resetChanges = () => {
    const nextContent = resetContent();
    setDraft(cloneContent(nextContent));
    setMessage({ type: 'success', text: 'Content reset to the default website copy.' });
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
    setDocumentCategory('');
  };

  return (
    <section className="cms-page">
      <Container fluid="xl" className="py-4 py-lg-5">
        <div className="cms-command-bar mb-4">
          <div className="cms-title-block">
            <span className="cms-overline">
              <FaSlidersH /> Content Management
            </span>
            <h1>Website CMS</h1>
            <p>Modern editor for homepage content, service cards, officials, and resources.</p>
          </div>

          <div className="cms-actions">
            <span className={`cms-save-state ${isDirty ? 'dirty' : 'clean'}`}>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <Button as="a" href="#" variant="light" className="cms-soft-button">
              <FaArrowLeft size={13} /> Website
            </Button>
            <Button variant="light" className="cms-soft-button" onClick={discardChanges} disabled={!isDirty}>
              <FaUndo size={13} /> Discard
            </Button>
            <Button variant="outline-danger" className="cms-soft-button" onClick={resetChanges}>
              <FaRedo size={13} /> Defaults
            </Button>
            <Button variant="danger" className="cms-primary-button" onClick={saveChanges} disabled={!isDirty}>
              <FaSave size={13} /> Save changes
            </Button>
          </div>
        </div>

        {message && <div className={`cms-alert ${message.type} mb-4`}>{message.text}</div>}

        <Row className="g-3 mb-4">
          {stats.map((stat) => (
            <Col key={stat.label} sm={6} lg={3}>
              <div className="cms-stat">
                <span className="cms-stat-icon">{stat.icon}</span>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </Col>
          ))}
        </Row>

        <div className="cms-layout">
          <aside className="cms-sidebar">
            {cmsTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => switchTab(tab.id)}
              >
                <span className="cms-nav-icon">{tab.icon}</span>
                <span>
                  <strong>{tab.label}</strong>
                  <small>{getTabCount(tab, draft)}</small>
                </span>
              </button>
            ))}
          </aside>

          <div className="cms-panel">
            <div className="cms-panel-header">
              <div className="cms-panel-title">
                <span>{activeMeta.icon}</span>
                <div>
                  <h2>{activeMeta.title}</h2>
                  <p>{activeMeta.description}</p>
                </div>
              </div>

              {searchableTabs.includes(activeTab) && (
                <div className="cms-panel-tools">
                  <InputGroup className="cms-search">
                    <InputGroup.Text>
                      <FaSearch size={13} />
                    </InputGroup.Text>
                    <Form.Control
                      value={searchTerm}
                      placeholder={`Search ${activeMeta.label.toLowerCase()}...`}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </InputGroup>

                  {activeTab === 'documents' && (
                    <Form.Select
                      className="cms-category-select"
                      value={documentCategory}
                      onChange={(event) => setDocumentCategory(event.target.value)}
                    >
                      <option value="">All categories</option>
                      {DOCUMENT_CATEGORIES.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Form.Select>
                  )}
                </div>
              )}
            </div>

            {activeTab === 'site' && <SiteEditor draft={draft} updateSite={updateSite} />}
            {activeTab === 'hero' && (
              <HeroEditor
                draft={draft}
                addItem={addItem}
                removeItem={removeItem}
                updateArrayItem={updateArrayItem}
                updateNewsItem={updateNewsItem}
              />
            )}
            {activeTab === 'services' && (
              <ServicesEditor
                services={filteredServices}
                addItem={addItem}
                removeItem={removeItem}
                updateArrayItem={updateArrayItem}
                updateServiceLink={updateServiceLink}
              />
            )}
            {activeTab === 'officials' && (
              <OfficialsEditor
                officials={filteredOfficials}
                addItem={addItem}
                removeItem={removeItem}
                updateArrayItem={updateArrayItem}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsEditor
                documents={filteredDocuments}
                resourceGroups={draft.resourceGroups}
                addItem={addItem}
                removeItem={removeItem}
                updateArrayItem={updateArrayItem}
                updateTextList={updateTextList}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

const SiteEditor = ({ draft, updateSite }) => (
  <div className="cms-editor-grid">
    <div className="cms-stack">
      <EditorGroup
        title="Portal identity"
        description="This content appears in the header, footer, and browser-visible portal chrome."
      >
        <div className="cms-form-grid">
          <FormField label="Department name" value={draft.site.departmentName} onChange={(value) => updateSite('departmentName', value)} />
          <FormField label="Government name" value={draft.site.governmentName} onChange={(value) => updateSite('governmentName', value)} />
          <FormField label="Office name" value={draft.site.officeName} onChange={(value) => updateSite('officeName', value)} />
          <FormField label="Compact phone" value={draft.site.phoneCompact} onChange={(value) => updateSite('phoneCompact', value)} />
          <FormField label="Web Information Manager" value={draft.site.webInformationManager} onChange={(value) => updateSite('webInformationManager', value)} />
          <FormField label="WIM designation" value={draft.site.webInformationManagerDesignation || ''} onChange={(value) => updateSite('webInformationManagerDesignation', value)} />
        </div>
      </EditorGroup>

      <EditorGroup title="Contact details" description="Used by the top bar, chatbot, footer, map, and contact cards.">
        <div className="cms-form-grid">
          <FormField label="Helpdesk email" value={draft.site.helpdeskEmail} onChange={(value) => updateSite('helpdeskEmail', value)} />
          <FormField label="Display email" value={draft.site.helpdeskEmailDisplay || ''} onChange={(value) => updateSite('helpdeskEmailDisplay', value)} />
          <FormField label="Phone" value={draft.site.phone} onChange={(value) => updateSite('phone', value)} />
          <FormField label="Address" as="textarea" value={draft.site.address} onChange={(value) => updateSite('address', value)} />
          <FormField label="Footer description" as="textarea" value={draft.site.footerDescription} onChange={(value) => updateSite('footerDescription', value)} />
        </div>
      </EditorGroup>
    </div>

    <LivePreview title="Site preview">
      <div className="cms-site-preview">
        <strong>{draft.site.departmentName}</strong>
        <span>{draft.site.governmentName}</span>
        <hr />
        <p>{draft.site.footerDescription}</p>
        <div>{draft.site.helpdeskEmailDisplay || draft.site.helpdeskEmail}</div>
        <div>{draft.site.phone}</div>
        <div>{draft.site.webInformationManager}</div>
        <div>{draft.site.webInformationManagerDesignation}</div>
      </div>
    </LivePreview>
  </div>
);

const HeroEditor = ({ draft, addItem, removeItem, updateArrayItem, updateNewsItem }) => (
  <div className="cms-stack">
    <EditorGroup
      title="News ticker"
      description="Short updates that scroll below the header."
      actionLabel="Add news"
      onAdd={() => addItem('newsItems')}
    >
      <div className="cms-list compact">
        {draft.newsItems.map((item, index) => (
          <div key={`${item}-${index}`} className="cms-row">
            <span className="cms-row-index">{index + 1}</span>
            <Form.Control value={item} onChange={(event) => updateNewsItem(index, event.target.value)} />
            <IconButton label="Remove news" onClick={() => removeItem('newsItems', index)} />
          </div>
        ))}
      </div>
    </EditorGroup>

    <EditorGroup
      title="Hero slides"
      description="Primary homepage banners. Keep titles concise and action-oriented."
      actionLabel="Add slide"
      onAdd={() => addItem('heroSlides')}
    >
      <div className="cms-list">
        {draft.heroSlides.map((slide, index) => (
          <EditableCard
            key={slide.id}
            title={slide.title}
            meta={slide.kicker}
            preview={<HeroSlidePreview slide={slide} />}
            onRemove={() => removeItem('heroSlides', index)}
          >
            <div className="cms-form-grid">
              <FormField label="Kicker" value={slide.kicker} onChange={(value) => updateArrayItem('heroSlides', index, { kicker: value })} />
              <FormField label="Title" value={slide.title} onChange={(value) => updateArrayItem('heroSlides', index, { title: value })} />
              <FormField label="Description" as="textarea" value={slide.description} onChange={(value) => updateArrayItem('heroSlides', index, { description: value })} />
              <FormField label="Primary CTA" value={slide.primaryCta} onChange={(value) => updateArrayItem('heroSlides', index, { primaryCta: value })} />
              <FormField label="Primary link" value={slide.primaryHref} onChange={(value) => updateArrayItem('heroSlides', index, { primaryHref: value })} />
              <FormField label="Secondary CTA" value={slide.secondaryCta} onChange={(value) => updateArrayItem('heroSlides', index, { secondaryCta: value })} />
              <Form.Group>
                <Form.Label>Visual</Form.Label>
                <Form.Select value={slide.imageKey} onChange={(event) => updateArrayItem('heroSlides', index, { imageKey: event.target.value })}>
                  <option value="hero1">Technology banner</option>
                  <option value="hero2">CSC event banner</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Button style</Form.Label>
                <Form.Select value={slide.variant} onChange={(event) => updateArrayItem('heroSlides', index, { variant: event.target.value })}>
                  <option value="danger">Royal Purple</option>
                  <option value="primary">Electric Blue</option>
                </Form.Select>
              </Form.Group>
            </div>
          </EditableCard>
        ))}
      </div>
    </EditorGroup>
  </div>
);

const ServicesEditor = ({ services, addItem, removeItem, updateArrayItem, updateServiceLink }) => (
  <EditorGroup
    title="Services"
    description="Edit service cards, button labels, and internal links."
    actionLabel="Add service"
    onAdd={() => addItem('services')}
  >
    <EmptyState show={services.length === 0} />
    <div className="cms-list">
      {services.map(({ service, index }) => (
        <EditableCard
          key={`${service.title}-${index}`}
          title={service.title}
          meta={service.links?.[0]?.label}
          preview={<ServicePreview service={service} />}
          onRemove={() => removeItem('services', index)}
        >
          <div className="cms-form-grid">
            <FormField label="Title" value={service.title} onChange={(value) => updateArrayItem('services', index, { title: value })} />
            <Form.Group>
              <Form.Label>Icon</Form.Label>
              <Form.Select value={service.icon} onChange={(event) => updateArrayItem('services', index, { icon: event.target.value })}>
                <option value="network">Network</option>
                <option value="server">Server</option>
                <option value="users">Users</option>
                <option value="portal">Portal</option>
                <option value="shield">Security</option>
                <option value="training">Training</option>
                <option value="cloud">Cloud</option>
                <option value="project">Project</option>
              </Form.Select>
            </Form.Group>
            <FormField label="Description" as="textarea" value={service.desc} onChange={(value) => updateArrayItem('services', index, { desc: value })} />
            <FormField label="Primary button" value={service.links[0]?.label || ''} onChange={(value) => updateServiceLink(index, 0, 'label', value)} />
            <FormField label="Primary link" value={service.links[0]?.href || ''} onChange={(value) => updateServiceLink(index, 0, 'href', value)} />
            <FormField label="Secondary button" value={service.links[1]?.label || ''} onChange={(value) => updateServiceLink(index, 1, 'label', value)} />
            <FormField label="Secondary link" value={service.links[1]?.href || ''} onChange={(value) => updateServiceLink(index, 1, 'href', value)} />
          </div>
        </EditableCard>
      ))}
    </div>
  </EditorGroup>
);

const OfficialsEditor = ({ officials, addItem, removeItem, updateArrayItem }) => (
  <EditorGroup
    title="Officials"
    description="Maintain leadership cards with consistent fallback initials."
    actionLabel="Add official"
    onAdd={() => addItem('officials')}
  >
    <EmptyState show={officials.length === 0} />
    <div className="cms-list">
      {officials.map(({ official, index }) => (
        <EditableCard
          key={`${official.name}-${index}`}
          title={official.name}
          meta={official.role}
          preview={<OfficialPreview official={official} />}
          onRemove={() => removeItem('officials', index)}
        >
          <div className="cms-form-grid">
            <FormField label="Name" value={official.name} onChange={(value) => updateArrayItem('officials', index, { name: value })} />
            <FormField label="Role" value={official.role} onChange={(value) => updateArrayItem('officials', index, { role: value })} />
            <FormField label="Initials" value={official.initials || ''} onChange={(value) => updateArrayItem('officials', index, { initials: value })} />
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Select value={official.imageKey || ''} onChange={(event) => updateArrayItem('officials', index, { imageKey: event.target.value })}>
                <option value="">Initials fallback</option>
                <option value="minister">Minister photo</option>
                <option value="secretary">Secretary photo</option>
                <option value="director">Director photo</option>
              </Form.Select>
            </Form.Group>
          </div>
        </EditableCard>
      ))}
    </div>
  </EditorGroup>
);

const DocumentsEditor = ({
  documents,
  resourceGroups,
  addItem,
  removeItem,
  updateArrayItem,
  updateTextList,
}) => (
  <div className="cms-stack">
    <EditorGroup
      title="Documents"
      description="Manage searchable resource cards shown in the document centre."
      actionLabel="Add document"
      onAdd={() => addItem('documents')}
    >
      <EmptyState show={documents.length === 0} />
      <div className="cms-list">
        {documents.map(({ doc, index }) => (
          <EditableCard
            key={doc.id}
            title={doc.title}
            meta={`${doc.category} / ${doc.type}`}
            preview={<DocumentPreview doc={doc} />}
            onRemove={() => removeItem('documents', index)}
          >
            <div className="cms-form-grid">
              <FormField label="Title" value={doc.title} onChange={(value) => updateArrayItem('documents', index, { title: value })} />
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select value={doc.category} onChange={(event) => updateArrayItem('documents', index, { category: event.target.value })}>
                  {DOCUMENT_CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <FormField label="Description" as="textarea" value={doc.desc} onChange={(value) => updateArrayItem('documents', index, { desc: value })} />
              <FormField label="Type" value={doc.type} onChange={(value) => updateArrayItem('documents', index, { type: value })} />
              <FormField label="Meta" value={doc.meta} onChange={(value) => updateArrayItem('documents', index, { meta: value })} />
            </div>
          </EditableCard>
        ))}
      </div>
    </EditorGroup>

    <EditorGroup title="Citizen resource cards" description="Shortcuts for notifications, downloads, EoDB, and RTI areas.">
      <div className="cms-list">
        {resourceGroups.map((group, index) => (
          <EditableCard key={group.id} title={group.title} meta={group.eyebrow}>
            <div className="cms-form-grid">
              <FormField label="Title" value={group.title} onChange={(value) => updateArrayItem('resourceGroups', index, { title: value })} />
              <FormField label="Eyebrow" value={group.eyebrow} onChange={(value) => updateArrayItem('resourceGroups', index, { eyebrow: value })} />
              <FormField label="Description" as="textarea" value={group.description} onChange={(value) => updateArrayItem('resourceGroups', index, { description: value })} />
              <FormField label="Points" value={group.points.join(', ')} onChange={(value) => updateTextList('resourceGroups', index, 'points', value)} />
              <FormField label="CTA label" value={group.cta} onChange={(value) => updateArrayItem('resourceGroups', index, { cta: value })} />
            </div>
          </EditableCard>
        ))}
      </div>
    </EditorGroup>
  </div>
);

const EditorGroup = ({ title, description, actionLabel, onAdd, children }) => (
  <section className="cms-editor-group">
    <div className="cms-section-header">
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {onAdd && (
        <Button variant="outline-danger" size="sm" className="cms-add-button" onClick={onAdd}>
          <FaPlus size={12} /> {actionLabel}
        </Button>
      )}
    </div>
    {children}
  </section>
);

const EditableCard = ({ title, meta, preview, children, onRemove }) => (
  <article className="cms-edit-card">
    <div className="cms-edit-card-header">
      <div>
        <h4>{title}</h4>
        {meta && <span>{meta}</span>}
      </div>
      {onRemove && <IconButton label="Remove item" onClick={onRemove} />}
    </div>
    {preview}
    {children}
  </article>
);

const FormField = ({ label, value, onChange, as = 'input' }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      as={as}
      rows={as === 'textarea' ? 3 : undefined}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </Form.Group>
);

const LivePreview = ({ title, children }) => (
  <aside className="cms-live-preview">
    <div className="cms-live-preview-title">
      <FaEye />
      <span>{title}</span>
    </div>
    {children}
  </aside>
);

const HeroSlidePreview = ({ slide }) => (
  <div className={`cms-mini-preview hero ${slide.variant}`}>
    <span>{slide.kicker}</span>
    <strong>{slide.title}</strong>
    <p>{slide.description}</p>
  </div>
);

const ServicePreview = ({ service }) => (
  <div className="cms-mini-preview service">
    <span style={{ color: service.accent }}>{service.icon}</span>
    <strong>{service.title}</strong>
    <p>{service.desc}</p>
  </div>
);

const OfficialPreview = ({ official }) => (
  <div className="cms-mini-preview official">
    <span>{official.initials || 'NA'}</span>
    <strong>{official.name}</strong>
    <p>{official.role}</p>
  </div>
);

const DocumentPreview = ({ doc }) => (
  <div className="cms-mini-preview document">
    <span>{doc.category}</span>
    <strong>{doc.title}</strong>
    <p>
      {doc.type} / {doc.meta}
    </p>
  </div>
);

const EmptyState = ({ show }) => {
  if (!show) return null;

  return (
    <div className="cms-empty-state">
      <FaSearch />
      <strong>No matching content</strong>
      <span>Clear the search or add a new item.</span>
    </div>
  );
};

const IconButton = ({ label, onClick }) => (
  <button type="button" className="cms-delete-button" aria-label={label} onClick={onClick}>
    <FaTrash size={13} />
  </button>
);

const getTabCount = (tab, draft) => {
  if (tab.id === 'site') return 'Core details';
  if (tab.id === 'hero') return `${draft.heroSlides.length} slides`;
  return `${draft[tab.countKey]?.length || 0} items`;
};

export default CMSDashboard;
