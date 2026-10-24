import api from "./axios";

// 1. تسجيل عقار تمت مشاهدته بواسطة المستخدم
export const logViewedProperty = async (propertyId: number) => {
  const res = await api.post("/viewed-props", { propertyId });
  return res.data;
};

// 2. جلب قائمة العقارات التي مشاهدها مستخدم معين
export const getViewedPropertiesByUser = async (userId: number) => {
  const res = await api.get(`/viewed-props/user/${userId}`);
  return res.data;
};
