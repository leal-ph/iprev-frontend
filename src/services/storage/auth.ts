export const TOKEN_KEY = 'bocayuva-auth-token'
export const USER_KEY = 'bocayuva-user'
export const REQ_STATUS = 'req-status'

export const isAuthenticated = () => {
  return localStorage.getItem(TOKEN_KEY) !== null
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getUser = () => {
  return localStorage.getItem(USER_KEY)
}

export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
