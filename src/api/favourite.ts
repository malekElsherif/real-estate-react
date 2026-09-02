import api from "./axios";

export const addtofav = async (id:number) => {
  const res = api.post(`/favorites/property/${id}`)
  return res;

};

export const getmyfav = async () => {
  const res = api.get(`/favorites/myfavorites`)
  return res;

};

export const isfav = async (id:number) => {
  const res = api.get(`/favorites/property/isFavorite/${id}`)
  return res;

};
export const deletefav = async (id:number) => {
  const res = api.delete(`/favorites/property/${id}`)
  return res;

};
