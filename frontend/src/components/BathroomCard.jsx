import TinderCard from "react-tinder-card";

export default function BathroomCard({ bathroom, onSwipe }) {
  return (
    <TinderCard
      key={bathroom._id}
      onSwipe={onSwipe}
      preventSwipe={["up", "down"]}
    >
      <div
        className="card"
        style={{ backgroundImage: `url(${bathroom.imageUrl})` }}
      >
        <div className="info">
          <h2>{bathroom.name}</h2>
          <p>⭐ {bathroom.rating}</p>
        </div>
      </div>
    </TinderCard>
  );
}
