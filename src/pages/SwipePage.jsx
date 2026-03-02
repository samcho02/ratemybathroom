import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";
import { getRecommendations } from "../services/recommendationEngine";

export default function SwipePage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [showReviews, setShowReviews] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocation({
      lat: 37.4979,
      lng: 127.0276,
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await getRecommendations(category, location);
      setItems(data);
    };
    load();
  }, [category, location]);

  const handleSwipe = (dir, itemId) => {
    if (dir === "right") {
      const selectedItem = items.find((i) => i.id === itemId);
      navigate("/selected", { state: selectedItem });
    }

    // remove swiped card from stack
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div className="swipe-container">
      {items.map((item) => (
        <TinderCard
          key={item.id}
          onSwipe={(dir) => handleSwipe(dir, item.id)}
          preventSwipe={["up", "down"]}
        >
          <div
            className="movie-card"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            <div className="movie-overlay">
              <div className="movie-info">
                <h2>{item.name}</h2>
                <p className="movie-meta">
                  ⭐ {item.rating} • {item.genre}
                </p>
                <p
                  className={`movie-description ${expanded ? "expanded" : ""}`}
                  onClick={() => setExpanded(!expanded)}
                >
                  {item.description}
                </p>
              </div>

              <div className="movie-actions">
                <button onClick={() => setShowReviews(item.id)}>
                  💬 {item.reviews?.length || 0}
                </button>
              </div>
            </div>

            {showReviews === item.id && (
              <div className="review-drawer">
                <h3>Reviews</h3>
                {item.reviews.map((r) => (
                  <div key={r.id} className="review">
                    <strong>{r.user}</strong>
                    <p>{r.text}</p>
                  </div>
                ))}
                <button
                  className="close-reviews"
                  onClick={() => setShowReviews(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </TinderCard>
      ))}
    </div>
  );
}
