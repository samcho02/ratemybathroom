import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  /* ===========================
     FETCH CATEGORIES
  =========================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /* ===========================
     RENDER
  =========================== */

  return (
    <div className="category-page">
      <div className="category-card">
        <h1 className="category-title">What are you choosing today?</h1>

        <div className="category-list">
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => navigate(`/swipe/${c._id}`)}
              className="category-button"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
