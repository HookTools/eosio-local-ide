import axios from 'axios'

export const $api = (url) => {
  return axios.create({
    baseURL: url,
    timeout: 1000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy':
        'default-src *; connect-src *; script-src *; object-src *;',
    },
  })
}
