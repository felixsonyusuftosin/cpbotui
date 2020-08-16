import { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@context'

const axiosInstance = axios.create()

export const useAxios = () => {
  const { logout } = useAuth() 

  useEffect(() => {
    axiosInstance.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      const { status = 400 } = error.response || {}
      if (status === 401) {
        logout()
      }
    })
    // eslint-disable-next-line
  }, [])

  return axiosInstance
}