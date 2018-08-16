import request from '@/utils/request'

export function selectDepartment() {
  return request({
    url: '/sys/dept/select'
  })
}

