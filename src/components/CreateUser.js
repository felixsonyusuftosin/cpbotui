import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { permissionLevels } from '../utils/permissions'
import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase'
import 'firebase/auth'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

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

const createUserUrl = `${process.env.REACT_APP_AUTH_SERVER}/creatuser`

export default ({ open, toggleModal }) => {
  const history = useHistory()
  const [state, setState] = useState({
    email: '',
    password: '',
    displayName: '',
    permissions: ''
  })
  const [loading, setLoading] = React.useState(false)
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
        toggleModal()
        await firebase.auth().currentUser.sendEmailVerification()
        alert(' User has being created ')
        history.push('/users')
      } catch (err) {
        alert(err)
        setLoading(false)
      }
    }
  }

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
  const { email, password, displayName, phoneNumber, permissions } = state
  const readyForSubmission = (permissions.includes(permissionLevels.superAdmin) && !password ) ? false : true
  const classes = useStyles()
  return (
    <div>
      <Dialog
        open={open}
        onClose={toggleModal}
        aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Create User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please create a user and provide the details about permissions you
            want to grant this user
          </DialogContentText>
          <TextField
            autoFocus
            id='name'
            name='email'
            value={email}
            label='Email Address'
            type='email'
            onChange={handleChange}
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <TextField
            name='password'
            label='Password'
            value={password}
            onChange={handleChange}
            type='password'
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <TextField
            name='phoneNumber'
            label='Phone Number'
            value={phoneNumber}
            type='number'
            style={{ margin: 8 }}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <TextField
            name='displayName'
            label='Display Name'
            value={displayName}
            onChange={handleChange}
            style={{ margin: 8 }}
            type='text'
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant='outlined'
          />
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={permissions}
            name='permissions'
            onChange={handlePermissionChange}
            fullWidth
            variant='outlined'
            style={{ margin: 8 }}>
            {Object.keys(permissionLevels).map(key => (
              <MenuItem key={key} value={permissionLevels[key]}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color='primary'>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={loading || !email || !password || !readyForSubmission }
            onClick={createuser}
            >
            Create User
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
