import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RemixStack() {
  const { stackId } = useParams();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [stack, setStack] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/stacks/${stackId}`)
      .then((res) => res.json())
      .then((data) => setStack(data));
  }, [stackId]);

  const handleRemix = async () => {
    // Assuming you store the Google ID token in localStorage after login
    const token = localStorage.getItem("googleToken");

    const res = await fetch(`${API_BASE}/stacks/${stackId}/remix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token here
      },
    });

    const newStack = await res.json();
    navigate(`/stack/${newStack._id}`);
  };

  if (!stack) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <h2>Remix Stack</h2>

      <div className="stack-preview">
        <h3>{stack.title}</h3>
        <p>{stack.description}</p>
        <p>Items: {stack.items?.length || 0}</p>
      </div>

      <button onClick={handleRemix}>Create Remix</button>
    </div>
  );
}
