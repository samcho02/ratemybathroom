import restaurants from "../data/restaurants";
import movies from "../data/movies";
import bathrooms from "../data/bathrooms";

function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat2) return 1;

  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getRecommendations(category, location) {
  await new Promise((r) => setTimeout(r, 300));

  let dataset;

  switch (category) {
    case "restaurants":
      dataset = restaurants;
      break;
    case "movies":
      dataset = movies;
      break;
    case "bathrooms":
      dataset = bathrooms;
      break;
    default:
      return [];
  }

  return dataset
    .map((item) => {
      let score = item.rating * 0.6;

      if (location && item.latitude) {
        const dist = getDistance(
          location.lat,
          location.lng,
          item.latitude,
          item.longitude
        );
        score += (1 / (dist + 0.1)) * 5;
      }

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
}
