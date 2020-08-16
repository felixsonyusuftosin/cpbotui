import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { useSelectedUser } from '../context/UserContext'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import axios from 'axios'
import { green } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase'
import 'firebase/auth'
import { useHistory } from 'react-router-dom'

const deleteUserUrl = `${process.env.REACT_APP_AUTH_SERVER}/deleteuser`
const revokeAccessUrl = `${process.env.REACT_APP_AUTH_SERVER}/revokeaccess`
const replaceAccessUrl = `${process.env.REACT_APP_AUTH_SERVER}/replaceaccess`
const sendActivationUrl = `${process.env.REACT_APP_AUTH_SERVER}/sendactivation`

const useStyles = makeStyles({
  btnroot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})

export default () => {
  const { selectedUser } = useSelectedUser()
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
  const data = {
    uid,
    displayName,
    emailIsVerified,
    email,
    phoneNumber,
    creationTime,
    lastSignInTime,
    token,
    permissions: Array.isArray(permissions) ? permissions.join(', ') : permissions
  }
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)
  const deleteuser = async () => {
    try {
      setLoading(true)
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { uid },
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      await axios.delete(deleteUserUrl, config)
      setLoading(false)
      alert(' User has being deleted')
      history.push('/users')
    } catch (err) {
      alert(err)
      setLoading(false)
    }
  }

  const revokeAccess = async () => {
    try {
      setLoading(true)
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { uid },
        method: 'patch',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      if (permissions.includes('REVOKED')) {
        await axios(replaceAccessUrl, config)
      } else {
        await axios(revokeAccessUrl, config)
      }
      setLoading(false)
      if (permissions.includes('REVOKED')) {
        alert(' User access has being restored')
      } else {
        alert(' User access has being revoked')
      }
      history.push('/users')
    } catch (err) {
      alert(err)
      setLoading(false)
    }
  }

  const sendActionMail = async () => {
    try {
      setLoading(true)
      const token = await firebase.auth().currentUser.getIdToken(true)
      const config = {
        data: { email: data.email, token: data.token },
        method: 'post',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      await axios(sendActivationUrl, config)
      alert('Email sent successfully')
      setLoading(false)
    } catch (err) {
      alert(err)
      setLoading(false)
    }
  }

  const classes = useStyles()

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography
          className={classes.title}
          color='textSecondary'
          gutterBottom>
          {email}
        </Typography>
        {Object.keys(data).map(key => (
          <div key={key} className='detail-list'>
            <strong>{key}</strong> <span>{data[key]}</span>
          </div>
        ))}
        <div className='button-row'>
          <div className={classes.btnroot}>
            <ButtonGroup
              disableElevation
              size='large'
              color='primary'
              variant='contained'
              aria-label='large  primary button group'>
              {!permissions.includes('SUPERADMIN') && (
                <Button onClick={deleteuser} variant='outlined'>
                  Delete User
                </Button>
              )}
              {!permissions.includes('SUPERADMIN') && (
                <Button onClick={revokeAccess} variant='outlined'>
                  {permissions.includes('REVOKED')
                    ? 'Restore Access'
                    : 'Revoke Access'}
                </Button>
              )}
              <Button onClick={sendActionMail} disabled={loading}>
                Send Activation Mail
              </Button>
            </ButtonGroup>
          </div>
        </div>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </CardContent>
    </Card>
  )
}
