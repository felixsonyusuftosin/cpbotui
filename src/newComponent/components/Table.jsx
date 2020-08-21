import React, { useEffect } from 'react'
import { WildSearch } from './common'
import { AppLoader } from './common'
import * as firebase from 'firebase'
import axios from 'axios'
import { Message } from '../common'
import { Link } from 'react-router-dom'
import './components.css'

const listusersUrl = `${process.env.REACT_APP_AUTH_SERVER}/listusers`

export default () => {
  const [loading, setLoading] = React.useState(false)
  const [userList, setUserList] = React.useState(null)
  const [error, setError] = React.useState('')
  const [user, setUser] = React.useState(null)

  useEffect(() => {
    if (!user) {
      const user = firebase.auth().currentUser
      setUser(user)
    }
  }, [user])

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        setLoading(true)
        const token = await firebase.auth().currentUser.getIdToken(true)
        const config = {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
        const { data } = await axios.get(listusersUrl, config)
        setUserList(() => data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (user) {
      fetchUserList()
    }
  }, [user])

  const formatData = row => {
    const { customClaims, email, uid } = row
    const { permissions: p, token } = customClaims
    const permissions = Array.isArray(p) ? p : [p]
    return { permissions, email, token, uid }
  }

  return (
    <div>
      {loading && <AppLoader />}
      <Message
        content={error}
        open={error}
        severity='error'
        resetContent={setError}
      />
      <div className='table-top'>
        <div className='search-table'>
          <WildSearch width='100%' />
        </div>
        <div className='table-pagination'>
          <span> Showing 1-10 0f 100</span>
          <show> 50 Results</show>
          <span className='btt'>Previous</span>
          <span className='btt'>Next</span>
        </div>
      </div>
      <div className='table'>
        <div className='table-row hea'>
          <div> Email</div>
          <div> Token</div>
          <div> Permissions </div>
          <div> </div>
        </div>
        {userList &&
          userList.map(userItem => {
            const { email, permissions, uid, token } = formatData(userItem)
            return (
              <Link  key={uid} style={{color: 'inherit'}} className='no-style' to={`/admin/user/${uid}`}>
                <div className='table-row'>
                  <div>{email}</div>
                  <div>{token}</div>
                  <div>
                    {permissions.map(
                      perm =>
                        perm && (
                          <span key={perm} className='permissions'>
                            {perm}
                          </span>
                        )
                    )}
                  </div>
                  <div>
                    <span className='row-btt'>More</span>
                  </div>
                </div>
              </Link>
            )
          })}
      </div>
    </div>
  )
}
