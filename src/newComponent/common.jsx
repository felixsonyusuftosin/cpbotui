import React from 'react'
import './main.css'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

export const Input = ({ label, ...props }) => (
  <div className='form-component'>
    <label className='blue-f roboto'>{label}</label>
    <div className='container'>
      <input {...props} />
    </div>
  </div>
)
export const Submit = ({ children, ...props }) => (
  <div className='form-component'>
    <div className='container2 dark-b'>
      <button type='submit' {...props}>
        {children}
      </button>
    </div>
  </div>
)
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Message = ({ content, open, severity, resetContent}) => { 
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    resetContent('')
  };
return (
  <Snackbar open={Boolean(open)} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity={severity}>
     {content}
  </Alert>
</Snackbar>
)
}