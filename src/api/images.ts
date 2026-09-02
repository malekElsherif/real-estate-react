import api from "./axios";

export const addimg = async (id: number, data: FormData) => {
  const res = await api.post(`/property-images/${id}`, data);

  return res.data;
};

export const getimgforprop=async (id:number)=>{
  const res=await api.get(`/property-images/${id}`)
  return res.data
}