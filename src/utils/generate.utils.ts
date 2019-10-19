import { sign, verify } from 'jsonwebtoken'

type KeyType = 'portals' | 'streaming'

export const signToken = (data: any, key: KeyType, headers: object = {}) => sign(data, process.env[`${key.toUpperCase()}_KEY`], headers)
export const verifyToken = (token: string, key: KeyType) => verify(token, process.env[`${key.toUpperCase()}_KEY`])
