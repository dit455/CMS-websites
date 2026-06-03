import { Carousel, Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import hero1 from '../assets/img/It hero banner.png';
import hero2 from '../assets/img/ditdi11022024r.png';
import { useSiteContent } from '../content/useSiteContent';

const MotionDiv = motion.div;

const heroImages = { hero1, hero2 };

const HeroSlider = () => {
  const { content } = useSiteContent();

  return (
    <section className="hero-shell position-relative">
      <Carousel fade className="hero-carousel overflow-hidden shadow-sm" indicators interval={6000} controls={false}>
        {content.heroSlides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 100%)',
                zIndex: 1,
              }}
            />
            <img
              className="d-block w-100 h-100 object-fit-cover"
              src={slide.imageUrl || heroImages[slide.imageKey] || hero1}
              alt={slide.title}
            />
            <Carousel.Caption className="hero-caption d-flex flex-column justify-content-center h-100 text-start px-md-5">
              <Container>
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="col-lg-8 col-xl-7"
                >
                  <span className={`badge ${slide.variant === 'primary' ? 'bg-primary' : 'hero-kicker'} mb-3 px-3 py-2 rounded-pill shadow-sm letter-spacing-1 fw-bold`}>
                    {slide.kicker}
                  </span>
                  <h1 className="hero-title fw-bolder mb-3 text-white lh-sm text-shadow">
                    {slide.title}
                  </h1>
                  <p className="hero-copy lead mb-4 text-light fw-normal opacity-75">
                    {slide.description}
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    {slide.primaryCta && (
                      <Button
                        as="a"
                        href={slide.primaryHref}
                        variant={slide.variant || 'danger'}
                        size="lg"
                        className="rounded-pill px-4 py-3 shadow d-flex align-items-center gap-2 fw-bold hover-lift"
                      >
                        {slide.primaryCta} <FaArrowRight size={14} />
                      </Button>
                    )}
                    {slide.secondaryCta && (
                      <Button
                        as="a"
                        href={slide.secondaryHref}
                        variant="outline-light"
                        size="lg"
                        className="rounded-pill px-4 py-3 shadow d-flex align-items-center gap-2 fw-bold hover-lift"
                      >
                        {slide.secondaryCta}
                      </Button>
                    )}
                  </div>
                </MotionDiv>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container className="position-relative" style={{ zIndex: 10 }}>
        <MotionDiv
          className="hero-stats bg-white shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
        >
          {content.portalStats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </MotionDiv>
      </Container>

      <style jsx="true">{`
        .hover-lift {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .letter-spacing-1 {
          letter-spacing: 1px;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
