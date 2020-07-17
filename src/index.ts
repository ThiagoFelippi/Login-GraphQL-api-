import { User } from './entity/User';
import jwt  from 'jsonwebtoken';
import "reflect-metadata";
import express from 'express'
import { createConnection } from 'typeorm';
import { ApolloServer} from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import cookieParser from 'cookie-parser'

//Resolvers
import {userResolver} from './graphql/userResolvers'

(async () => {
    const port = 4000
    const app = express()

    app.use(cookieParser())
    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies["@refresh/token"]
        if( !token ){
            return res.send({ok: false, acessToken: ""})
        }

        let payload : any;
        try{
            payload = jwt.verify(token, "refresh_token")
        }catch(err){
            console.log(err)
        }
        
        const user = await User.findOne({id:  payload.userId})
        if(!user){
            return res.send({ok: false, acessToken: ""})
        }

        return res.send({ok: true, acessToken: jwt.sign(
            {userId: user.id},
            "treinando_graphql",
            {
                expiresIn: 86400
            }
        )})
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [userResolver]
        }),
        context: ({ req,  res }) => ({ req,  res })
    })

    apolloServer.applyMiddleware({app})
    await createConnection() 

    app.listen(port, () => {
        console.log(`App is running at http://localhost:${port}`)
    })
})()
