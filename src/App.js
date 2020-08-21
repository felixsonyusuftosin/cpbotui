import React from 'react'
import firebase from 'firebase'
import 'firebase/auth'
import { SelectedUserProvider } from './context/UserContext'
import Main from './newComponent/main'
import Content from './newComponent/content'

import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import config from './utils/config'
import { AppLoader } from './components/newComponent/components/common'

firebase.initializeApp(config)
function App() {
  const [user, setUser] = React.useState(null)
  const [appIsReady, setAppIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!user) {
      firebase.auth().onAuthStateChanged(userinfo => {
        setAppIsReady(true)
        if (userinfo) {
          setUser(userinfo)
        }
      })
    }
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
    <SelectedUserProvider>
      {!appIsReady ? (
        <AppLoader />
      ) : (
        <Router>
          <Route exact path='/'>
            <Main />
          </Route>
          <PrivateRoute exact path='/admin**'>
            <Content />
          </PrivateRoute>
        </Router>
      )}
    </SelectedUserProvider>

  )
}

export default App
