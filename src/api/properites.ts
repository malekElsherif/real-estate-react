import api from "./axios";

export const addProp = async (data: any) => {
  const res = await api.post("/properties", data);

  return res.data;
};

export const  getallprop = async () => {
  const res = await api.get("/properties");

  return res.data;
};

export const getbyid = async (id: Number) => {
  const res = await api.get(`/properties/${id}`);

  return res.data;
};

export const getbyuser = async (id: Number) => {
  const res = await api.get(`/properties/user/${id}`);

  return res;
}

export const editProp = async (id: Number, data: any) => {
  const res = await api.patch(`/properties/${id}`, data);

  return res.data;
};

export const deleteProp = async (id: Number) => {
  const res = await api.delete(`/properties/${id}`);

  return res.data;
};

export const makePropertyAvailableUnavailable = async (id: Number) => {
  const res = await api.patch(`/properties/${id}/makePropertyAvailableUnavailable`);

  return res.data;
};

export const getallpendingproperties= async () => {
  const res = await api.get("/properties/allpendingproperties");

  return res.data;
}
