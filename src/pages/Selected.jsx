import { useLocation, useNavigate } from "react-router-dom";

export default function Selected() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div>No item selected.</div>;

  return (
    <div className="selected">
      <img src={state.imageUrl} alt={state.name} />
      <h2>{state.name}</h2>
      <p>⭐ {state.rating}</p>
      <button onClick={() => navigate("/")}>Find Another</button>
    </div>
  );
}
