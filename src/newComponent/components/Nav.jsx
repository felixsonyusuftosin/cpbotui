import React from 'react'
import { navlinks } from './util'
import { NavItemLink } from './common'
import firebase from 'firebase'
import 'firebase/auth'

export default () => {
  const [loading, setLoading] = React.useState(false)
  const user = firebase.auth().currentUser || {}
  const logout = async () => {
    setLoading(true)
    await firebase.auth().signOut()
    setLoading(false)
  }
  return (
    <div className='nav dark-b'>
      <div className='entity'>
        <div className='icon-button dark roboto'>FT</div>
        <span>{user.email}</span>
      </div>
      <div className='nav-body'>
        {navlinks.map(nav => (
          <NavItemLink
            selected={nav.selected}
            Icon={nav.Icon}
            name={nav.name}
            key={nav.name}
            {...nav}
          />
        ))}
      </div>
      <div onClick={logout} className='nav-footer light roboto'>
        Logout
      </div>
    </div>
  )
}
