import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import './index.css'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import firebase from 'firebase'
import 'firebase/auth'
import { useSelectedUser } from '../context/UserContext'
import { useHistory } from 'react-router-dom'

const listusersUrl = `${process.env.REACT_APP_AUTH_SERVER}/listusers`
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}))

export default () => {
  const classes = useStyles()
  const [checked, setChecked] = useState([0])
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState(null)
  const [user, setUser] = useState(null)
  const { selectUser } = useSelectedUser()
  const history = useHistory()

  useEffect(() => {
    const fetchUser = () => {
      const user = firebase.auth().currentUser
      setUser(user)
    }
    if (!user) {
      fetchUser()
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
        console.log(data)
        setUserList(() => data.data)
        setLoading(false)
      } catch (err) {
        alert(err)
        setLoading(false)
        history.push('/')
      }
    }

    if (user) {
      fetchUserList()
    }
  }, [user])

  const navigateToDetailView = (s) => { 
    selectUser(s)
    history.push('/detail')
  }

  return (
    <div className='container'>
      <div className='main-list'>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {userList && userList.length > 0 && (
          <List divider className={classes.root}>
            {userList.map(user => {
              const { email } = user
              return (
                <ListItem onClick={() => navigateToDetailView(user)} divider key={email} role={undefined} dense button>
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={true}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={email} />
                  <ListItemSecondaryAction>
                    <IconButton edge='end' aria-label='comments'>
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        )}
      </div>
    </div>
  )
}
