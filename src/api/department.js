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

export function updateDepartment(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
