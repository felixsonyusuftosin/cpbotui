import React, { useEffect } from 'react'
import { WildSearch } from './common'
import { AppLoader } from './common'
import * as firebase from 'firebase'
import axios from 'axios'
import { Message } from '../common'
import { Link } from 'react-router-dom'
import './components.css'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const listusersUrl = `${process.env.REACT_APP_AUTH_SERVER}/listusers`

export default () => {
  const [loading, setLoading] = React.useState(false)
  const [userList, setUserList] = React.useState(null)
  const [error, setError] = React.useState('')
  const [user, setUser] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const pageLength = [2, 10, 20, 50, 100]
  const [next, setNext] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    next: null,
    total: 50
  })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = total => {
    setPagination(p => ({ ...p, total, next: null }))
    handleClose()
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
        const { next, total } = pagination
        const url = next
          ? `${listusersUrl}?next=${next}&total=${total}`
          : `${listusersUrl}?total=${total}`
        const { data } = await axios.get(url, config)
        setUserList(() => data.data)
        setNext(data.next)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (user) {
      fetchUserList()
    }
  }, [pagination, user])
  const goToNext = () => {
    if (next) {
      setPagination(p => ({ ...p, next }))
    }
  }

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
        <div className='table-pagination el'>
          <span className='el'> {next &&  'More Available'}</span>
          <span onClick={handleClick} className='el elll'>
            {' '}
            {pagination.total} Results
          </span>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            {pageLength.map(p => (
              <MenuItem
                key={p}
                onClick={() => handleSelect(p)}>{`${p} Items`}</MenuItem>
            ))}
          </Menu>
          <span
            onClick={goToNext}
            className={next ? 'btt rl ' : 'btt rl  disabled'}>
            Next
          </span>
        </div>
      </div>
      <div className='table'>
        <div className='table-row hea'>
          <div className='el'> Email</div>
          <div className='el'> Token</div>
          <div className='el'> Permissions </div>
          <div> </div>
        </div>
        {userList &&
          userList.map(userItem => {
            const { email, permissions, uid, token } = formatData(userItem)
            return (
              <Link
                key={uid}
                style={{ color: 'inherit' }}
                className='no-style el'
                to={`/admin/user/${uid}`}>
                <div className='table-row'>
                  <div className='el'>{email}</div>
                  <div className='el'> {token}</div>
                  <div>
                    {permissions.map(
                      perm =>
                        perm && (
                          <span key={perm} className='permissions el'>
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
