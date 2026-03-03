import bathrooms from "../data/bathrooms";

// simple distance calculator (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getRecommendation = async (lat, lng) => {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const scored = bathrooms.map((b) => {
    const distance = getDistance(lat, lng, b.latitude, b.longitude);

    const proximityScore = 1 / (distance + 0.1);

    const score =
      b.cleanlinessScore * 0.4 + b.rating * 0.3 + proximityScore * 10 * 0.3;

    return { ...b, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // return top random from top 3 for variety
  const topThree = scored.slice(0, 3);
  return topThree[Math.floor(Math.random() * topThree.length)];
};
