import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/testing/reset'

// let token = null

// const setToken = newToken => {
//   token = `bearer ${newToken}`
// }

const reset = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default reset