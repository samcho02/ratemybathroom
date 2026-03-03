import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

export default function SwipePage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [showReviews, setShowReviews] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // local storage
  const userId = localStorage.getItem("userId");

  /* ===========================
     LOAD ITEMS FROM BACKEND
  =========================== */

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/items/${categoryId}`
        );
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };

    if (categoryId) fetchItems();
  }, []);

  /* ===========================
     HANDLE SWIPE
  =========================== */

  const handleSwipe = async (dir, itemId) => {
    try {
      await fetch("http://localhost:5000/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemId,
          categoryId: categoryId,
          direction: dir,
        }),
      });
    } catch (err) {
      console.error("Swipe failed:", err);
    }

    // Remove from stack visually
    setItems((prev) => prev.filter((item) => item._id !== itemId));

    if (dir === "right") {
      const selectedItem = items.find((i) => i._id === itemId);
      navigate("/selected", { state: selectedItem });
    }
  };

  /* ===========================
     RENDER
  =========================== */

  return (
    <div className="swipe-container">
      {items.map((item) => (
        <TinderCard
          key={item._id}
          onSwipe={(dir) => handleSwipe(dir, item._id)}
          preventSwipe={["up", "down"]}
        >
          <div
            className="item-card"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            <div className="item-overlay">
              <div className="item-info">
                <h2>{item.name}</h2>

                <p
                  className={`item-description ${expanded ? "expanded" : ""}`}
                  onClick={() => setExpanded(!expanded)}
                >
                  {item.description}
                </p>
              </div>

              <div className="item-actions">
                <button onClick={() => setShowReviews(item._id)}>💬</button>
              </div>
            </div>

            {showReviews === item._id && (
              <div className="review-drawer">
                <h3>Reviews</h3>
                <p>No reviews yet.</p>
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
