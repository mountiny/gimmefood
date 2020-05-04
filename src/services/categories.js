import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/categories'
const url = 'categories'

const baseUrl = `${BACKEND_URL}${url}`

let token = null

const setToken = newToken => {
  console.log(newToken)
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getAllByParams = (params) => {
  const request = axios.get(baseUrl, {params: params})
  return request.then(response => response.data)
}

const create = async newObject => {
  console.log("token: ", token)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
const delete_category = async (id) => {
  const config = {
    headers: { Authorization: token },
    data: {
      cat_id: id,
    }
  }
  const response = await axios.delete(baseUrl, config)
  return response.data
}

const update = (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.put(baseUrl, newObject, config)
  return request.then(response => response.data)
}

export default {
  getAll,
  getAllByParams,
  create,
  delete_category,
  update,
  setToken
}