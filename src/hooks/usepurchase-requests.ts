import { useMutation, useQuery } from "@tanstack/react-query"
import { approvepurchaseRequestsformyProperties, deletemypurchaseRequests, getPendingpurchaseRequests, getpurchaseRequestsformyProperties, makePurchaseRequests, mypurchaseRequests, rejectpurchaseRequestsformyProperties } from "../api/purchase-requests"

export const useMakePurchaseRequests = (id:number) => {
  return useMutation({
    mutationFn:()=> makePurchaseRequests(id),
      mutationKey:['makePurchaseRequests']

  })
}


export const usegetmypurchaseRequests = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['getmypurchaseRequests'],
    queryFn: mypurchaseRequests,
    ...options, // تمرير الخيارات (مثل enabled) هنا
  });
};

export const useCanclePurchaseRequest = (id: number) => {
  return useMutation({
      mutationFn:()=>deletemypurchaseRequests(id),
      mutationKey:['deletePurchaseRequest']

  })
}

export const usegetpurchaseRequestsformyProperties = () => {
  return useQuery({
    queryKey: ['getpurchaseRequestsformyProperties'],
    queryFn:()=>getpurchaseRequestsformyProperties()
  })
}
export const useapprovePurchaseRequestformyProperties = (id: number) => {
  return useMutation({
      mutationFn:()=>approvepurchaseRequestsformyProperties(id),
      mutationKey:['approvePurchaseRequestformyProperties',id]

  })
}
export const usegetPendingpurchaseRequests = () => {
  return useQuery({
    queryKey: ['getPendingpurchaseRequests'],
    queryFn:()=>getPendingpurchaseRequests()
  })
}

export const useRejectpurchaseRequestsformyProperties = (id: number) => {
  return useMutation({
      mutationFn:()=>rejectpurchaseRequestsformyProperties(id),
      mutationKey:['rejectpurchaseRequestsformyProperties',id]

  })
}
