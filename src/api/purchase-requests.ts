import api from "./axios"

export const makePurchaseRequests = (id:number) => {
  const res = api.post(`/purchase-requests/${id}`)
  return res
}

export const mypurchaseRequests = () => {
  const res =api.get(`/purchase-requests/mypurchaseRequests`)
  return res
}

export const getPendingpurchaseRequests = () => {
  const res =api.get(`/purchase-requests/pending`)
  return res
}


export const deletemypurchaseRequests = (id:number) => {
  const res =api.delete(`/purchase-requests/mypurchaseRequests/${id}`)
  return res
}


export const getpurchaseRequestsformyProperties = () => {
  const res = api.get(`/purchase-requests/myProperties`)
  return res
}

export const approvepurchaseRequestsformyProperties = (id:number) => {
  const res = api.post(`/purchase-requests/approve/${id}`)
  return res
}
export const rejectpurchaseRequestsformyProperties = (id:number) => {
  const res = api.post(`/purchase-requests/reject/${id}`)
  return res
}
