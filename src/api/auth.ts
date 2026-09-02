import { useQueryClient } from "@tanstack/react-query";
import api from "./axios";

export const login = async (data: any) => {
    try {
        const res = await api.post("/auth/login", data);
        return res.data;
    } catch (error) {
     throw error;
    }
}

export const register = async (data: any) => {
    try {
        const res = await api.post("/auth/register", data);
        return res.data;
    } catch (error) {
       throw error
    }
}



export const logout = () => {const queryClient = useQueryClient();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  queryClient.removeQueries({
    queryKey: ["me"],
  });
};



   


