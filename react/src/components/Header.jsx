import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import {
  FaUser,
  FaUserCircle,
  FaUniversalAccess,
  FaSearch,
  FaMicrophone,
  FaHome,
  FaInfoCircle,
  FaCogs,
  FaFileAlt,
  FaBell,
  FaBriefcase,
  FaComments,
  FaGavel,
  FaDownload,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaAdjust,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaLanguage,
  FaUniversalAccess as FaScreenReader,
  FaEllipsisH,
  FaShieldAlt,
  FaUsers,
  FaNewspaper,
  FaLink,
} from 'react-icons/fa';
import emblemLogo from '../assets/img/emblem.png';
import siteLogo from '../assets/img/Site_logo.png';
import { CMS_ENABLED } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

// Maps the icon string stored in Django (e.g. "FaHome") → a React icon element.
const ICON_MAP = {
  FaHome: <FaHome size={14} />,
  FaInfoCircle: <FaInfoCircle size={14} />,
  FaCogs: <FaCogs size={14} />,
  FaFileAlt: <FaFileAlt size={14} />,
  FaBell: <FaBell size={14} />,
  FaBriefcase: <FaBriefcase size={14} />,
  FaComments: <FaComments size={14} />,
  FaDownload: <FaDownload size={14} />,
  FaEnvelope: <FaEnvelope size={14} />,
  FaGavel: <FaGavel size={14} />,
  FaEllipsisH: <FaEllipsisH size={14} />,
  FaChevronRight: <FaChevronRight size={12} />,
  FaShieldAlt: <FaShieldAlt size={14} />,
  FaUsers: <FaUsers size={14} />,
  FaNewspaper: <FaNewspaper size={14} />,
  FaLink: <FaLink size={14} />,
};

// Hardcoded menu used when the CMS menu API is unavailable.
const FALLBACK_NAV = [
  { href: '#', label: 'Home', icon: <FaHome size={14} /> },
  { href: '#about-detail', label: 'About Us', icon: <FaInfoCircle size={14} /> },
  { href: '#services', label: 'Services', icon: <FaCogs size={14} /> },
  { href: '#documents', label: 'Documents', icon: <FaFileAlt size={14} /> },
  { href: '#notifications', label: 'Notifications', icon: <FaBell size={14} />, badge: 'Live' },
  { href: '#tenders', label: 'Tenders', icon: <FaFileAlt size={14} /> },
  { href: '#rti', label: 'RTI', icon: <FaGavel size={14} />, badge: 'Info' },
  {
    href: '#more',
    label: 'More',
    icon: <FaEllipsisH size={14} />,
    children: [
      { href: '#eodb', label: 'EoDB', icon: <FaBriefcase size={14} /> },
      { href: '#grievances', label: 'Grievances', icon: <FaComments size={14} /> },
      { href: '#downloads', label: 'Downloads', icon: <FaDownload size={14} />, badge: 'PDF' },
      { href: '#contact', label: 'Contact', icon: <FaEnvelope size={14} /> },
    ],
  },
];

const Header = () => {
  const { content, menu } = useSiteContent();
  const { site } = content;
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [activeHash, setActiveHash] = useState('#');
  const [theme, setTheme] = useState(() => window.localStorage.getItem('dit-portal-theme') || 'light');
  const [fontScale, setFontScale] = useState(() => Number(window.localStorage.getItem('dit-portal-font-scale')) || 100);
  const [highContrast, setHighContrast] = useState(() => window.localStorage.getItem('dit-portal-contrast') === 'high');
  const [language, setLanguage] = useState(() => window.localStorage.getItem('dit-portal-language') || 'en');
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const serviceMenuItems = useMemo(
    () => content.services.map((service) => ({
      href: '#services-detail',
      label: service.title,
      desc: service.desc,
    })),
    [content.services],
  );

  const navLinks = useMemo(() => {
    if (Array.isArray(menu) && menu.length > 0) {
      const toIcon = (name) => ICON_MAP[name] || <FaChevronRight size={12} />;
      return menu.map((item) => ({
        href: item.href || '#',
        label: item.label,
        icon: toIcon(item.icon),
        badge: item.badge || undefined,
        isMegaMenu: item.is_mega_menu,
        openInNewTab: item.open_in_new_tab,
        children:
          Array.isArray(item.children) && item.children.length > 0
            ? item.children.map((child) => ({
                href: child.href || '#',
                label: child.label,
                icon: toIcon(child.icon),
                badge: child.badge || undefined,
                openInNewTab: child.open_in_new_tab,
              }))
            : undefined,
      }));
    }
    return FALLBACK_NAV;
  }, [menu]);

  const searchableNavLinks = useMemo(
    () => navLinks.flatMap((link) => (link.children ? link.children : [link])),
    [navLinks],
  );

  useEffect(() => {
    const updateActiveHash = () => setActiveHash(window.location.hash || '#');
    updateActiveHash();
    window.addEventListener('hashchange', updateActiveHash);
    return () => window.removeEventListener('hashchange', updateActiveHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('dit-portal-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = fontScale === 100 ? '' : `${fontScale}%`;
    window.localStorage.setItem('dit-portal-font-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
    window.localStorage.setItem('dit-portal-contrast', highContrast ? 'high' : 'normal');
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('dit-portal-language', language);
  }, [language]);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel?.();
  }, []);

  const isActiveLink = (href, children = []) => {
    if (children.length > 0) return children.some((child) => isActiveLink(child.href));
    if (href === '#') return activeHash === '#';
    if (href === '#services') return activeHash === '#services' || activeHash === '#services-detail';
    return activeHash === href;
  };

  const scrollToAnchor = (href) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(href.slice(1));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setPortalHash = (href) => {
    const path = `${window.location.pathname}${window.location.search}`;
    window.history.pushState(null, '', href === '#' ? path : `${path}${href}`);
    setActiveHash(href);
    window.dispatchEvent(new Event('hashchange'));
  };

  const finishNavigation = (href) => {
    const isDetailRoute = ['#about-detail', '#services-detail', '#cms'].includes(href);

    window.setTimeout(() => {
      if (isDetailRoute) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToAnchor(href);
      }
    }, 80);
  };

  const handleNavClick = (event, href) => {
    event.preventDefault();
    setExpanded(false);
    setSearchMessage('');

    setPortalHash(href);
    finishNavigation(href);
  };

  const speakAssistant = (message) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const adjustFontScale = (delta) => {
    setFontScale((current) => Math.min(120, Math.max(90, current + delta)));
  };

  const focusMainContent = (event) => {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.focus({ preventScroll: true });
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const runPortalSearch = (rawQuery, source = 'typed') => {
    const cleanQuery = rawQuery.trim();
    const query = cleanQuery.toLowerCase();
    if (!query) {
      const message = source === 'voice'
        ? 'I could not hear a search term. Please try voice search again.'
        : 'Type a section like services, documents, downloads, or contact.';
      setSearchMessage(message);
      if (source === 'voice') speakAssistant('I could not hear a search term. Please try again.');
      return;
    }

    const match = searchableNavLinks.find((link) => {
      const label = link.label.toLowerCase();
      return label.includes(query) || query.includes(label);
    });

    if (match) {
      setPortalHash(match.href);
      finishNavigation(match.href);
      setExpanded(false);
      setSearchMessage(source === 'voice' ? `Voice assistant opened ${match.label}.` : `Jumped to ${match.label}.`);
      if (source === 'voice') speakAssistant(`Opening ${match.label}.`);
      return;
    }

    setPortalHash('#documents');
    finishNavigation('#documents');
    setSearchMessage(source === 'voice'
      ? `Voice search heard "${cleanQuery}". No exact section matched, so I opened the Resource Centre.`
      : 'No exact match found. Opened the Resource Centre instead.');
    if (source === 'voice') speakAssistant('No exact match found. Opening the Resource Centre.');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    runPortalSearch(searchQuery);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSearchMessage('Voice search is not supported in this browser. Please type your search.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      setSearchMessage('Voice search stopped.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSearchMessage('Listening... say services, documents, contact, about us, or home.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setSearchQuery(transcript);
      runPortalSearch(transcript, 'voice');
    };

    recognition.onerror = (event) => {
      const message = event.error === 'not-allowed'
        ? 'Microphone permission is required for voice search.'
        : 'Voice search could not hear clearly. Please try again.';
      setSearchMessage(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <header className="site-header">
      <div className="portal-utility-bar">
        <Container className="utility-inner">
          <div className="utility-links">
            <a
              href={CMS_ENABLED ? '#cms' : '#contact'}
              className="utility-link"
              title={CMS_ENABLED ? 'Open CMS login area' : 'Contact the department for portal access'}
            >
              <FaUser size={11} /> LOGIN
            </a>
            <a href="#" className="utility-link">
              PUDUCHERRY
            </a>
            <a href="#main-content" className="utility-link" onClick={focusMainContent}>
              <FaScreenReader size={13} /> SCREEN READER
            </a>
          </div>
          <div className="utility-actions">
            <div id="accessibility-tools" className="font-tools" aria-label="Accessibility tools">
              <span className="accessibility-label">
                <FaUniversalAccess size={12} /> Accessibility
              </span>
              <button type="button" onClick={() => adjustFontScale(-10)} aria-label="Decrease font size">
                A-
              </button>
              <button type="button" onClick={() => setFontScale(100)} aria-label="Reset font size">
                A
              </button>
              <button type="button" onClick={() => adjustFontScale(10)} aria-label="Increase font size">
                A+
              </button>
              <button
                type="button"
                className={`contrast-toggle ${highContrast ? 'active' : ''}`}
                aria-label="Toggle high contrast mode"
                aria-pressed={highContrast}
                onClick={() => setHighContrast((current) => !current)}
              >
                <FaAdjust size={12} />
                <span>Contrast</span>
              </button>
            </div>
            <label className="language-selector">
              <FaLanguage size={13} aria-hidden="true" />
              <span className="visually-hidden">Select language</span>
              <select
                value={language}
                aria-label="Select language"
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="en">English</option>
                <option value="ta">Tamil</option>
              </select>
            </label>
            <a href="#contact" className="utility-link">
              <FaEnvelope size={11} /> CONTACT
            </a>
            <button
              type="button"
              className="dark-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <FaSun size={11} /> : <FaMoon size={11} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              type="button"
              className="utility-icon-button"
              aria-label="Open profile access information"
              onClick={() => {
                window.location.hash = CMS_ENABLED ? '#cms' : '#contact';
              }}
            >
              <FaUserCircle size={15} />
            </button>
            <button
              type="button"
              className="utility-icon-button"
              aria-label="Focus portal search"
              onClick={() => searchInputRef.current?.focus()}
            >
              <FaSearch size={13} />
            </button>
          </div>
        </Container>
      </div>

      <div className="portal-masthead">
        <Container className="masthead-inner">
          <div className="brand-panel">
            <div className="brand-logo-tile emblem-crop">
              <img src={emblemLogo} alt="Government emblem of India" />
            </div>
            <div className="brand-copy">
              <span className="portal-badge">Official Government Portal</span>
              <h1 className="department-bilingual-title" aria-label="Directorate of Information Technology, Government of Puducherry">
                <span className="department-title-en">Directorate of Information Technology</span>
                <span className="department-title-ta" lang="ta">தகவல் தொழில்நுட்ப இயக்குநரகம்</span>
              </h1>
              <p className="government-bilingual-title">
                <span>Government of Puducherry</span>
                <span lang="ta">புதுச்சேரி அரசு</span>
              </p>
            </div>
            <div className="brand-logo-tile site-mark">
              <img src={siteLogo} alt="Government of Puducherry" />
            </div>
          </div>

          <div className="masthead-tools">
            <Form className="portal-search" onSubmit={handleSearch}>
              <div className="portal-search-field">
                <FormControl
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search portal"
                  aria-label="Search portal"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <Button
                  type="button"
                  className={`portal-voice-button ${isListening ? 'active' : ''}`}
                  aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                  aria-pressed={isListening}
                  title={isListening ? 'Stop voice search' : 'Voice search'}
                  onClick={handleVoiceSearch}
                >
                  <FaMicrophone size={14} />
                </Button>
                <Button type="submit" className="portal-search-button" aria-label="Search portal">
                  <FaSearch size={16} />
                </Button>
              </div>
              {searchMessage && (
                <span className="portal-search-feedback mt-2 text-end">{searchMessage}</span>
              )}
            </Form>

            <div className="masthead-action-row">
              <button type="button" className="masthead-icon-button" title="Notifications" aria-label="View notifications">
                <FaBell size={16} />
              </button>
              <button type="button" className="masthead-icon-button" title="Profile" aria-label="Open profile access information">
                <FaUserCircle size={17} />
              </button>
              <button type="button" className="portal-menu-button" aria-label="Open portal access menu">
                <FaUser size={13} /> PORTAL <FaChevronDown size={11} />
              </button>
              <button
                type="button"
                className="header-menu-toggle d-lg-none"
                aria-controls="basic-navbar-nav"
                aria-expanded={expanded}
                aria-label="Toggle navigation"
                onClick={() => setExpanded(!expanded)}
              >
                <FaBars size={18} />
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Navbar expand="lg" expanded={expanded} className="portal-nav-bar">
        <Container className="portal-nav-container">
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="mobile-search d-md-none my-3" onSubmit={handleSearch}>
              <div className="portal-search-field">
                <FormControl
                  type="search"
                  placeholder="Search portal"
                  aria-label="Search portal"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <Button
                  type="button"
                  className={`portal-voice-button ${isListening ? 'active' : ''}`}
                  aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                  aria-pressed={isListening}
                  title={isListening ? 'Stop voice search' : 'Voice search'}
                  onClick={handleVoiceSearch}
                >
                  <FaMicrophone size={13} />
                </Button>
                <Button type="submit" className="portal-search-button" aria-label="Search portal">
                  <FaSearch size={14} />
                </Button>
              </div>
              {searchMessage && <span className="portal-search-feedback d-block mt-2">{searchMessage}</span>}
            </Form>
            <Nav className="portal-primary-nav">
              {navLinks.map((link) => (
                (link.isMegaMenu || link.label === 'Services') ? (
                  <NavDropdown
                    key={`${link.label}-${link.href}`}
                    id="services-nav-dropdown"
                    className={`portal-nav-dropdown ${isActiveLink(link.href) ? 'active' : ''}`}
                    title={(
                      <>
                        {link.icon}
                        <span>{link.label}</span>
                      </>
                    )}
                  >
                    <div className="mega-menu-intro">
                      <strong>Digital Service Channels</strong>
                      <span>Explore core platforms and citizen service touchpoints.</span>
                    </div>
                    <div className="mega-menu-grid">
                      <NavDropdown.Item href="#services-detail" onClick={(event) => handleNavClick(event, '#services-detail')}>
                        <span className="mega-menu-icon"><FaCogs size={14} /></span>
                        <span>
                          <strong>All Services</strong>
                          <small>View every digital governance service</small>
                        </span>
                      </NavDropdown.Item>
                      {serviceMenuItems.map((service) => (
                        <NavDropdown.Item
                          key={service.label}
                          href={service.href}
                          onClick={(event) => handleNavClick(event, service.href)}
                        >
                          <span className="mega-menu-icon"><FaChevronRight size={12} /></span>
                          <span>
                            <strong>{service.label}</strong>
                            <small>{service.desc}</small>
                          </span>
                        </NavDropdown.Item>
                      ))}
                    </div>
                  </NavDropdown>
                ) : link.children ? (
                  <NavDropdown
                    key={`${link.label}-${link.href}`}
                    id="more-nav-dropdown"
                    className={`portal-nav-dropdown ${isActiveLink(link.href, link.children) ? 'active' : ''}`}
                    title={(
                      <>
                        {link.icon}
                        <span>{link.label}</span>
                      </>
                    )}
                  >
                    <div className="mega-menu-grid compact">
                      {link.children.map((child) => (
                        <NavDropdown.Item
                          key={child.label}
                          href={child.href}
                          onClick={(event) => handleNavClick(event, child.href)}
                        >
                          <span className="mega-menu-icon">{child.icon}</span>
                          <span>
                            <strong>{child.label}</strong>
                            <small>Open {child.label.toLowerCase()} section</small>
                          </span>
                        </NavDropdown.Item>
                      ))}
                    </div>
                  </NavDropdown>
                ) : (
                  <Nav.Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className={`portal-nav-link ${isActiveLink(link.href) ? 'active' : ''}`}
                    onClick={(event) => handleNavClick(event, link.href)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && <span className="nav-mini-badge">{link.badge}</span>}
                  </Nav.Link>
                )
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </header>
  );
};

export default Header;
