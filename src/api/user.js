import request from '@/utils/request'

export function selectDepartment() {
  return request({
    url: '/sys/dept/select'
  })
}
export function selectUser(params) {
  return request({
    url: '/sys/user/list',
    params
  })
}
export function singleUser(id) {
  return request({
    url: `/sys/user/info/${id}`
  })
}
export function createUser(data) {
  return request({
    url: '/sys/user/save',
    method: 'POST',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'PUT',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/sys/user/delete',
    method: 'DELETE',
    data
  })
}
