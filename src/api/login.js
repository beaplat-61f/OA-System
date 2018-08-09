import request from '@/utils/request'

/* export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
} */

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/* export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
} */

export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    headers: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

export function getMobileCode(params) {
  return request({
    url: '/captcha',
    params
  })
}
