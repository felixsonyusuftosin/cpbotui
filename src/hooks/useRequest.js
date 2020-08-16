import { useState, useEffect, useRef } from 'react'
import { apiError } from '../utils/apiError'
import axios from 'axios'

// appState.signInUserSession.idToken.jwtToken,
export const axiosConfigurations = {
  method: 'get',
  responseType: 'json',
  responseEncoding: 'utf8',
  validateStatus: status => status < 400 || status === 404
}

export default (rest = {}) => {
  const firstUpdate = useRef(true)
  const [url, setUrl] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState(null)

  const resetState = () => {
    setUrl('')
    setData(null)
    setLoading(false)
  }

  useEffect(() => {
    const makeRequest = async () => {
      setLoading(true)
      try {
        const updatedConfigurations = body ? { ...axiosConfigurations, data: body, url, ...rest } : { ...axiosConfigurations, url, ...rest }
        const { data, status } = await axios(updatedConfigurations)
        if (status === 404) {
          // we assume all 404 requests returns null so we will pass null
          // users should set a default value to avoid accessing null values
          setUrl('')
          setLoading(false)
          setData(404)
          return
        }
        if (status < 400) {
          setLoading(false)
        }

        if (updatedConfigurations.method === 'delete' || status === 204) {
          setUrl('')
          setLoading(false)
          setData('success')
          return
        }
        setData(data)
        setUrl('')
        return
      } catch (error) {
        setUrl('')
        setLoading(false)
        if (error.response) {
          const { data, status } = error.response
          setError({ info: apiError({ status, url }), statusText: '', serverInfo: data })
        } else if (error.request) {
          setError({ info: 'Something Happened', statusText: '', serverInfo: error.request })
        } else {
          setError({ info: 'Something Happened', statusText: '', serverInfo: error.message })
        }

        // this is probably a js error so its best to show the users a customized error message
      }
    }
    // TODO This is weak please do something better @Tosin
    if (!firstUpdate.current && url) {
      makeRequest()
    }
    firstUpdate.current = false
    // eslint-disable-next-line
  }, [url])

  return { data, loading, error, setBody, resetState, callApi: setUrl }
}
