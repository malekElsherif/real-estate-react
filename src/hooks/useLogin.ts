import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginData) => login(data),
  });
};