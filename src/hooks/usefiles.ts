import { useMutation, useQuery } from "@tanstack/react-query";
import { addimg, getimgforprop } from "../api/images";

export const useaddimg = () => {
  return useMutation({
    mutationKey: ["addimg"],

    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData;
    }) => addimg(id, data),
  });
};

export const usegetimgbyid = (id: number) => {
  return useQuery({
    queryKey: ["getimgbyid", id],
    queryFn: () => getimgforprop(id),
  });
};