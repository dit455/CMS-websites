import { motion } from 'framer-motion';

const MotionSection = motion.section;

const SectionWrapper = ({ children }) => (
  <MotionSection
    className="section-shell"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    {children}
  </MotionSection>
);

export default SectionWrapper;
