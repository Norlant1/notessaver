import axios from 'axios'
import jwt_decode from 'jwt-decode'

 const baseURL = 'https://notes-saver.onrender.com'
// const baseURL = 'http://localhost:3500'

let token = null

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials:true
})

export default axiosInstance



export const axiosPrivateInstance = axios.create({
  baseURL: baseURL,
  withCredentials:true,
  headers: {   
    'Content-Type': 'application/json' 
  }
})







