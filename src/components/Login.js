import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import './index.css'
import config from '../utils/config'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import * as firebase from 'firebase'
import { useHistory } from 'react-router-dom'

firebase.config = config
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))

export default () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const classes = useStyles()
  const [error] = useState(null)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const updateEmail = e => {
    const { target } = e
    const { value = '' } = target || {}
    setCredentials(c => ({ ...c, email: value }))
  }
  const updatePassword = e => {
    const { target } = e
    const { value = '' } = target || {}
    setCredentials(c => ({ ...c, password: value }))
  }
  const submit = async () => {
    const { email, password } = credentials
    if (email && password) {
      try {
        setLoading(true)
        await firebase.auth().signInWithEmailAndPassword(email, password)
        history.push('/users')
        setLoading(false)
      } catch (err) {
        alert(err.message)
        setLoading(false)
      }
    }
  }
  const { email, password } = credentials

  return (
    <div className={classes.root}>
      <div className='container'>
        <div className='main'>
          <TextField
            id='outlined-full-width'
            label='email'
            style={{ margin: 8 }}
            placeholder='Placeholder'
            fullWidth
            value={email}
            type='email'
            margin='normal'
            onChange={updateEmail}
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <TextField
            id='outlined-full-width'
            value={password}
            label='password'
            type='password'
            style={{ margin: 8 }}
            placeholder='Placeholder'
            fullWidth
            onChange={updatePassword}
            margin='normal'
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <Button
            variant='contained'
            color='primary'
            fullwidth
            onClick={submit}
            style={{ margin: '25px', padding: '10px' }}>
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </div>
    </div>
  )
}
