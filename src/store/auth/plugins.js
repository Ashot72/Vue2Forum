import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'
import { STORAGE_KEY } from '../../helpers/constants' 

const localStoragePlugin = store => {
  store.subscribe((mutation, { auth: { idToken, refreshToken, email, expiresIn }}) => {
    if (mutation.type === `auth/${ AUTHDATA }` ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ idToken, refreshToken, email, expiresIn }))
    }
    if (mutation.type === `auth/${ CLEARAUTHDATA }`) {
      localStorage.removeItem(STORAGE_KEY)
    } 
  })
}

export default [localStoragePlugin]
