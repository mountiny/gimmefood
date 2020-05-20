import axios from 'axios'

const url = 'users'

const baseUrl = `${BACKEND_URL}${url}`

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getCategories = async (params) => {
  const response = await axios.get(`${baseUrl}/category-list`, { params: params })
  return response.data
}

const getCategoriesMenu = async (params) => {
  const response = await axios.get(`${baseUrl}/menu-list`, { params: params })
  return response.data
}

const getInfo = async (userToken) => {
  const config = {
    headers: { Authorization: `bearer ${userToken}` },
  }
  const response = await axios.post(`${baseUrl}/user-info`, {}, config)
  return response.data
}

const getStripeId = async (userToken) => {
  const config = {
    headers: { Authorization: `bearer ${userToken}` },
  }
  const response = await axios.post(`${baseUrl}/stripe-id`, {}, config)
  return response.data
}
const disconnectStripe = async (userToken) => {
  const config = {
    headers: { Authorization: `bearer ${userToken}` },
  }
  const response = await axios.post(`${baseUrl}/disconnect-stripe`, {}, config)
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = (newObject) => {
  const config = {
    headers: { 
      Authorization: token, 
      'content-type': 'multipart/form-data' 
    }
  }
  const request = axios.put(`${baseUrl}/edit`, newObject, config)
  return request.then(response => response.data)
}

const updateCategories = (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.put(`${baseUrl}/categories`, newObject, config)
  return request.then(response => response.data)
}

export default {
  getAll,
  getCategories,
  getCategoriesMenu,
  getInfo,
  getStripeId,
  disconnectStripe,
  create,
  update,
  updateCategories,
  setToken
}