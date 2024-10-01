import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenToLS, getProfileToLS } from 'src/utils/auth'

interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}
const initialAppContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenToLS()),
  setIsAuthenticated: () => null,
  profile: getProfileToLS(),
  setProfile: () => null
}
export const AppContext = createContext<AppContextType>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile, 
        setProfile
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
