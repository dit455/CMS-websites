import { FaBullhorn } from 'react-icons/fa';
import { useSiteContent } from '../content/useSiteContent';

const NewsTicker = () => {
  const { content } = useSiteContent();
  const news = content.newsItems;

  return (
    <div className="news-ticker-container shadow-sm border-bottom">
      <div className="d-flex align-items-center">
        <div className="bg-danger text-white px-3 py-2 fw-bold small text-uppercase d-flex align-items-center gap-2" style={{ zIndex: 2, position: 'relative', minWidth: '160px' }}>
          <FaBullhorn /> Latest News
        </div>
        <div className="news-ticker-content" style={{ zIndex: 1 }}>
          {news.map((item, index) => (
            <span key={index} className="news-item fw-semibold">
              {item}
            </span>
          ))}
          {/* Repeat for continuous effect */}
          {news.map((item, index) => (
            <span key={`repeat-${index}`} className="news-item fw-semibold">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
