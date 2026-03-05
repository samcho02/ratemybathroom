import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StackList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [stacks, setStacks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/stacks/category/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setStacks(data));
  }, [categoryId]);

  const handleSelect = (stackId) => {
    navigate(`/stacks/${stackId}`);
  };

  const handleCreate = () => {
    navigate(`/stacks/${categoryId}/create`);
  };

  const handleRemix = (stackId) => {
    navigate(`/stacks/${stackId}/remix`);
  };

  return (
    <div>
      <h2>Stacks</h2>

      <button onClick={handleCreate}>Create New Stack</button>

      {stacks.map((stack) => (
        <div
          key={stack._id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <h3>{stack.title}</h3>
          <p>{stack.description}</p>
          <p>
            Likes: {stack.likeCount} | Remixes: {stack.remixCount}
          </p>

          <button onClick={() => handleSelect(stack._id)}>Select</button>

          <button onClick={() => handleRemix(stack._id)}>Remix</button>
        </div>
      ))}
    </div>
  );
}
