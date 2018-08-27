import request from '@/utils/request'

export function selectPost(params) {
  return request({
    url: '/sys/pos/list',
    params
  })
}
export function singlePost(id) {
  return request({
    url: `/sys/pos/info/${id}`
  })
}
export function createPost(data) {
  return request({
    url: '/sys/pos/save',
    method: 'POST',
    data
  })
}
export function updatePost(data) {
  return request({
    url: '/sys/pos/update',
    method: 'PUT',
    data
  })
}
export function deletePost(data) {
  return request({
    url: '/sys/pos/delete',
    method: 'DELETE',
    data
  })
}
