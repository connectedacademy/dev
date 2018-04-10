export const SOUNCLOUD_CLIENT_ID = '3b3b0aa8045ca036d24515344ae0d60b'
export const LOCALHOST = 'http://localhost:8080'

export const WATERCOOLER_API = (process.env.NODE_ENV === 'production') ? 'https://api.connectedacademy.io/v1' : 'http://localhost:4000/v1'
export const AUTH_URL = (process.env.NODE_ENV === 'production') ? 'https://api.connectedacademy.io/v1/auth/login' : 'http://localhost:4000/v1/auth/login'
export const SOCKET_API = (process.env.NODE_ENV === 'production') ? 'https://api.connectedacademy.io' : 'http://localhost:4000'
