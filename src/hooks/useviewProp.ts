import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  logViewedProperty,
  getViewedPropertiesByUser,
} from "../api/viewProp";

// هوك لتسجيل المشاهدة عند النقر
export const useLogViewedProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => logViewedProperty(propertyId),
    onSuccess: () => {
      // ⚠️ هذا السطر هو السر: بيجبر React Query يعيد جلب المشاهدات فوراً فتظهر العين
      queryClient.invalidateQueries({ queryKey: ["viewed-properties"] });
    },
  });
};

// هوك لجلب قائمة العقارات المشاهدة بواسطة المستخدم
export const useGetViewedPropertiesByUser = (userId: number | string) => {
  const numericId = Number(userId);
  return useQuery({
    queryKey: ["viewed-properties", numericId],
    queryFn: () => getViewedPropertiesByUser(numericId),
    enabled: !!numericId && !isNaN(numericId),
  });
};
