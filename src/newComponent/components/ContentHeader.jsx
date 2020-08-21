import React from 'react'
import './components.css'
import { useLocation } from 'react-router-dom'
import { navlinks } from './util'
import { Link } from 'react-router-dom'

export default () => {
  const  location = useLocation()
  const { pathname } = location
  const { header } = navlinks.find(x => x.path === pathname) || {}

  return (
    <div className='content-head'>
      <h1 className='component-head dark semi-thin'>{header}</h1>
      <div className='far-right'>
        <Link className='no-style' to='/admin/addusers' style={{color: 'inherit'}} >
        <button className='button-head el'>
          Add User
        </button>
        </Link>
        <button className='button-head outline el'>
          Upload Version
          </button>
      </div>
    </div>
  )
}
