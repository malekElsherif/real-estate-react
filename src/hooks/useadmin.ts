import { useMutation, useQuery } from "@tanstack/react-query"
import { activeuser, deactiveuser, deleteuser, getactivityreportforuser, getallusers, getPendingAgent, getverificationstatios, rejictAgent, verifyagent } from "../api/admin"

export const  usegetallusers= ()=>{
    return useQuery({
        queryKey:['getallusers'],
        queryFn:getallusers
    })
}

export const useactiveuser=(id:Number)=>{
    return useMutation({
        mutationKey:['activeuser',id],
        mutationFn:()=>activeuser(id)
    })
}

export const usedeactiveuser=(id:Number)=>{
    return useMutation({
        mutationKey:['deactiveuser',id],
        mutationFn:()=>deactiveuser(id)
    })
}

export const usegetuseractivityreport=(id:Number)=>{
    return useQuery({
        queryKey:['getuseractivityreport',id],
        queryFn:()=>getactivityreportforuser(id)
    })
}

export const usedeleteuser=(id:Number)=>{
    return useMutation({
        mutationKey:['deleteuser',id],
        mutationFn:()=>deleteuser(id)
    })

}

export const usegetpendingagent=()=>{
    return useQuery({
        queryKey:['getpendingagent'],
        queryFn:getPendingAgent
    })
}

export const useverifyagent=(id:number)=>{
    return useMutation({
        mutationKey:['verifyagent',id],
        mutationFn:()=>verifyagent(id)
    })
}

export const userejectagent=(id:number)=>{
    return useMutation({
        mutationKey:['rejectagent',id],
        mutationFn:()=>rejictAgent(id)
    })

}

export const usegetverificationstatios=(id:number)=>{
    return useQuery({
        queryKey:['getverificationstatios',id],
        queryFn:()=>getverificationstatios(id)

    })
}
