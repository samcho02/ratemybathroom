import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { id: "restaurants", label: "Restaurants" },
    { id: "movies", label: "Movies" },
    { id: "bathrooms", label: "Bathrooms" },
  ];

  return (
    <div className="category-page">
      <div className="category-card">
        <h1 className="category-title">What are you choosing today?</h1>

        <div className="category-list">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/swipe/${c.id}`)}
              className="category-button"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
