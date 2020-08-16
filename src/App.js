import React from 'react'
import Paperbase from './components/Paperbase'
import Content from './components/Content'
import Login from './components/Login'
import DetailView from './components/DetailView'
import Listusers from './components/Listusers'
import firebase from 'firebase'
import 'firebase/auth'
import { SelectedUderProvider } from './context/UserContext'

import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

function App() {
  const [user, setUser] = React.useState(null)
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: location }
                }}
              />
            )
        }
      />
    )
  }

  return (
    <SelectedUderProvider>
      <div className='App'>
        <Router>
          <Paperbase>
            <Content>
              <Switch>
                <Route exact path='/'>
                  <Login />
                </Route>
                <PrivateRoute exact path='/users'>
                  <Listusers />
                </PrivateRoute>
                <PrivateRoute exact path='/detail'>
                  <DetailView />
                </PrivateRoute>
                <Route exact path='**'>
                  <Login />
                </Route>
              </Switch>
            </Content>
          </Paperbase>
        </Router>
      </div>
    </SelectedUderProvider>
  )
}

export default App
