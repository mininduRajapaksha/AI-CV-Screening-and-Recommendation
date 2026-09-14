import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Minindu R.',
    role: 'HR Manager',
    initials: 'MR'
  })

  const login = (email) => {
    setUser({ name: 'Minindu R.', role: 'HR Manager', initials: 'MR', email })
    return true
  }
  const register = (data) => {
    setUser({ name: data.name || 'Minindu R.', role: data.role || 'HR Manager', initials: 'MR' })
    return true
  }
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
