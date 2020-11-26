import request from '@/utils/request'
export function uploadImage(data) {
  return request({
    url: 'http://localhost:10022/upload/post',
    method: 'post',
    data
  })
}
