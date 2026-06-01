/**
 * Header.jsx — CMS-Driven Menu Version
 * =====================================
 * Drop-in replacement for your existing Header.jsx.
 * 
 * What changed vs the original:
 *  - navLinks is now fetched from GET /api/menu/ instead of being hardcoded
 *  - All other logic (search, accessibility, theme) is IDENTICAL
 *  - Falls back to the original hardcoded menu if the API is unavailable
 * 
 * HOW IT WORKS:
 *  1. On mount, useEffect() calls GET /api/menu/
 *  2. Django returns the menu structure (top-level items + nested children)
 *  3. We map icon string names ("FaHome") → actual React icon components
 *  4. The rest of the render logic is unchanged from your original
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import {
  FaUser, FaUserCircle, FaUniversalAccess, FaSearch, FaMicrophone,
  FaHome, FaInfoCircle, FaCogs, FaFileAlt, FaBell, FaBriefcase,
  FaComments, FaGavel, FaDownload, FaEnvelope, FaMoon, FaSun,
  FaAdjust, FaChevronDown, FaChevronRight, FaBars, FaLanguage,
  FaUniversalAccess as FaScreenReader, FaEllipsisH, FaShieldAlt,
  FaUsers, FaNewspaper, FaLink,
} from 'react-icons/fa';
import emblemLogo from '../assets/img/emblem.png';
import siteLogo from '../assets/img/Site_logo.png';
import { CMS_ENABLED } from '../config/portalConfig';
import { useSiteContent } from '../content/useSiteContent';

// ─── Icon Map ───────────────────────────────────────────────────────────────
// Maps the string stored in Django (e.g. "FaHome") to the actual React component.
// When you add a new icon in the admin, add it here too.
const ICON_MAP = {
  FaHome:         <FaHome size={14} />,
  FaInfoCircle:   <FaInfoCircle size={14} />,
  FaCogs:         <FaCogs size={14} />,
  FaFileAlt:      <FaFileAlt size={14} />,
  FaBell:         <FaBell size={14} />,
  FaBriefcase:    <FaBriefcase size={14} />,
  FaComments:     <FaComments size={14} />,
  FaDownload:     <FaDownload size={14} />,
  FaEnvelope:     <FaEnvelope size={14} />,
  FaGavel:        <FaGavel size={14} />,
  FaEllipsisH:    <FaEllipsisH size={14} />,
  FaChevronRight: <FaChevronRight size={12} />,
  FaShieldAlt:    <FaShieldAlt size={14} />,
  FaUsers:        <FaUsers size={14} />,
  FaNewspaper:    <FaNewspaper size={14} />,
  FaLink:         <FaLink size={14} />,
};

// Fallback hardcoded menu if API is unavailable
const FALLBACK_NAV = [
  { id: 1, label: 'Home',          href: '#',              icon: 'FaHome',      badge: '', children: [] },
  { id: 2, label: 'About Us',      href: '#about-detail',  icon: 'FaInfoCircle',badge: '', children: [] },
  { id: 3, label: 'Services',      href: '#services',      icon: 'FaCogs',      badge: '', is_mega_menu: true, children: [] },
  { id: 4, label: 'Documents',     href: '#documents',     icon: 'FaFileAlt',   badge: '', children: [] },
  { id: 5, label: 'Notifications', href: '#notifications', icon: 'FaBell',      badge: 'Live', children: [] },
  { id: 6, label: 'Tenders',       href: '#tenders',       icon: 'FaFileAlt',   badge: '', children: [] },
  { id: 7, label: 'RTI',           href: '#rti',           icon: 'FaGavel',     badge: 'Info', children: [] },
  { id: 8, label: 'More',          href: '#more',          icon: 'FaEllipsisH', badge: '', children: [
    { id: 9,  label: 'EoDB',       href: '#eodb',      icon: 'FaBriefcase', badge: '' },
    { id: 10, label: 'Grievances', href: '#grievances', icon: 'FaComments',  badge: '' },
    { id: 11, label: 'Downloads',  href: '#downloads',  icon: 'FaDownload',  badge: 'PDF' },
    { id: 12, label: 'Contact',    href: '#contact',    icon: 'FaEnvelope',  badge: '' },
  ]},
];

const Header = () => {
  const { content } = useSiteContent();
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

  // ── NEW: CMS-driven menu state ──────────────────────────────────────────
  const [navLinks, setNavLinks] = useState(FALLBACK_NAV);
  const [menuLoading, setMenuLoading] = useState(true);

  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // ── Fetch menu from Django API ──────────────────────────────────────────
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    fetch(`${API_BASE}/menu/`)
      .then(res => {
        if (!res.ok) throw new Error('Menu API unavailable');
        return res.json();
      })
      .then(data => {
        // DRF returns paginated { results: [...] } or plain array
        const items = data.results || data;
        if (items.length > 0) {
          setNavLinks(items);
        }
        setMenuLoading(false);
      })
      .catch(err => {
        console.warn('Menu API not available, using fallback menu.', err.message);
        setMenuLoading(false);
        // navLinks stays as FALLBACK_NAV — site still works
      });
  }, []);

  // ── Services mega-menu items (from content store, unchanged) ───────────
  const serviceMenuItems = useMemo(
    () => content.services.map((service) => ({
      href: '#services-detail',
      label: service.title,
      desc: service.desc,
    })),
    [content.services],
  );

  // ── Flat list for search (children + top-level) ─────────────────────────
  const searchableNavLinks = useMemo(
    () => navLinks.flatMap((link) => (link.children?.length > 0 ? link.children : [link])),
    [navLinks],
  );

  useEffect(() => {
    const updateActiveHash = () => setActiveHash(window.location.hash || '#');
    updateActiveHash();
    window.addEventListener('hashchange', updateActiveHash);
    return () => window.removeEventListener('hashchange', updateActiveHash);
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = theme; window.localStorage.setItem('dit-portal-theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.style.fontSize = fontScale === 100 ? '' : `${fontScale}%`; window.localStorage.setItem('dit-portal-font-scale', String(fontScale)); }, [fontScale]);
  useEffect(() => { document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal'; window.localStorage.setItem('dit-portal-contrast', highContrast ? 'high' : 'normal'); }, [highContrast]);
  useEffect(() => { document.documentElement.lang = language; window.localStorage.setItem('dit-portal-language', language); }, [language]);
  useEffect(() => () => { recognitionRef.current?.abort?.(); window.speechSynthesis?.cancel?.(); }, []);

  const isActiveLink = (href, children = []) => {
    if (children.length > 0) return children.some((child) => isActiveLink(child.href));
    if (href === '#') return activeHash === '#';
    if (href === '#services') return activeHash === '#services' || activeHash === '#services-detail';
    return activeHash === href;
  };

  const scrollToAnchor = (href) => {
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (isDetailRoute) window.scrollTo({ top: 0, behavior: 'smooth' });
      else scrollToAnchor(href);
    }, 80);
  };

  const handleNavClick = (event, href) => {
    event.preventDefault();
    setExpanded(false);
    setSearchMessage('');
    if (href.startsWith('http')) { window.open(href, '_blank', 'noopener noreferrer'); return; }
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

  const adjustFontScale = (delta) => setFontScale((c) => Math.min(120, Math.max(90, c + delta)));

  const focusMainContent = (event) => {
    event.preventDefault();
    const el = document.getElementById('main-content');
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const runPortalSearch = (rawQuery, source = 'typed') => {
    const cleanQuery = rawQuery.trim();
    const query = cleanQuery.toLowerCase();
    if (!query) {
      const msg = source === 'voice' ? 'I could not hear a search term. Please try again.' : 'Type a section like services, documents, or contact.';
      setSearchMessage(msg);
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
    setSearchMessage(source === 'voice' ? `No exact match for "${cleanQuery}". Opened Resource Centre.` : 'No exact match. Opened the Resource Centre.');
    if (source === 'voice') speakAssistant('No exact match found. Opening the Resource Centre.');
  };

  const handleSearch = (event) => { event.preventDefault(); runPortalSearch(searchQuery); };

  const handleVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSearchMessage('Voice search not supported. Please type your search.'); return; }
    if (isListening) { recognitionRef.current?.stop?.(); setIsListening(false); return; }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => { setIsListening(true); setSearchMessage('Listening... say a section name.'); };
    recognition.onresult = (e) => { const t = e.results?.[0]?.[0]?.transcript || ''; setSearchQuery(t); runPortalSearch(t, 'voice'); };
    recognition.onerror = (e) => { setSearchMessage(e.error === 'not-allowed' ? 'Microphone permission required.' : 'Voice search failed. Please try again.'); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ── Render helper: resolve icon string to JSX ───────────────────────────
  const getIcon = (iconName) => ICON_MAP[iconName] || <FaChevronRight size={12} />;

  return (
    <header className="site-header">
      {/* ── Utility bar (unchanged) ────────────────────────────────────── */}
      <div className="portal-utility-bar">
        <Container className="utility-inner">
          <div className="utility-links">
            <a href={CMS_ENABLED ? '#cms' : '#contact'} className="utility-link"><FaUser size={11} /> LOGIN</a>
            <a href="#" className="utility-link">PUDUCHERRY</a>
            <a href="#main-content" className="utility-link" onClick={focusMainContent}><FaScreenReader size={13} /> SCREEN READER</a>
          </div>
          <div className="utility-actions">
            <div id="accessibility-tools" className="font-tools" aria-label="Accessibility tools">
              <span className="accessibility-label"><FaUniversalAccess size={12} /> Accessibility</span>
              <button type="button" onClick={() => adjustFontScale(-10)} aria-label="Decrease font size">A-</button>
              <button type="button" onClick={() => setFontScale(100)} aria-label="Reset font size">A</button>
              <button type="button" onClick={() => adjustFontScale(10)} aria-label="Increase font size">A+</button>
              <button type="button" className={`contrast-toggle ${highContrast ? 'active' : ''}`} aria-label="Toggle high contrast" aria-pressed={highContrast} onClick={() => setHighContrast((c) => !c)}>
                <FaAdjust size={12} /><span>Contrast</span>
              </button>
            </div>
            <label className="language-selector">
              <FaLanguage size={13} aria-hidden="true" />
              <select value={language} aria-label="Select language" onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
              </select>
            </label>
            <a href="#contact" className="utility-link"><FaEnvelope size={11} /> CONTACT</a>
            <button type="button" className="dark-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme((c) => c === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <FaSun size={11} /> : <FaMoon size={11} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button type="button" className="utility-icon-button" aria-label="Open profile" onClick={() => { window.location.hash = CMS_ENABLED ? '#cms' : '#contact'; }}><FaUserCircle size={15} /></button>
            <button type="button" className="utility-icon-button" aria-label="Focus search" onClick={() => searchInputRef.current?.focus()}><FaSearch size={13} /></button>
          </div>
        </Container>
      </div>

      {/* ── Masthead (unchanged) ────────────────────────────────────────── */}
      <div className="portal-masthead">
        <Container className="masthead-inner">
          <div className="brand-panel">
            <div className="brand-logo-tile emblem-crop"><img src={emblemLogo} alt="Government emblem of India" /></div>
            <div className="brand-copy">
              <span className="portal-badge">Official Government Portal</span>
              <h1 className="department-bilingual-title">
                <span className="department-title-en">Directorate of Information Technology</span>
                <span className="department-title-ta" lang="ta">தகவல் தொழில்நுட்ப இயக்குநரகம்</span>
              </h1>
              <p className="government-bilingual-title">
                <span>Government of Puducherry</span>
                <span lang="ta">புதுச்சேரி அரசு</span>
              </p>
            </div>
            <div className="brand-logo-tile site-mark"><img src={siteLogo} alt="Government of Puducherry" /></div>
          </div>
          <div className="masthead-tools">
            <Form className="portal-search" onSubmit={handleSearch}>
              <div className="portal-search-field">
                <FormControl ref={searchInputRef} type="search" placeholder="Search portal" aria-label="Search portal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button type="button" className={`portal-voice-button ${isListening ? 'active' : ''}`} aria-label={isListening ? 'Stop voice search' : 'Start voice search'} onClick={handleVoiceSearch}><FaMicrophone size={14} /></Button>
                <Button type="submit" className="portal-search-button"><FaSearch size={16} /></Button>
              </div>
              {searchMessage && <span className="portal-search-feedback mt-2 text-end">{searchMessage}</span>}
            </Form>
            <div className="masthead-action-row">
              <button type="button" className="masthead-icon-button" title="Notifications"><FaBell size={16} /></button>
              <button type="button" className="masthead-icon-button" title="Profile"><FaUserCircle size={17} /></button>
              <button type="button" className="portal-menu-button"><FaUser size={13} /> PORTAL <FaChevronDown size={11} /></button>
              <button type="button" className="header-menu-toggle d-lg-none" aria-controls="basic-navbar-nav" aria-expanded={expanded} aria-label="Toggle navigation" onClick={() => setExpanded(!expanded)}>
                <FaBars size={18} />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Navigation Bar — CMS-DRIVEN ─────────────────────────────────── */}
      <Navbar expand="lg" expanded={expanded} className="portal-nav-bar">
        <Container className="portal-nav-container">
          <Navbar.Collapse id="basic-navbar-nav">

            {/* Mobile search */}
            <Form className="mobile-search d-md-none my-3" onSubmit={handleSearch}>
              <div className="portal-search-field">
                <FormControl type="search" placeholder="Search portal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button type="button" className={`portal-voice-button ${isListening ? 'active' : ''}`} onClick={handleVoiceSearch}><FaMicrophone size={13} /></Button>
                <Button type="submit" className="portal-search-button"><FaSearch size={14} /></Button>
              </div>
              {searchMessage && <span className="portal-search-feedback d-block mt-2">{searchMessage}</span>}
            </Form>

            <Nav className="portal-primary-nav">
              {navLinks.map((link) => {
                const icon = getIcon(link.icon);
                const hasChildren = link.children && link.children.length > 0;

                // ── Services Mega-Menu ──────────────────────────────────
                if (link.is_mega_menu) {
                  return (
                    <NavDropdown key={link.id}
                      id={`nav-dropdown-${link.id}`}
                      className={`portal-nav-dropdown ${isActiveLink(link.href) ? 'active' : ''}`}
                      title={<>{icon}<span>{link.label}</span></>}
                    >
                      <div className="mega-menu-intro">
                        <strong>Digital Service Channels</strong>
                        <span>Explore core platforms and citizen service touchpoints.</span>
                      </div>
                      <div className="mega-menu-grid">
                        <NavDropdown.Item href="#services-detail" onClick={(e) => handleNavClick(e, '#services-detail')}>
                          <span className="mega-menu-icon"><FaCogs size={14} /></span>
                          <span><strong>All Services</strong><small>View every digital governance service</small></span>
                        </NavDropdown.Item>
                        {/* Children from CMS (if any) */}
                        {link.children?.map((child) => (
                          <NavDropdown.Item key={child.id} href={child.href} onClick={(e) => handleNavClick(e, child.href)}>
                            <span className="mega-menu-icon">{getIcon(child.icon)}</span>
                            <span><strong>{child.label}</strong><small>{child.description || `Open ${child.label.toLowerCase()}`}</small></span>
                          </NavDropdown.Item>
                        ))}
                        {/* Services from content store (same as before) */}
                        {serviceMenuItems.map((s) => (
                          <NavDropdown.Item key={s.label} href={s.href} onClick={(e) => handleNavClick(e, s.href)}>
                            <span className="mega-menu-icon"><FaChevronRight size={12} /></span>
                            <span><strong>{s.label}</strong><small>{s.desc}</small></span>
                          </NavDropdown.Item>
                        ))}
                      </div>
                    </NavDropdown>
                  );
                }

                // ── Regular Dropdown (More, etc.) ───────────────────────
                if (hasChildren) {
                  return (
                    <NavDropdown key={link.id}
                      id={`nav-dropdown-${link.id}`}
                      className={`portal-nav-dropdown ${isActiveLink(link.href, link.children) ? 'active' : ''}`}
                      title={<>{icon}<span>{link.label}</span></>}
                    >
                      <div className="mega-menu-grid compact">
                        {link.children.map((child) => (
                          <NavDropdown.Item key={child.id} href={child.href}
                            onClick={(e) => handleNavClick(e, child.href)}
                            target={child.open_in_new_tab ? '_blank' : undefined}
                            rel={child.open_in_new_tab ? 'noopener noreferrer' : undefined}
                          >
                            <span className="mega-menu-icon">{getIcon(child.icon)}</span>
                            <span>
                              <strong>{child.label}</strong>
                              <small>{child.description || `Open ${child.label.toLowerCase()} section`}</small>
                            </span>
                          </NavDropdown.Item>
                        ))}
                      </div>
                    </NavDropdown>
                  );
                }

                // ── Simple Nav Link ─────────────────────────────────────
                return (
                  <Nav.Link key={link.id} href={link.href}
                    className={`portal-nav-link ${isActiveLink(link.href) ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    target={link.open_in_new_tab ? '_blank' : undefined}
                    rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  >
                    {icon}
                    <span>{link.label}</span>
                    {link.badge && <span className="nav-mini-badge">{link.badge}</span>}
                  </Nav.Link>
                );
              })}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
