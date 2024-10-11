import { User } from 'src/types/user.type'

//Eventarget dung de lang nghe 1 su kien nao do tren trang web
export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  //lang nghe su kien clearLS
  const clearLSEvent = new Event('clearLS')
  //TRUYEN VAO dispathch de su dung
  localStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenToLS = () => localStorage.getItem('access_token') || ''

export const getProfileToLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
