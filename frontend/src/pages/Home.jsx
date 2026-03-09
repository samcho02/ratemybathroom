import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [categories, setCategories] = useState([]);

  /* ===========================
     FETCH CATEGORIES
  =========================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
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
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => navigate(`/category/${category._id}/stacks`)}
              className="category-button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
