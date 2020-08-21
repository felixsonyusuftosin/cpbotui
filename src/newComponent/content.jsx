import React from 'react'
import './content.css'
import Nav from './components/Nav'
import ContentHeader from './components/ContentHeader'
import UserDetails from './components/UserDetails'
import CreateUser from './components/CreateUser'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Table from './components/Table'

export default () => {
  const currentYear = new Date().getFullYear()
  return (
    <div className='container'>
      <Nav />
      <div className='content-main light-b'>
        <ContentHeader />
        <div className='content-body'>
          <div className='item-list'>
            <Switch>
              <Route exact path='/admin'>
                <Redirect to='/admin/users' />
              </Route>
              <Route path='/admin/users'>
                <Table />
              </Route>
              <Route exact path='/admin/user/:uid'>
                <UserDetails />
              </Route>
              <Route path='/admin/addusers'>
                <CreateUser />
              </Route>
              <Route path='/admin/settings'>
                <h1> Settings</h1>
              </Route>
              <Route path='**'>
                <Redirect to='/admin' />
              </Route>
            </Switch>
          </div>
        </div>
        <div className='content-footer dark '>
          <div> Copyright &copy; Copbot {currentYear} </div>
        </div>
      </div>
    </div>
  )
}
