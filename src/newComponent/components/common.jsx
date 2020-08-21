import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { NavLink } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './components.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import CircularProgress from '@material-ui/core/CircularProgress'

export const AppLoader = () => (
  <div className='loader-component'>
    <Loader type='Puff' color='#1B1B60' height={100} width={100} />
  </div>
)

export const Button = ({
  label,
  loading = false,
  outline = false,
  onClick,
  ...rest
}) => (
  <button
    {...rest}
    onClick={e => !loading && onClick(e)}
    className={outline ? 'button-head outline' : 'button-head'}>
    {' '}
    {loading ? (
      <CircularProgress color='secondary' />
    ) : (
      <span> {label} </span>
    )}{' '}
  </button>
)

export const NavItemLink = ({ Icon, name, selected, ...rest }) => (
  <NavLink
    to={rest.path}
    activeClassName='selected-nav'
    className='nav-link  no-style'>
    <Icon />
    <span>{name}</span>
  </NavLink>
)

export const WildSearch = ({ ...props }) => (
  <div
    className='wildsearch'
    style={{ width: props.width ? props.width : '30%' }}>
    <input type='text' {...props} placeholder='search' />
    <div className='icon-search'>
      <SearchIcon style={{ fontSize: '1.5rem', color: '#ccc' }} />
    </div>
  </div>
)
