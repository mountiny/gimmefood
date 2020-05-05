import axios from 'axios'
const qs = require('qs')
const url = 'products'

const baseUrl = `${BACKEND_URL}${url}`

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  console.log('Create new product: ', newObject)
  for (var pair of newObject.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }
  const config = {
    headers: { 
      'content-type': 'multipart/form-data',
      Authorization: token
    }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then(response => response.data)
// }

const update = (newObject) => {
  const config = {
    headers: { 
      Authorization: token, 
      'content-type': 'multipart/form-data' 
    }
  }
  const request = axios.put(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const delete_product = async (id) => {
  const config = {
    headers: { Authorization: token },
    data: {
      prod_id: id,
    }
  }
  const response = await axios.delete(baseUrl, config)
  return response.data
}

export default {
  getAll,
  create,
  update,
  delete_product,
  setToken
}