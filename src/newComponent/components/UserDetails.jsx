import React, { useEffect } from 'react'
import './components.css'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { Button } from './common'
import { AppLoader } from './common'
import * as firebase from 'firebase'
import axios from 'axios'
import { Message } from '../common'
import { useParams, useHistory } from 'react-router-dom'

const deleteUserUrl = `${process.env.REACT_APP_AUTH_SERVER}/deleteuser`
const revokeAccessUrl = `${process.env.REACT_APP_AUTH_SERVER}/revokeaccess`
const replaceAccessUrl = `${process.env.REACT_APP_AUTH_SERVER}/replaceaccess`
const sendActivationUrl = `${process.env.REACT_APP_AUTH_SERVER}/sendactivation`

export default () => {
  const [loading, setLoading] = React.useState(false)
  const [actionLoading, setActionLoading] = React.useState({
    deleteLoading: false,
    activationLoading: false,
    accessLoading: false
  })
  const [userList, setUserList] = React.useState(null)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [user, setUser] = React.useState(null)
  const [suser, setsuser] = React.useState(null)
  const listusersUrl = `${process.env.REACT_APP_AUTH_SERVER}/listusers`
  const { uid: paramUid } = useParams()

  const history = useHistory()

  if (!paramUid) {
    history.push('/admin/users')
  }

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
        setError(err)
        setLoading(false)
      }
    }

    if (user) {
      fetchUserList()
    }
  }, [listusersUrl, user])

  useEffect(() => {
    const fetchUser = () => {
      const selectedUser = userList.find(u => u.uid === paramUid) || {}
      const {
        uid,
        displayName,
        emailIsVerified,
        email,
        phoneNumber,
        metadata,
        customClaims = {}
      } = selectedUser

      const { creationTime, lastSignInTime } = metadata
      const { permissions = [], token } = customClaims
      const newCustomClaims = { ...customClaims }
      delete newCustomClaims.permissions
      const data = {
        uid,
        displayName,
        emailIsVerified,
        email,
        phoneNumber,
        creationTime,
        lastSignInTime,
        token,
        permissions: Array.isArray(permissions)
          ? permissions.join(', ')
          : permissions,
        ...newCustomClaims
      }
      setsuser(data)
    }
    if (user && paramUid && userList && userList.length) {
      fetchUser()
    }
  }, [user, paramUid, userList])

  const deleteuser = async () => {
    const setDeleteLoading = () => {
      setActionLoading(a => ({ ...a, deleteLoading: !a.deleteLoading }))
    }
    try {
      setDeleteLoading()
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { uid: paramUid },
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      await axios.delete(deleteUserUrl, config)
      setDeleteLoading()
      setSuccess('User has Being Deleted')
      history.push('/admin/users')
    } catch (err) {
      setError(err)
      setDeleteLoading()
    }
  }

  const revokeAccess = async () => {
    const setAccessLoading = () => {
 
      setActionLoading(a => ({ ...a, accessLoading: !a.accessLoading }))
    }
    try {
      setAccessLoading()
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { uid: paramUid },
        method: 'patch',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      if (suser.permissions.includes('REVOKED')) {
        await axios(replaceAccessUrl, config)
      } else {
        await axios(revokeAccessUrl, config)
      }
      setAccessLoading()
      if (suser.permissions.includes('REVOKED')) {
        setSuccess(' User access has being restored')
      } else {
        setSuccess(' User access has being revoked')
      }
      history.push('/admin/users')
    } catch (err) {
      setError(err)
      setAccessLoading()
    }
  }

  const sendActionMail = async () => {
    const setActivationLoading = () => {
      setActionLoading(a => ({ ...a,  activationLoading: !a.activationLoading }))
    }
    try {
      setActivationLoading()
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { email: suser.email, token: suser.token },
        method: 'post',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      await axios(sendActivationUrl, config)
      setActivationLoading()
      setSuccess('Email sent successfully')
    } catch (err) {
      setError(err)
      setActivationLoading()
    }
  }

  const { accessLoading, deleteLoading, activationLoading } = actionLoading


  return (
    <div className='details-container'>
      {loading && <AppLoader />}
      <Message
        content={error}
        open={error}
        severity='error'
        resetContent={setError}
      />
      <Message
        content={success}
        open={success}
        severity='success'
        resetContent={setSuccess}
      />
      {suser && (
        <>
          <div className='photo'>
            <AccountCircleIcon
              style={{ width: '400px', height: '400px', color: '#fff' }}
            />
          </div>
          <div className='details'>
            {Object.keys(suser).map(key => {
              return (
                <div key={key} className='row-details'>
                  <div className='one-info'>
                    {' '}
                    <strong> {key}: </strong> {suser[key]}
                  </div>
                </div>
              )
            })}
            <div className='action-rows'>
              <Button onClick={sendActionMail} label='Send Activation Email' loading={activationLoading} />
              {!suser.permissions.includes('SUPERADMIN') && (
                <Button
                  onClick={deleteuser}
                  label='Delete User'
                  outline
                  loading={deleteLoading}
                />
              )}
              {!suser.permissions.includes('SUPERADMIN') && (
                <Button
                  onClick={revokeAccess}
                  label={
                    !suser.permissions.includes('REVOKED')
                      ? 'Revoke Permissions'
                      : 'Restore Permissions'
                  }
                  outline
                  loading={accessLoading}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
