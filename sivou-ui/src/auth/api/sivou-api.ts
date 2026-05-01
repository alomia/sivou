import axios from 'axios'


const sivouAPI = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
})

export { sivouAPI }
