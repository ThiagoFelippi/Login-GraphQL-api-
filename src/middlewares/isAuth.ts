import { MiddlewareFn } from "type-graphql";
import { MyContext } from "MyContext";
import jwt from 'jsonwebtoken'

export const isAuth : MiddlewareFn<MyContext> = async ({context}, next) => {
  const header = context.req.headers.authorization

  if(!header){
    return false
  }

  const [ Bearer, token ] = header.split(" ")

  if(!Bearer || !token){
    return false
  }

  const payload = await jwt.verify(token, "treinando_graphql")
  if(!payload){
    return false
  }

  context.payload = payload as any
  return next()
}