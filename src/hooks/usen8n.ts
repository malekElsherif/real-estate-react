import { useQuery } from "@tanstack/react-query";
import { usegetme } from "./useUsers";
import { getAiRecommendations } from "../api/n8n";

export const useGetAiRecommendations = () => {
  const { data: currentUser } = usegetme();
  const userId = currentUser?.data.userId;

  return useQuery({
    queryKey: ["ai-recommendations", userId],
    queryFn: () => getAiRecommendations(Number(userId)),
    enabled: !!userId, // لا يتم التنفيذ إلا عند التعرف على المستخدم
  });
};
