import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const quickPrompts = [
  'How do I contact the helpdesk?',
  'Show me services',
  'Where are documents?',
  'Submit a grievance',
];

const getKnowledgeBase = (site) => [
  {
    keywords: ['service', 'services', 'pswan', 'sdc', 'data centre', 'csc', 'common services'],
    response:
      'You can explore PSWAN, State Data Centre, and Common Services Centres in the services section.',
    action: { label: 'Open Services', href: '#services' },
  },
  {
    keywords: ['document', 'documents', 'download', 'downloads', 'policy', 'guideline', 'order', 'forms'],
    response:
      'Policies, implementation orders, templates, reports, and downloads are available in the Resource Centre.',
    action: { label: 'Open Resource Centre', href: '#documents' },
  },
  {
    keywords: ['grievance', 'complaint', 'feedback', 'track', 'status', 'reference'],
    response:
      'Use the grievance form to submit a concern. After submitting, you can track it with the generated reference ID.',
    action: { label: 'Open Grievances', href: '#grievances' },
  },
  {
    keywords: ['contact', 'phone', 'email', 'helpdesk', 'address', 'location', 'map'],
    response: `The contact email is ${site.helpdeskEmailDisplay || site.helpdeskEmail} and the support line is ${site.phone}.`,
    action: { label: 'Open Contact', href: '#contact' },
  },
  {
    keywords: ['rti', 'information', 'transparency'],
    response:
      'RTI and public information support routes are listed under the Right to Information area.',
    action: { label: 'Open RTI', href: '#rti' },
  },
];

const initialMessages = [
  {
    id: 1,
    role: 'bot',
    text: 'Hi, I can help you find DIT services, downloads, grievance support, and contact details.',
  },
];

const getBotReply = (message, site) => {
  const normalized = message.toLowerCase();
  const knowledgeBase = getKnowledgeBase(site);
  const match = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (match) {
    return match;
  }

  return {
    response:
      'I can help with services, documents, downloads, grievances, RTI, and contact details. Try one of the quick questions below.',
    action: { label: 'View Resource Centre', href: '#documents' },
  };
};

const Chatbot = () => {
  const { content } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = (messageText) => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage) return;

    const reply = getBotReply(cleanMessage, content.site);

    setMessages((current) => {
      const latestMessageId = current.reduce((maxId, message) => Math.max(maxId, message.id), 0);
      return [
        ...current,
        { id: latestMessageId + 1, role: 'user', text: cleanMessage },
        {
          id: latestMessageId + 2,
          role: 'bot',
          text: reply.response,
          action: reply.action,
        },
      ];
    });
    setInput('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chatbot-widget" aria-live="polite">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="chatbot-panel shadow-soft"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            aria-label="DIT virtual assistant"
          >
            <div className="chatbot-header">
              <div className="d-flex align-items-center gap-2">
                <span className="chatbot-avatar">
                  <FaRobot size={16} />
                </span>
                <div>
                  <h2 className="chatbot-title">DIT Assistant</h2>
                  <p className="chatbot-status">Online for portal guidance</p>
                </div>
              </div>
              <button
                type="button"
                className="chatbot-icon-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chatbot-message ${message.role}`}>
                  <span className="chatbot-message-icon">
                    {message.role === 'bot' ? <FaRobot size={12} /> : <FaUser size={12} />}
                  </span>
                  <div className="chatbot-bubble">
                    <p>{message.text}</p>
                    {message.action && (
                      <a href={message.action.href} className="chatbot-action">
                        {message.action.label} <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="chatbot-prompts">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <form className="chatbot-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                placeholder="Ask about services, documents..."
                onChange={(event) => setInput(event.target.value)}
                aria-label="Chat message"
              />
              <button type="submit" aria-label="Send message">
                <FaPaperPlane size={14} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="chatbot-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close DIT assistant' : 'Open DIT assistant'}
      >
        {isOpen ? <FaTimes size={20} /> : <FaComments size={22} />}
        <span>{isOpen ? 'Close' : 'Ask DIT'}</span>
      </button>
    </div>
  );
};

export default Chatbot;
