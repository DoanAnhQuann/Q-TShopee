import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
//c2
const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),
  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),
  logout: () => http.post('/logout')
}
//c1
// export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)
// export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)
// export const logout = () => http.post('/logout')
export default authApi
