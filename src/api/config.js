export const SOUNCLOUD_CLIENT_ID = '3b3b0aa8045ca036d24515344ae0d60b'
export const LOCALHOST = 'http://localhost:8080'

export const ROUTE = (process.env.NODE_ENV === 'production') ? 'https://api.connectedacademy.io' : 'http://localhost:4000'
// export const ROUTE = 'https://api.connectedacademy.io'

export const WATERCOOLER_API = `${ROUTE}/v1`
export const AUTH_URL = `${ROUTE}/v1/auth/twitter/login`
