import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProp,
  deleteProp,
  editProp,
  getallpendingproperties,
  getallprop,
  getbyid,
  getbyuser,
  makePropertyAvailableUnavailable,
  type GetPropertiesParams,
} from "../api/properites";

// 1. إضافة عقار جديد
export const useaddprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addProp(data),
    onSuccess: () => {
      // إبطال كاش جميع استعلامات العقارات لتحديث القائمة فوراً
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// 2. جلب كافة العقارات (يدعم الباجنيشن والفلترة)
export const usegetallprop = (params?: GetPropertiesParams) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getallprop(params),
  });
};

// 3. جلب عقار محدد بواسطة الـ ID
export const usegetbyid = (id: number) => {
  return useQuery({
    queryKey: ["properties", id], // إضافة الـ ID للكاش لتمييز العقارات عن بعضها
    queryFn: () => getbyid(id),
    enabled: !!id, // عدم التشغيل إذا لم يتوفر ID
  });
};

// 4. جلب عقارات مستخدم معين
export const usegetpropbyuser = (id: number) => {
  return useQuery({
    queryKey: ["properties", "user", id],
    queryFn: () => getbyuser(id),
    enabled: !!id,
  });
};

// 5. تعديل عقار
export const useeditprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => editProp(id, data),
    onSuccess: (_, variables) => {
      // تحديث كاش العقار المحدد وكاش القائمة الكاملة
      queryClient.invalidateQueries({ queryKey: ["properties", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// 6. حذف عقار
export const usedeleteprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProp(id),
    onSuccess: () => {
      // تعديل المفتاح ليطابق ['properties'] المستخدم في usegetallprop
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// 7. تغيير حالة توفر العقار (Available / Unavailable)
export const useAvailablityprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => makePropertyAvailableUnavailable(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["properties", id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// 8. جلب العقارات المعلقة (Pending)
export const usegetallpendingproperties = () => {
  return useQuery({
    queryKey: ["properties", "pending"],
    queryFn: getallpendingproperties,
  });
};
