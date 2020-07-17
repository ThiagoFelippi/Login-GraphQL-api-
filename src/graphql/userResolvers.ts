import { MyContext } from './../../MyContext';
import { User } from '../entity/User';
import { Resolver, Mutation, Arg, Query, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isAuth } from '../middlewares/isAuth';

@ObjectType()
class LoginType{
  @Field()
  user: User

  @Field()
  token: string
}

@Resolver()
export class userResolver{

  @Query(() => [User])
  async getUsers(){
    return await User.find()
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() {payload} : MyContext
  ){
    return `Your use id is ${payload.userId}`
  }

  @Mutation(() => LoginType )
  async login(
    @Arg("email", () => String) email: string, 
    @Arg("password", () => String) password: string,
    @Ctx() { res } : MyContext
  ) : Promise<LoginType>{
    const user = await User.findOne({where: {email}})

    if(user){
      const comparePassword = await bcrypt.compare(password, user.password)

      const token = jwt.sign({userId: user.id}, "treinando_graphql", {
        expiresIn: 86400
      })

      if(comparePassword){

        res.cookie("@refresh/token", jwt.sign({userId: user.id}, "refresh_token", {
          expiresIn: "365d"
        }), {
          httpOnly: true
        }
        
        )

        return {
          user,
          token
        }
      }
      throw new Error("Incorrect password")
    }
    throw new Error("Incorrect email")
  }

  @Mutation(() => User)
  async register(
    @Arg("email", () => String) email: string, 
    @Arg("password", () => String) password: string
  ){
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword
    }).save()
    return user
  }
}