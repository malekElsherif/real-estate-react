import api from "./axios";

export const createrentalrequests = (id:number) => {
  const res =  api.post(`/rental-requests/create/property/${id}`, {

  });
  return res
}
export const getmyrentalrequests = () => {
  const res =  api.get(`/rental-requests/myrequests`);
  return res
}

export const canclemyrentalrequest = (id:number) => {
  const res = api.patch(`/rental-requests/myrequests/cancel/${id}`)
  return res
}

export const getrentalrequestsformyproperties = () => {
  const res = api.get('/rental-requests/myproperties')
  return res
}

export const approverequestformyproperty = (id:number) => {
  const res = api.patch(`/rental-requests/approve/${id}`)
  return res

}

export const rejectrequestformyproperty = (id:number) => {
  const res = api.patch(`/rental-requests/reject/${id}`)
  return res
}
