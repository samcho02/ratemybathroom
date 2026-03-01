import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getRecommendation = async (lat, lng) => {
  const res = await API.get("/recommend", {
    params: { lat, lng },
  });
  return res.data;
};
