import { useMutation, useQuery, useQueryClient,  } from "@tanstack/react-query"
import { addProp, deleteProp, editProp, getallpendingproperties, getallprop, getbyid, getbyuser, makePropertyAvailableUnavailable } from "../api/properites"

export const useaddprop=()=>{
    return useMutation({
        mutationKey:['addprop'],
        mutationFn:(data:any)=>addProp(data)


    })
}

export const usegetallprop=()=>{
    return useQuery({
        queryKey:['getallprop'],
        queryFn:getallprop


    })
}

export const usegetbyid=(id:Number)=>{
    return useQuery({
        queryKey:['getbyid'],
        queryFn:()=>getbyid(id)


    })
}

export const usegetpropbyuser=(id:Number)=>{
    return useQuery({
        queryKey:['getbyuser',id],
        queryFn:()=>getbyuser(id)


    })
}

export const useeditprop=(id:Number)=>{
    return useMutation({
        mutationKey:['editprop',id],
        mutationFn:(data:any)=>editProp(id,data)


    })
}
export const usedeleteprop=()=>{
    const queryclient=useQueryClient()
    return useMutation({
        mutationKey:['deleteprop'],
        mutationFn:(id:Number)=>deleteProp(id),
        onSuccess:()=>{
            queryclient.invalidateQueries({queryKey:['getallprop']})
        }


    })
}

export const useAvailablityprop=(id:Number)=>{
    return useMutation({
        mutationKey:['verifyprop',id],
        mutationFn:()=>makePropertyAvailableUnavailable(id),


    })
}

export const usegetallpendingproperties=()=>{
    return useQuery({
        queryKey:['getallpendingproperties'],
        queryFn:getallpendingproperties


    })
}
