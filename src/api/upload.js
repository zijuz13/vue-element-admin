import request from '@/utils/request'
export function uploadImage(data) {
  return request({
    url: process.env.VUE_APP_ADDRESS+'/edit/upload/post',
    method: 'post',
    data
  })
}
