import request from '@/utils/request'

export function selectDepartment() {
  return request({
    url: '/sys/dept/list'
  })
}

export function createDepartment(data) {
  return request({
    url: '/sys/dept/save',
    method: 'POST',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/sys/dept/update',
    method: 'PUT',
    data
  })
}

export function deleteDepartment(params) {
  return request({
    url: `/sys/dept/delete/${params.id}`,
    method: 'DELETE'
  })
}
