import axios from 'axios'

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralized error handler
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.error('API Error:', error.response)
    throw new Error(error.response.data.message || 'Server Error')
  } else if (error.request) {
    // Request was made but no response
    console.error('No response:', error.request)
    throw new Error('No response from server')
  } else {
    // Something else happened
    console.error('Error:', error.message)
    throw new Error(error.message || 'Unexpected error')
  }
}

// Utility functions with error handling
export const getData = async (url) => {
  try {
    const res = await api.get(url)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

// export const postData = async (url, data) => {
//   try {
//     const res = await api.post(url, data)
//     return res.data
//   } catch (error) {
//     handleError(error)
//   }
// }
export const postData = async (url, data) => {
  try{
  const isFormData = data instanceof FormData

  const config = {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  }

  const response = await axios.post(url, data, config)
  return response.data
  } catch(error){
    handleError(error);
  }
}

export const putData = async (url, data) => {
  try {
    const res = await api.put(url, data)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export const deleteData = async (url) => {
  try {
    const res = await api.delete(url)
    return res.data
  } catch (error) {
    handleError(error)
  }
}
