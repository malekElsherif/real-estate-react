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
export const usegetbyid = (id: number | string) => {
  const numericId = Number(id);
  return useQuery({
    queryKey: ["properties", numericId],
    queryFn: () => getbyid(numericId),
    enabled: !!numericId && !isNaN(numericId),
  });
};

// 4. جلب عقارات مستخدم معين
export const usegetpropbyuser = (id: number | string) => {
  const numericId = Number(id);
  return useQuery({
    queryKey: ["properties", "user", numericId],
    queryFn: () => getbyuser(numericId),
    enabled: !!numericId && !isNaN(numericId),
  });
};

// 5. تعديل عقار
export const useeditprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => editProp(Number(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties", Number(variables.id)] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// 6. حذف عقار
export const usedeleteprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteProp(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// Alias لـ usedeleteprop للتوافق مع التسميات المختلفة
export const useDeleteProp = usedeleteprop;

// 7. تغيير حالة توفر العقار (Available / Unavailable)
export const useAvailablityprop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => makePropertyAvailableUnavailable(Number(id)),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["properties", Number(id)] });
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

// 9. تغيير حالة العقار بواسطة الأدمن (قبول / رفض / تعديل الحالة)
export const useUpdatePropStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      editProp(Number(id), { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties", Number(variables.id)] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
