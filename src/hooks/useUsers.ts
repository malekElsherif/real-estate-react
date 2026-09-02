import { useQuery } from "@tanstack/react-query";
import { getme, getuserbyid } from "../api/user";

export const usegetme = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["me"],
    queryFn: getme,
    enabled: !!token,
    retry: false,
  });
};

export const usegetuserbyid = (id: number) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getuserbyid(id),
  });
};