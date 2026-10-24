import api from "./axios";

export const getAiRecommendations = async (userId: number) => {
  // الـ api ده هو الـ axios instance اللي بيحط الـ Bearer Token في الهيدر لوحده
  const res = await api.get(
    "http://localhost:5679/webhook-test/6984e2d7-d3c5-4bb0-b648-e5c01b485cb5",
    {
      params: { userId },
    }
  );
  return res.data;
};
