import api from "./axios"

export const getallusers=()=>{
    return api.get('/admin/getallusers')
}

export const activeuser= (id:Number)=>{
    return api.patch(`/admin/activateUser/${id}`)
}

export const deactiveuser= (id:Number)=>{
    return api.patch(`/admin/deactivateUser/${id}`)
}

export const getactivityreportforuser=(id:Number)=>{
    return api.get(`/admin/getUserActivityReport/${id}`)
}

export const deleteuser=(id:Number)=>{
    return api.delete(`/admin/deleteUser/${id}`)
}

export const  getPendingAgent=()=>{
    return api.get('/admin/getPendingAgents')
}

export const verifyagent=(id:number)=>{
    return api.patch(`/admin/verifyAgent/${id}`)
}


export const rejictAgent=(id:number)=>{
    return api.patch(`/admin/rejectAgent/${id}`)

}

export const getverificationstatios=(id:number)=>{
    return api.get(`/admin/getAgentVerificationStatus/${id}`)
}
