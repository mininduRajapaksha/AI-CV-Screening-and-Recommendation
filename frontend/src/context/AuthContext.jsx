import { createContext, useContext, useState } from 'react'

import { authApi } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cvision_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = async (email, password) => {
    const response = await authApi.login(email, password)
    const loggedInUser = {
      ...response.user,
      email,
      initials: response.user.name.split(' ').map((word) => word[0]).slice(0, 2).join(''),
    }
    localStorage.setItem('cvision_token', response.token)
    localStorage.setItem('cvision_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = (data) => authApi.register(data)

  const logout = () => {
    localStorage.removeItem('cvision_token')
    localStorage.removeItem('cvision_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
