import React, { useContext , useState, useMemo} from 'react'


const UserContext = React.createContext()
/**
  Branding related context api
 */
const useSelectedUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    console.error(' Please call within a BrandingProvider(ThemeProvider)')
    throw new Error('useAuth must be used within a BrandingProvider(ThemeProvider)ƒ')
  }
  return context
}
export const SelectedUderProvider = props => {
  const [ selectedUser, setSelecteduser] = useState(null)

  const selectUser = React.useCallback((user => {
    setSelecteduser(user)
  }), [])

  const value = useMemo(() => ({ selectUser, selectedUser}), [selectUser, selectedUser])

  return (<UserContext.Provider value={value} {...props} />)
}

export { UserContext, useSelectedUser }
