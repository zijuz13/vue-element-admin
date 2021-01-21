import request from '@/utils/request'

export function fetchProjectList(query){
    return request({
        url: process.env.VUE_APP_ADDRESS+'/item/projects/all',
        method: 'get',
        params: query
      })
}
export function createProject(data){
    return request({
        url: process.env.VUE_APP_ADDRESS+'/item/projects',
        method: 'post',
        data
      })
}
export function changeStatus(id,status){
    return request({
        url: process.env.VUE_APP_ADDRESS+'/item/projects/'+id+'/'+status,
        method: 'get'
      })
}
export function deleteProject(id){
    return request({
        url: process.env.VUE_APP_ADDRESS+'/item/projects/'+id,
        method: 'delete'
      })
}
export function updateProject(data){
    return request({
        url: process.env.VUE_APP_ADDRESS+'/item/projects',
        method: 'put',
        data
      })
}
