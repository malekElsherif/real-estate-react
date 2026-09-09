import api from "./axios";

// تعريف واجهة البيانات المطلوبة للفلترة والباجنيشن
export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  [key: string]: any;
}

export const addProp = async (data: any) => {
  const res = await api.post("/properties", data);
  return res.data;
};

// تعديل دالة الجلب لتقبل المعاملات وتمريرها في الـ Query String
export const getallprop = async (params?: GetPropertiesParams) => {
  const res = await api.get("/properties/filter", { params });
  return res.data;
};

export const getbyid = async (id: number) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

export const getbyuser = async (id: number) => {
  const res = await api.get(`/properties/user/${id}`);
  return res;
};

export const makePropertyAvailableUnavailable = async (id: number) => {
  const res = await api.patch(`/properties/${id}/makePropertyAvailableUnavailable`);
  return res.data;
};

export const editProp = async (id: number, data: any) => {
  const res = await api.patch(`/properties/${id}`, data);
  return res.data;
};

export const deleteProp = async (id: number) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};



export const getallpendingproperties = async () => {
  const res = await api.get("/properties/allpendingproperties");
  return res.data;
};
