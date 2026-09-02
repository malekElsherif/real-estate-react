import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { addtofav, deletefav, getmyfav, isfav } from "../api/favourite";

export const useaddtoFav = (id:number) => {
  return useMutation({
    mutationFn: addtofav,
    mutationKey:['addtofav',id]
  })

};

export const usegetmyfav = () => {
  return useQuery({

    queryFn: getmyfav,
    queryKey:['getmyfav']
  })
};

export const useistfav = (id:number) => {
  return useQuery({
    queryFn:()=> isfav(id),
    queryKey:['isfav',id]
  })
};

export const usedelfav=(id:number) => {
  return useMutation({
    mutationFn: ()=>deletefav(id),
    mutationKey:['deletefav',id]
  })
};
