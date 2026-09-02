import api from "./axios";

export const getme=async ()=>{
 const res= await api.get('/users/me')
 return res
}

export const getuserbyid=async(id:number)=>{
    const res=await api.get(`/users/${id}`)
    return res
}