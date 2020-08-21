import React, { useState } from 'react'
import './main.css'
import * as firebase from 'firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useHistory } from 'react-router-dom'
import { Input, Submit, Message } from './common'



export default () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const history  = useHistory()

  const onSubmit = async (e) => {
    e.preventDefault()
    const formValues = new window.FormData(e.target)
    const entries = Object.fromEntries(formValues)
    const { email, password } = entries
    try {
      setLoading(true)
      await firebase.auth().signInWithEmailAndPassword(email, password)
      history.push('/admin')
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
    

  }

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
        const { location } = history
        const { pathname = '/admin' } = location
        history.push('/admin')
      } else {
        history.push('/')
        return 
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  return (
    <div className='main-c'>
       <Message content={error} open={error} severity="error" resetContent={setError} />
      <div className='left dark-b'>
        <div className='image-container'>
          <h1> LOGO </h1>
        </div>
        <div className='box'>
          <h1 className='white-f header open-sans'>
            Are you an Admin? please provide your sign in credentials. Sign up
            as an admin if you dont have one please reach out to the site
            creator to create one for you
          </h1>
        </div>
        <div className='box'>
          <p className='semi-light-f semi-thin roboto p'>
            Manage users on the copbot application using this admin app
          </p>
        </div>
        <div className='box'></div>
      </div>
      <div className='right light-b'>
        <h1 className='dark roboto'>Sign in to your Account</h1>
        <form onSubmit={onSubmit}>
          <Input name='email' label='email' type='email' required />
          <Input name='password' password='password' label='password' type='password' required />
          <Submit className={loading ? 'dark-b loading' : 'dark-b'}>
            {' '}
            {loading ? (
              <CircularProgress color='secondary' />
            ) : (
              <span> Sign in </span>
            )}{' '}
          </Submit>
        </form>
      </div>
    </div>
  )
}
