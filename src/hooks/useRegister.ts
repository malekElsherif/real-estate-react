import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";



export const useregister=()=>{
   return useMutation({
        mutationKey:['register'],
        mutationFn:(data:any)=>register(data)
    })
}