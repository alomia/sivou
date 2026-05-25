import axios from 'axios'

const sivouAPI = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
})

// Agrega el token automáticamente en cada request si existe
sivouAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { sivouAPI }
