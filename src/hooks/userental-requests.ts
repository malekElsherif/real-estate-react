import { useMutation, useQuery } from "@tanstack/react-query";
import { approverequestformyproperty, canclemyrentalrequest, createrentalrequests, getmyrentalrequests, getrentalrequestsformyproperties, rejectrequestformyproperty } from "../api/rental-requests";

export const usecreaterentalrequests = (id:number) => {
  return useMutation({
    mutationFn: () => createrentalrequests(id),
    mutationKey: ["createrentalrequests", id],
  })
}

export const usegetmyrentalrequests = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryFn: getmyrentalrequests,
    queryKey: ["getmyrentalrequests"],
    ...options
  })
}

export const usecanclemyrenaltrequest = (id:number) => {
  return useMutation({
    mutationFn: () => canclemyrentalrequest(id),
    mutationKey: ["canclemyrenaltrequest"],
  })
}
export const usegetrentalrequestsformyproperties = () => {
  return useQuery({
    queryFn: getrentalrequestsformyproperties,
    queryKey: ["getmyrentalrequestsformyproperties"],
  })
}
export const useapproverequestformyproperty = (id:number) => {
  return useMutation({
    mutationFn: () => approverequestformyproperty(id),
    mutationKey: ["approverequestformyproperty",id],
  })
}

export const userejectrequestformyproperty = (id:number) => {
  return useMutation({
    mutationFn: () => rejectrequestformyproperty(id),
    mutationKey: ["rejectrequestformyproperty"],
  })
}
