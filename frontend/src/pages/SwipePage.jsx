import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SwipePage() {
  const { stackId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [reviewOpenId, setReviewOpenId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  /* ===========================
     LOAD ITEMS
  =========================== */

  useEffect(() => {
    if (!stackId) return;

    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/items/${stackId}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch items");

        const data = await res.json();
        setItems(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    return () => controller.abort();
  }, [stackId]);

  /* ===========================
     HANDLE SWIPE
  =========================== */

  const handleSwipe = useCallback(
    async (direction, itemId) => {
      const selectedItem = items.find((i) => i._id === itemId);

      setItems((prev) => prev.filter((i) => i._id !== itemId));

      try {
        await fetch(`${API_BASE}/swipe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            itemId,
            stackId: stackId,
            direction,
          }),
        });
      } catch (err) {
        console.error("Swipe failed:", err);
      }

      if (direction === "right" && selectedItem) {
        navigate("/selected", { state: selectedItem });
      }
    },
    [items, stackId, userId, navigate]
  );

  /* ===========================
     RENDER STATES
  =========================== */

  if (loading)
    return (
      <div className="swipe-container state-screen">
        <div className="state-message">Loading...</div>
      </div>
    );
  if (error) return <div className="swipe-container">Error: {error}</div>;
  if (!items.length)
    return (
      <div className="swipe-container state-screen">
        <div className="state-message">No more items</div>
      </div>
    );

  /* ===========================
     RENDER UI
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
                  className={`item-description ${
                    expandedId === item._id ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setExpandedId((prev) =>
                      prev === item._id ? null : item._id
                    )
                  }
                >
                  {item.description}
                </p>
              </div>

              <div className="item-actions">
                <button onClick={() => setReviewOpenId(item._id)}>💬</button>
              </div>
            </div>

            {reviewOpenId === item._id && (
              <div className="review-drawer">
                <h3>Reviews</h3>
                <p>No reviews yet.</p>
                <button
                  className="close-reviews"
                  onClick={() => setReviewOpenId(null)}
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
