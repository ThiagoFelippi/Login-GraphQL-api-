import "reflect-metadata";
import express from 'express'
import { createConnection } from 'typeorm';
import { ApolloServer} from 'apollo-server-express'
import { buildSchema } from "type-graphql";

//Resolvers
import {userResolver} from './graphql/userResolvers'

(async () => {
    const port = 4000
    const app = express()


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [userResolver]
        })
    })

    apolloServer.applyMiddleware({app})
    await createConnection() 

    app.listen(port, () => {
        console.log(`App is running at http://localhost:${port}`)
    })
})()
