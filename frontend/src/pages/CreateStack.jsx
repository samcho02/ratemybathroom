import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateStack() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("googleToken");

    if (!token) {
      alert("You must be logged in to create a stack.");
      return navigate("/"); // Redirect to login or home if no token
    }

    const res = await fetch(`${API_BASE}/stacks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryId,
        title,
        description,
      }),
    });

    const data = await res.json();

    navigate(`/stacks/${data._id}`);
  };

  return (
    <div className="page-container">
      <h2>Create Stack</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title (e.g. Food)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (e.g. when you are hungry at night)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
