import axios from 'axios'
import { TokenStorage } from '../../src/utils'

export const SIGNUP_USER_START = 'SIGNUP_USER_START'
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS'
export const SIGNUP_USER_ERROR = 'SIGNUP_USER_ERROR'

export const GET_USER_START = 'GET_USER_START'
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
export const GET_USER_ERROR = 'GET_USER_ERROR'

export const LOGOUT_USER_START = 'LOGOUT_USER_START'
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS'
export const LOGOUT_USER_ERROR = 'LOGOUT_USER_ERROR'

const tokenStorage = new TokenStorage(localStorage)

export const signupUserStart = () => ({
  type: SIGNUP_USER_START,
})

export const signupUserSuccess = (user) => ({
  type: SIGNUP_USER_SUCCESS,
  payload: { user },
})

export const signupUserError = (error) => {
  return ({
    type: SIGNUP_USER_ERROR,
    payload: { error },
  })
}

export const getUserStart = () => ({
  type: GET_USER_START,
})

export const getUserSuccess = (user) => ({
  type: GET_USER_SUCCESS,
  payload: { user },
})

export const getUserError = (error) => ({
  type: GET_USER_ERROR,
  payload: { error },
})

export const logoutUserStart = () => ({
  type: LOGOUT_USER_START,
})

export const logoutUserSuccess = (user) => ({
  type: LOGOUT_USER_SUCCESS,
  payload: { user },
})

export const logoutUserError = (error) => ({
  type: LOGOUT_USER_ERROR,
  payload: { error },
})

export function signupUser({ firstName, lastName, email, password }) {
  return (dispatch) => {
    dispatch(signupUserStart())
    return axios({
      url: 'http://localhost:8085/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: tokenStorage.getItem('token'),
      },
      data: {
        email,
        password,
        firstName,
        lastName,
      },
    })
      .then((response) => {
        if (response.status == 201) {
          const { firstName, lastName } = response.data.data.customer
          tokenStorage.removeItem('token')
          tokenStorage.setItem('name', `${firstName} ${lastName}`)
          return dispatch(signupUserSuccess(response.data.data))
        }
        else if (response.status == 400) {
          return dispatch(signupUserError(new Error(response.data.message)))
        } else {
          return dispatch(signupUserError(response.data))
        }
      })
      .catch((error) => {
        if (error.response.status == 400) {
          return dispatch(signupUserError(new Error(error.response.data.message)))
        }
        return dispatch(signupUserError(error))
      })
  }
}

export function getUser({ email, password }) {
  return (dispatch) => {
    dispatch(getUserStart())
    return axios({
      url: 'http://localhost:8085/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: tokenStorage.getItem('token'),
      },
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        if (response.status == 200) {
          const { firstName, lastName } = response.data.data.customer
          tokenStorage.removeItem('token')
          tokenStorage.setItem('name', `${firstName} ${lastName}`)
          return dispatch(getUserSuccess(response.data.data))
        }
        dispatch(getUserError(response.data))
      })
      .catch((error) => {
        dispatch(getUserError(error))
      })
  }
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(logoutUserStart())
    return axios({
      url: 'http://localhost:8085/logout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        destroy: true,
      },
    })
      .then(({ data }) => {
        tokenStorage.removeItem('name')
        dispatch(logoutUserSuccess(null))
      })
      .catch((error) => {
        dispatch(logoutUserError(error))
      })
  }
}
