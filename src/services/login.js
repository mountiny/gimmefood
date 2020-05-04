import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/login'
const url = 'login'

const baseUrl = `${BACKEND_URL}${url}`

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }