import React, { useState } from 'react'
import './components.css'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { permissionLevels } from './util'
import { Button } from './common'
import * as firebase from 'firebase'
import axios from 'axios'
import { Message } from '../common'
import { useHistory } from 'react-router-dom'

const createUserUrl = `${process.env.REACT_APP_AUTH_SERVER}/creatuser`


export default () => {
  const history = useHistory()
  const [state, setState] = useState({
    email: '',
    password: '',
    displayName: '',
    permissions: ''
  })
  const [loading, setLoading ] = useState(false)
  const [error, setError ] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    const { target } = e
    const { name, value } = target
    setState(s => ({ ...s, [name]: value }))
  }
  const handlePermissionChange = e => {
    const { target } = e
    const { name, value } = target
    setState(s => ({ ...s, [name]: [value] }))
  }
  const createuser = async () => {
    const { email, password } = state
    const readyForSubmission = (permissions.includes(permissionLevels.superAdmin) && !password ) ? false : true
    if (!loading && email && password && readyForSubmission) {
      try {
        setLoading(true)
        const token = await firebase.auth().currentUser.getIdToken(true)
        const config = {
          method: 'post',
          data: { ...state },
          headers: {
            authorization: `Bearer ${token}`
          }
        }
        await axios(createUserUrl, config)
        setLoading(false)

        await firebase.auth().currentUser.sendEmailVerification()
        setSuccess(' User has being created ')
        history.push('/admin/users')
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
  }
  const { email, password, displayName, permissions } = state
  const readyForSubmission = (permissions.includes(permissionLevels.superAdmin) && !password ) ? false : true

  return (
    <div className='details-container'>
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
      <div className='photo'>
        <AccountCircleIcon
          style={{ width: '400px', height: '400px', color: '#fff' }}
        />
      </div>
      <div className='details'>
        <div className='row-details form'>
        <TextField
            autoFocus
            id='name'
            name='email'
            value={email}
            required
            label='Email Address'
            onChange={handleChange}
            type='email'
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
        </div>
        <div className='row-details form'>
        <TextField
            autoFocus
            id='name'
            name='password'
            onChange={handleChange}
            value={password}
            required
            label='Password'
            type='password'
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
        </div>
        <div className='row-details form'>
        <TextField
            autoFocus
            id='name'
            name='displayName'
            value={displayName}
            onChange={handleChange}
            required
            label='Display Name'
            type='name'
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
        </div>
        <div className='row-details form'>
          <strong> Select Permission : </strong>
          </div> 
          <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              name='permissions'
              className='row-details form'
              onChange={handlePermissionChange}
              value={permissions}
              variant='outlined'
              style={{ margin: 8 }}>
              {Object.keys(permissionLevels).map(key => (
                <MenuItem key={key} value={permissionLevels[key]}>
                  {key}
                </MenuItem>
              ))}
            </Select>
        
        <div className='action-rows'>
          <Button  onClick={() => readyForSubmission && createuser()} label='Create User' loading={loading} />
        </div>
      </div>
    </div>
  )
}
