import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}
export function fetchArticles(query) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog',
    method: 'get',
    params: query
  })
}


export function fetchArticle(id) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog/'+id,
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog',
    method: 'put',
    data
  })
}

export function changeStatus(id,status) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog/'+id+'/'+status,
    method: 'put'
  })
}

export function deleteArticle(id) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/item/blog/'+id,
    method: 'delete'
  })
}

