import { sign, verify } from 'jsonwebtoken'

export const signToken = (data: any, key: string, headers: object = {}) => sign(data, key, headers)
export const verifyToken = (token: string, key: string) => verify(token, key)
