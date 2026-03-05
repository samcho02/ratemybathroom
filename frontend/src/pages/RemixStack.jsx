import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RemixStack() {
  const { stackId } = useParams();
  const navigate = useNavigate();

  const [stack, setStack] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/stacks/${stackId}`)
      .then((res) => res.json())
      .then((data) => setStack(data));
  }, [stackId]);

  const handleRemix = async () => {
    const userId = localStorage.getItem("userId");

    const res = await fetch(
      `http://localhost:5000/api/stacks/${stackId}/remix`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

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
