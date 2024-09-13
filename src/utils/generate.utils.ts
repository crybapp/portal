import { sign, verify } from 'jsonwebtoken'

export const signToken = (data: string | Record<string, unknown>, key: string, headers: Record<string, unknown> = {}) : string => sign(data, key, headers)

export const verifyToken = (token: string, key: string) : string | object => verify(token, key)
