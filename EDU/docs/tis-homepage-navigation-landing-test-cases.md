# Teacher Information System Homepage QA Test Cases

Status values are set to `Not Run` for execution tracking.

| Test Case ID | Module | Scenario | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| TC-001 | Header Navigation | Home menu navigates to top | Click `Home` in header navigation. | Page scrolls/navigates to homepage hero without layout shift. | High | Not Run |
| TC-002 | Header Navigation | Teacher Services menu navigates to section | Click `Teacher Services`. | Smooth scroll lands on Teacher Services section; heading is visible. | High | Not Run |
| TC-003 | Header Navigation | Transfer Counselling menu navigates to workflow | Click `Transfer Counselling`. | Smooth scroll lands on Transfer Workflow / Counselling section. | High | Not Run |
| TC-004 | Header Navigation | Notifications menu navigates to latest updates | Click `Notifications`. | Smooth scroll lands on Latest Notifications section. | High | Not Run |
| TC-005 | Header Navigation | Reports menu behavior | Click `Reports`. | Reports menu opens or navigates to Reports section/page as designed. | Medium | Not Run |
| TC-006 | Header Navigation | Contact menu navigates to footer/contact | Click `Contact`. | Smooth scroll lands on footer/contact information. | Medium | Not Run |
| TC-007 | Header Navigation | Downloads menu navigates to downloads/footer links | Click `Downloads`. | Downloads section or footer downloads link group is visible. | Medium | Not Run |
| TC-008 | Header Navigation | Teacher Login button behavior | Click `Teacher Login` in header. | Login action opens login page/modal or correct demo behavior. | High | Not Run |
| TC-009 | Header Navigation | Active menu highlight after click | Click each main nav item one by one. | Active menu state updates to selected/current section. | Medium | Not Run |
| TC-010 | Header Navigation | Header remains usable while scrolling | Scroll page from top to footer and use nav. | Header/menu remains reachable and links work consistently. | Medium | Not Run |
| TC-011 | Dropdown / Mega Menu | Teacher Services dropdown opens | Hover/click `Teacher Services`. | Dropdown opens with service options visible and aligned. | High | Not Run |
| TC-012 | Dropdown / Mega Menu | Teacher Services dropdown links | Click each Teacher Services dropdown item. | Each item navigates to correct section or opens correct action. | High | Not Run |
| TC-013 | Dropdown / Mega Menu | Teacher Services dropdown closes outside click | Open dropdown, click outside. | Dropdown closes without triggering unintended navigation. | Medium | Not Run |
| TC-014 | Dropdown / Mega Menu | Transfer Counselling dropdown opens | Hover/click `Transfer Counselling`. | Dropdown opens with counselling-related links. | High | Not Run |
| TC-015 | Dropdown / Mega Menu | Transfer Counselling dropdown link routing | Click each counselling dropdown option. | Correct section/page/action is opened. | High | Not Run |
| TC-016 | Dropdown / Mega Menu | Reports dropdown opens | Hover/click `Reports`. | Reports dropdown opens with report categories. | Medium | Not Run |
| TC-017 | Dropdown / Mega Menu | Reports dropdown empty/error handling | Open Reports dropdown when no data is available. | User sees meaningful empty/demo state, not broken UI. | Medium | Not Run |
| TC-018 | Dropdown / Mega Menu | Notifications dropdown opens | Hover/click `Notifications`. | Notifications dropdown opens with latest notice options/categories. | High | Not Run |
| TC-019 | Dropdown / Mega Menu | Notifications dropdown closes on Escape | Open dropdown and press `Esc`. | Dropdown closes and focus returns to trigger. | High | Not Run |
| TC-020 | Dropdown / Mega Menu | Dropdown keyboard traversal | Use Tab/Arrow keys through dropdown items. | Focus moves logically; selected item can be activated with Enter/Space. | High | Not Run |
| TC-021 | Landing Page | Hero carousel first slide renders | Load homepage. | Hero displays first slide with heading, description, CTAs, and illustration. | High | Not Run |
| TC-022 | Landing Page | Hero carousel auto-slide | Wait 5-6 seconds on hero. | Carousel advances to next slide automatically. | High | Not Run |
| TC-023 | Landing Page | Hero previous control | Click previous control. | Carousel moves to previous slide and content updates. | High | Not Run |
| TC-024 | Landing Page | Hero next control | Click next control. | Carousel moves to next slide and content updates. | High | Not Run |
| TC-025 | Landing Page | Hero indicators | Click each slide indicator. | Corresponding slide becomes active; indicator state updates. | High | Not Run |
| TC-026 | Landing Page | Hero CTA primary | Click primary CTA on each slide. | Correct action opens or navigates for that slide. | High | Not Run |
| TC-027 | Landing Page | Hero CTA secondary | Click secondary CTA on each slide. | Correct section/action opens for that slide. | Medium | Not Run |
| TC-028 | Landing Page | Quick services strip renders | Load homepage below hero. | Six quick services are visible: Login, Apply Transfer, Vacancy, Notifications, Orders, Helpdesk. | High | Not Run |
| TC-029 | Landing Page | Quick service link behavior | Click each quick service. | Each item navigates or triggers expected action. | High | Not Run |
| TC-030 | Landing Page | Portal statistics section | Load statistics band. | Four stats cards display outside hero and are readable. | Medium | Not Run |
| TC-031 | Landing Page | Teacher dashboard actions render | Scroll to Teacher Services. | Six service cards render with icon, title, description, metric, and action. | High | Not Run |
| TC-032 | Landing Page | Teacher dashboard action buttons | Click action button on each service card. | Correct demo/action behavior triggers. | High | Not Run |
| TC-033 | Landing Page | Latest notifications section renders | Scroll to notifications. | Heading, category filters, and notice list are visible. | High | Not Run |
| TC-034 | Landing Page | Notification category filters | Click `All`, `Transfer`, `Vacancy`, `Grievance`, `Circular`. | List filters according to selected category. | High | Not Run |
| TC-035 | Landing Page | Notification download button | Click download on each notice. | Download action triggers or demo message appears. | High | Not Run |
| TC-036 | Landing Page | Transfer workflow renders | Scroll to Transfer Workflow. | Timeline steps and supporting panels are visible. | Medium | Not Run |
| TC-037 | Landing Page | Workflow learn-more controls | Click learn-more controls if available. | Details expand/collapse without layout overlap. | Medium | Not Run |
| TC-038 | Landing Page | Vacancy dashboard renders | Scroll to Vacancy Dashboard. | Summary cards, filters, table, and map panel are visible. | High | Not Run |
| TC-039 | Landing Page | Vacancy search filter | Enter school/region text in vacancy search. | Table filters to matching rows. | High | Not Run |
| TC-040 | Landing Page | Vacancy dropdown filters | Change region, school type, and post filters. | Table updates according to selected filters. | High | Not Run |
| TC-041 | Landing Page | Vacancy export buttons | Click View Full List, Download PDF, Export Excel. | Correct action/demo behavior triggers for each. | Medium | Not Run |
| TC-042 | Landing Page | Interactive region map marker behavior | Hover/click/focus region markers. | Active region details update without overlap. | Medium | Not Run |
| TC-043 | Landing Page | Grievance section renders | Scroll to Grievance section. | Grievance information, stats, Lodge Grievance, and Track Status are visible. | High | Not Run |
| TC-044 | Landing Page | Lodge Grievance CTA | Click `Lodge Grievance`. | Grievance action opens correct page/modal/demo behavior. | High | Not Run |
| TC-045 | Landing Page | Track Status CTA | Click `Track Status`. | Tracking modal opens with reference input and status content. | High | Not Run |
| TC-046 | Landing Page | Footer renders | Scroll to footer. | Department contact info, link groups, compliance badges, portal link, and back-to-top button are visible. | Medium | Not Run |
| TC-047 | Functional Testing | Smooth scroll behavior | Click all anchor-based links from header, quick strip, utility menu, and footer. | Page scrolls smoothly to correct section with heading not hidden. | High | Not Run |
| TC-048 | Functional Testing | Back to top button | Scroll to footer and click `Back to Top`. | Page smoothly scrolls to top/home hero. | High | Not Run |
| TC-049 | Functional Testing | External Government Portal link | Click `Government Portal`. | Opens correct external URL in same/new tab as designed. | Medium | Not Run |
| TC-050 | Functional Testing | Invalid or unavailable action handling | Click demo-only actions. | User sees clear feedback; no console error or blank page. | Medium | Not Run |
| TC-051 | Responsive Testing | Desktop layout | Test at 1440px width. | Hero is full-width, content aligned, sections use desktop grids, no horizontal overflow. | High | Not Run |
| TC-052 | Responsive Testing | Laptop layout | Test at 1366px width. | Navigation, hero, quick services, and cards fit without clipping. | High | Not Run |
| TC-053 | Responsive Testing | Tablet layout | Test at 768px width. | Menus collapse appropriately; cards wrap; text remains readable. | High | Not Run |
| TC-054 | Responsive Testing | Mobile layout | Test at 390px width. | Hero remains compact, quick services stack, no horizontal scrolling. | High | Not Run |
| TC-055 | Responsive Testing | Mobile menu open/close | Open mobile menu, navigate, close. | Menu opens, links are tappable, closes after selection or close action. | High | Not Run |
| TC-056 | Accessibility Testing | Keyboard navigation through header | Use Tab from top of page. | Focus order follows visual order and all interactive elements are reachable. | High | Not Run |
| TC-057 | Accessibility Testing | Focus visible | Tab through links, buttons, carousel controls, filters, forms. | Visible focus outline appears on every interactive element. | High | Not Run |
| TC-058 | Accessibility Testing | Carousel screen reader labels | Inspect carousel controls and indicators with screen reader. | Buttons have meaningful labels and current slide state is announced. | High | Not Run |
| TC-059 | Accessibility Testing | Dropdown ARIA behavior | Inspect dropdown triggers/items. | Expanded/collapsed state and menu semantics are available to assistive tech. | High | Not Run |
| TC-060 | Accessibility Testing | Contrast compliance | Check text/buttons/badges across hero, cards, footer. | Text contrast meets WCAG AA minimum. | High | Not Run |
| TC-061 | Accessibility Testing | Font size controls increase | Click `A+` repeatedly. | Font size increases within limit without overlap/clipping. | Medium | Not Run |
| TC-062 | Accessibility Testing | Font size controls decrease | Click `A-` repeatedly. | Font size decreases within limit and remains readable. | Medium | Not Run |
| TC-063 | Accessibility Testing | High contrast mode | Enable contrast mode. | Key content remains readable; controls are still visually distinct. | High | Not Run |
| TC-064 | Accessibility Testing | Language toggle | Toggle English/Tamil. | Language label changes; content does not break layout. | Medium | Not Run |
| TC-065 | Accessibility Testing | Reduced motion / carousel usability | Test with reduced-motion preference or manual controls. | Carousel remains usable; user can manually control slides. | Medium | Not Run |

## Possible Bugs / Risks

| ID | Area | Possible Bug / Risk | Impact | Suggested Check |
|---|---|---|---|---|
| BUG-001 | Header Navigation | Some requested nav items such as `Reports` may not have visible implemented sections. | User confusion or dead navigation. | Confirm Reports route/section exists or add disabled/coming-soon state. |
| BUG-002 | Active Highlight | Active menu may not update during smooth scroll or manual scroll. | Users lose orientation. | Add scroll-spy behavior and test section threshold logic. |
| BUG-003 | Dropdowns | Mega menus may not support keyboard open/close if only hover is implemented. | Accessibility failure. | Ensure Enter/Space opens and Escape closes. |
| BUG-004 | Hero Carousel | Auto-slide may continue while user is interacting with controls. | Annoying or disorienting UX. | Pause on hover/focus and resume after interaction. |
| BUG-005 | Hero Carousel | Carousel may lack `aria-live` or current slide announcement. | Screen reader users may miss slide changes. | Add non-intrusive slide status text. |
| BUG-006 | Mobile | Full-width hero or wide tables can cause horizontal overflow. | Poor mobile usability. | Test 320px, 375px, 390px, and 430px widths. |
| BUG-007 | Notifications | Download buttons may only open demo messages instead of real file downloads. | Functional gap. | Verify production download URLs and file names. |
| BUG-008 | Vacancy Dashboard | Filters may produce empty results without clear empty state. | User confusion. | Add empty table message and reset filters action. |
| BUG-009 | Footer | Back-to-top target may not account for sticky header height. | Top content may be partially hidden. | Verify final scroll position on all breakpoints. |
| BUG-010 | Accessibility Toolbar | Font scaling may not apply uniformly across all sections. | Inconsistent accessibility support. | Verify text scale on hero, cards, tables, footer. |

## Improvement Suggestions

- Add `aria-expanded`, `aria-controls`, and keyboard support for every dropdown trigger.
- Add scroll-spy active states for header navigation.
- Add pause-on-hover/focus for the hero carousel.
- Add `aria-label` text for icon-only controls and carousel indicators.
- Add real download file validation: filename, MIME type, file size, and error handling.
- Add empty states for filtered notifications and vacancy dashboard results.
- Add sticky header offset handling for anchor navigation.
- Add automated smoke tests for desktop/mobile navigation and key CTAs.
