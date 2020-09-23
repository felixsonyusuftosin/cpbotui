import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { NavLink } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './components.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloseIcon from '@material-ui/icons/Close'

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
    className={outline ? 'button-head outline el' : 'button-head el'}>
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
    className='nav-link  no-style el'>
    <Icon />
    <span className='el'>{name}</span>
  </NavLink>
)

export const WildSearch = ({ loading,value, resetFilter, ...props }) => {

  return (
    <div
      className='wildsearch'
      style={{ width: props.width ? props.width : '30%' }}>
      <input
        type='text'
        {...props}
        placeholder='search'
      />
      <div className='icon-search'>
        {!value && !loading && (
          <SearchIcon style={{ fontSize: '1.5rem', color: '#ccc' }} />
        )}
        {value && !loading && (
          <CloseIcon onClick={resetFilter} style={{ fontSize: '1.5rem', color: '#ccc' }} />
        )}
        {loading && (
          <CircularProgress style={{ fontSize: '1rem', color: '#ccc' }}  />
        )}
      </div>
    </div>
  )
}
